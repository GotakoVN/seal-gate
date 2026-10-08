import { describe, it, expect, afterEach } from 'bun:test'
import { Seal } from '../../src/index.js'

const digest = 'a'.repeat(64)
const contract = { id: 'no-lookahead-future-independence', priority: 'MUST', runs: 1000, contract_sha256: digest }
const spec = `### Requirement: No lookahead
The strategy MUST NOT use future data.

#### Property: future-independence
- **FOR ALL** bars: a series
- **THEN** a future replacement preserves earlier signals
- **RUNS** 1000`
function input() {
  return { artifact_type: 'code_diff' as const, spec, output: 'Routine returns consistent values.',
    evidence: { test_log: '1000 samples passed; negative case rejects future input', build_log: 'Build passed', diff: '', references: [] },
    risk_hint: 'LOW' as const, context: { property_contracts: [contract] } }
}
function review() {
  return { property_id: contract.id, contract_sha256: digest, status: 'verified', fresh: true,
    runs_actual: 1000, seed: 20261006,
    mutants: [{ id: 'future-data', outcome: 'killed' }] }
}
const options = (result = review()) => ({ propertyEvidenceVerifier: async () => [result] })
afterEach(() => { Seal.withLLM(null); Seal.withTrustMemory(null) })

describe('mandatory Property evidence policy', () => {
  it('missing trusted verifier blocks MUST evidence including JSON-claimed certification', async () => {
    const raw = input()
    raw.context = { ...raw.context, property_reviews: [review()], verified: true } as typeof raw.context
    const result = await Seal.review(raw)
    expect(result.verdict).toBe('BLOCK')
    expect(result.blocking_issues.some(i => i.rule_id === 'PMUST-01')).toBe(true)
  })

  it.each(['must not', 'SHALL NOT'])('mandatory %s spec strength cannot bypass evidence by omitting context', async strength => {
    const raw = { ...input(), spec: spec.replace('MUST NOT', strength), context: {} }
    expect((await Seal.review(raw)).verdict).toBe('BLOCK')
  })

  it.each(['survived', 'invalid', 'unavailable'])('%s mutant blocks regardless of a high score or optimistic LLM', async outcome => {
    let llmCalls = 0
    Seal.withLLM({ review: async () => {
      llmCalls++
      return { confidence: 1, issues: [], contradictions: [], hallucinations: [], ambiguities: [], uncertainty_signals: [] }
    } })
    const result = review()
    result.mutants = [{ id: 'future-data', outcome }]
    const verdict = await Seal.review(input(), options(result))
    expect(verdict.verdict).toBe('BLOCK')
    expect(verdict.trust_score).toBeGreaterThanOrEqual(80)
    expect(llmCalls).toBe(1)
    expect(verdict.blocking_issues.some(i => i.rule_id === 'PMUST-03')).toBe(true)
  })

  it('fresh verified execution and a meaningful killed mutant permits ordinary gate evaluation', async () => {
    const result = await Seal.review(input(), options())
    expect(['PASS', 'PASS_WITH_WARNINGS']).toContain(result.verdict)
    expect(result.blocking_issues.some(i => i.rule_id?.startsWith('PMUST-'))).toBe(false)
  })

  it('stale, under-run or seedless execution cannot establish a passing Property', async () => {
    for (const delta of [{ fresh: false }, { runs_actual: 999 }, { seed: undefined }]) {
      const result = await Seal.review(input(), options({ ...review(), ...delta }))
      expect(result.verdict).toBe('BLOCK')
      expect(result.blocking_issues.some(i => i.rule_id === 'PMUST-02')).toBe(true)
    }
  })

  it('unverified equivalence blocks even alongside a genuine killed mutant', async () => {
    const result = review()
    result.mutants.push({ id: 'equivalent-future-data', outcome: 'equivalent', equivalence_verified: false })
    expect((await Seal.review(input(), options(result))).verdict).toBe('BLOCK')
  })

  it('independently verified equivalence excludes a mutant while preserving a meaningful kill', async () => {
    const result = review()
    result.mutants.push({ id: 'equivalent-future-data', outcome: 'equivalent', equivalence_verified: true })
    expect(['PASS', 'PASS_WITH_WARNINGS']).toContain((await Seal.review(input(), options(result))).verdict)
  })

  it('equivalent-only evidence is untested even with independent verified reviews', async () => {
    const result = review()
    result.mutants = [{ id: 'equivalent-future-data', outcome: 'equivalent', equivalence_verified: true }]
    const verdict = await Seal.review(input(), options(result))
    expect(verdict.verdict).toBe('BLOCK')
    expect(verdict.blocking_issues.some(i => i.rule_id === 'PMUST-04')).toBe(true)
  })

  it('missing, duplicate or mismatched contract review cannot cover mandatory Properties', async () => {
    for (const reviews of [[], [review(), review()], [{ ...review(), contract_sha256: 'b'.repeat(64) }],
      [{ ...review(), property_id: 'another-property' }]]) {
      expect((await Seal.review(input(), { propertyEvidenceVerifier: async () => reviews })).verdict).toBe('BLOCK')
    }
  })

  it('verifier errors and malformed data fail closed without accepting raw certification', async () => {
    expect((await Seal.review(input(), { propertyEvidenceVerifier: async () => { throw new Error('Runner unavailable') } })).verdict).toBe('BLOCK')
    expect((await Seal.review(input(), { propertyEvidenceVerifier: async () => [{ ...review(), mutants: null }] })).verdict).toBe('BLOCK')
  })

  it('optional Properties and ordinary Scenarios keep compatible gate evaluation', async () => {
    const optional = input()
    optional.spec = spec.replace('MUST NOT', 'SHOULD NOT')
    optional.context.property_contracts = [{ ...contract, priority: 'SHOULD' }]
    expect(['PASS', 'PASS_WITH_WARNINGS']).toContain((await Seal.review(optional)).verdict)
    const ordinary = input()
    ordinary.spec = 'Routine returns consistent values.'
    ordinary.context.property_contracts = []
    expect(['PASS', 'PASS_WITH_WARNINGS']).toContain((await Seal.review(ordinary)).verdict)
  })

  it('a plan for a future MUST Property does not require implementation mutation evidence', async () => {
    const raw = { ...input(), artifact_type: 'plan_review' as const, output: 'Implement the routine and run its tests.' }
    const result = await Seal.review(raw)
    expect(result.blocking_issues.some(i => i.rule_id?.startsWith('PMUST-'))).toBe(false)
  })
})
