import { expect, it } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

// Explicit candidate/deployed Orca path: the native Seal suite has no runtime
// dependency on Orca. Release verification requires this integration test.
const orcaRoot = process.env.ORCA_TEST_ROOT;
it.skipIf(!orcaRoot)('[compatible-local-integration-real-receipt-bridge] actual runner evidence reaches the packaged Seal policy offline', () => {
  const script = String.raw`
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,readdirSync,symlinkSync,rmSync} from 'node:fs';
import {generateKeyPairSync,sign} from 'node:crypto';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {pathToFileURL} from 'node:url';import {execFileSync,spawnSync} from 'node:child_process';
const orca=process.env.ORCA_TEST_ROOT,seal=process.env.SEAL_TEST_ROOT;
const {createPropertySealBridge}=await import(pathToFileURL(join(orca,'dist/harness/property-seal.js')));
const {probeMutation,equivalenceDigest}=await import(pathToFileURL(join(orca,'dist/property/mutation.js')));
const {readTestContract}=await import(pathToFileURL(join(orca,'dist/verify/change.js')));
const {hashBytes}=await import(pathToFileURL(join(orca,'dist/verify/execution.js')));
const {Seal}=await import(pathToFileURL(join(seal,'dist/index.js')));
const results=[];
for(const [kind,after] of [['killed','export const value=3;'],['survived','export const value=2+0;'],['invalid','export const value=!!!;'],['unavailable',null],['equivalent','export const value=2+0;'],['equivalent-only','export const value=2+0;'],['forged-equivalence','export const value=2+0;']]){
 const root=mkdtempSync(join(tmpdir(),'seal-orca-live-'));const keys=mkdtempSync(join(tmpdir(),'seal-orca-keys-'));try{
 const dir=join(root,'orca/changes/demo');mkdirSync(join(dir,'specs/demo'),{recursive:true});mkdirSync(join(root,'tests'));
 const spec='## ADDED Requirements\n### Requirement: Value\nThe value MUST equal two.\n#### Property: correct\n- **FOR ALL** n: integer\n- **THEN** value equals two\n- **RUNS** 10\n';
 writeFileSync(join(dir,'specs/demo/spec.md'),spec);writeFileSync(join(root,'package.json'),'{}');writeFileSync(join(root,'.gitignore'),'node_modules\n');writeFileSync(join(root,'source.js'),'export const value=2;');
 writeFileSync(join(dir,'.traceability.yaml'),JSON.stringify({scenarios:[{scenario:'value-correct',test:'tests/value.test.js',generators:['tests/value.test.js'],corpus:'orca/corpus/value-correct.json'}]}));
 const helper=pathToFileURL(join(orca,'dist/property/runtime.js')).href;
 writeFileSync(join(root,'tests/value.test.js'),"import {it,expect} from 'vitest';import {value} from '../source.js';import {assertProperty,fc} from "+JSON.stringify(helper)+";it('[value-correct]',async()=>{const r=await assertProperty({id:'value-correct',seed:31,numRuns:10,corpus:'orca/corpus/value-correct.json',arbitrary:fc.integer(),predicate:()=>value===2});expect(r.failed).toBe(false);});");
 symlinkSync(process.env.ORCA_TEST_NODE_MODULES||join(orca,'node_modules'),join(root,'node_modules'),'dir');execFileSync('git',['init','-q'],{cwd:root});execFileSync('git',['add','.'],{cwd:root});execFileSync('git',['-c','user.name=fixture','-c','user.email=f@example.invalid','commit','-qm','base'],{cwd:root});
 const selection=readTestContract(root,dir,'demo').selection;
 let reviewersFile;
 if(after){const p=probeMutation(root,selection,{version:1,id:'value-mutant',rationale:'Change required value',changes:[{path:'source.js',before_sha256:hashBytes(readFileSync(join(root,'source.js'))),after}]});
 if(kind.includes('equivalent')||kind==='forged-equivalence'){
 const pair=generateKeyPairSync('ed25519');reviewersFile=join(keys,'reviewers.json');writeFileSync(reviewersFile,JSON.stringify({version:1,reviewers:[{id:'owner',kind:'human',publicKey:pair.publicKey.export({type:'spki',format:'pem'})}]}));
 const rationale='Arithmetic identity',digest=equivalenceDigest(p,rationale);p.status='equivalent';p.equivalence={reviewer:'owner',rationale,digest,signature:sign(null,Buffer.from(JSON.stringify(['orca-property-equivalence/v1',digest])),pair.privateKey).toString('base64')};
 if(kind==='forged-equivalence')p.equivalence.rationale='Different claim';
 }
 mkdirSync(join(dir,'.harness/property-probes'),{recursive:true});writeFileSync(join(dir,'.harness/property-probes/value-mutant.json'),JSON.stringify(p));
 if(kind==='equivalent'){const kill=probeMutation(root,selection,{version:1,id:'meaningful-kill',rationale:'Violate required value',changes:[{path:'source.js',before_sha256:hashBytes(readFileSync(join(root,'source.js'))),after:'export const value=3;'}]});writeFileSync(join(dir,'.harness/property-probes/meaningful-kill.json'),JSON.stringify(kill));}
 }
 const bridge=createPropertySealBridge(root,dir,'demo',{reviewersFile});let review;
 if(process.env.ORCA_TEST_GATE_CLI){
 const fence=String.fromCharCode(96).repeat(3);writeFileSync(join(dir,'self-check.md'),'# Self-Check\n\n## Claims\n- value equals two\n\n## Evidence\n'+fence+'json\n'+JSON.stringify([{type:'command',command:'npm test',exit_code:0,output:'Property value equals two; actual seeded mutation regression evidence'}])+'\n'+fence+'\n');
 const cliRun=spawnSync(process.execPath,[process.env.ORCA_TEST_GATE_CLI,'gate-code','demo'],{cwd:root,encoding:'utf8',env:{...process.env,ORCA_REVIEWERS_FILE:reviewersFile}});
 const verdictDir=join(dir,'.harness/gate-verdicts'),latest=readdirSync(verdictDir).filter(p=>p.endsWith('.json')).sort().at(-1);
 if(!latest)throw Error('No installed gate receipt: '+cliRun.stdout+cliRun.stderr);
 review=JSON.parse(readFileSync(join(verdictDir,latest),'utf8'));
 }else review=await Seal.review({artifact_type:'code_diff',spec,output:'value equals two',context:{property_contracts:bridge.contracts}},{propertyEvidenceVerifier:bridge.verify});
 results.push({kind,verdict:review.verdict,pmust:review.blocking_issues.filter(i=>i.rule_id?.startsWith('PMUST')).map(i=>i.rule_id)});
 }finally{rmSync(root,{recursive:true,force:true});rmSync(keys,{recursive:true,force:true});}
}
console.log(JSON.stringify(results));`;
  const results = JSON.parse(execFileSync('node', ['--input-type=module', '-e', script], {
    cwd: resolve('.'), encoding: 'utf8', timeout: 120000,
    env: { ...process.env, ORCA_TEST_ROOT: resolve(orcaRoot!), SEAL_TEST_ROOT: resolve(process.env.SEAL_TEST_ROOT ?? '.') },
  }));
  expect(results).toHaveLength(7);
  expect(results[0]).toMatchObject({kind:'killed',pmust:[]});
  for (const result of results.slice(1,4)) {
    expect(result.verdict).toBe('BLOCK');
    expect(result.pmust).toContain('PMUST-03');
  }
  expect(results[4]).toMatchObject({kind:'equivalent',pmust:[]});
  expect(results[5]).toMatchObject({kind:'equivalent-only',verdict:'BLOCK'});
  expect(results[5].pmust).toContain('PMUST-04');
  expect(results[6]).toMatchObject({kind:'forged-equivalence',verdict:'BLOCK'});
  expect(results[6].pmust).toContain('PMUST-03');
}, 120000);
