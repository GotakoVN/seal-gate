import { it, expect } from 'bun:test'
import { Seal } from '../../src/index.js'

function input(title: string, description: string) {
  return { artifact_type: 'code_diff' as const,
    spec: `### Requirement: ${title}\n${description}\n\n#### Property: independence\n- **FOR ALL** x: an input\n- **THEN** output is stable\n- **RUNS** 10`,
    output: 'Routine returns consistent values.', risk_hint: 'LOW' as const,
    evidence: { test_log: '10 inputs evaluated', build_log: 'Build passed', diff: '', references: [] }, context: {} }
}
it('canonical Property strength default blocks omitted evidence', async () => {
  for (const title of ['Independence', 'MAY independence']) {
    const result = await Seal.review(input(title, 'Output stays stable.'))
    expect(result.verdict).toBe('BLOCK')
    expect(result.blocking_issues.some(i => i.rule_id === 'PMUST-01')).toBe(true)
  }
})
it('canonical Property strength ignores title keywords and preserves explicit optional prose', async () => {
  const result = await Seal.review(input('MUST independence', 'Output SHOULD stay stable.'))
  expect(result.blocking_issues.some(i => i.rule_id?.startsWith('PMUST-'))).toBe(false)
})
it('canonical Property strength default permits fresh verified mutation evidence', async () => {
  const hash = 'a'.repeat(64)
  const raw = { ...input('Independence', 'Output stays stable.'), context: { property_contracts: [
    { id: 'independence', priority: 'MUST', runs: 10, contract_sha256: hash } ] } }
  const result = await Seal.review(raw, { propertyEvidenceVerifier: async () => [
    { property_id: 'independence', contract_sha256: hash, status: 'verified', fresh: true,
      runs_actual: 10, seed: 42, mutants: [{ id: 'future-input', outcome: 'killed' }] } ] })
  expect(result.blocking_issues.some(i => i.rule_id?.startsWith('PMUST-'))).toBe(false)
})
