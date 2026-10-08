import { makeIssue, type SealInput, type SealIssue } from '../types.js'

export interface PropertyContract {
  id: string
  priority: 'MUST' | 'SHOULD' | 'MAY'
  runs: number
  contract_sha256: string
}

/** Produced by trusted harness code after checking current executable receipts. */
export interface PropertyEvidenceReview {
  property_id: string
  contract_sha256: string
  status: 'verified' | 'invalid' | 'unavailable'
  fresh: boolean
  runs_actual: number
  seed: number
  mutants: Array<{
    id: string
    outcome: 'killed' | 'survived' | 'equivalent' | 'invalid' | 'unavailable'
    /** The harness verified the independently pinned operator's signature. */
    equivalence_verified?: boolean
  }>
}

export interface PropertyReviewOptions {
  /**
   * Trusted application code, separate from raw JSON. It must check the actual
   * runner, source/test/generator/corpus bindings and equivalence signatures.
   * A verdict or "verified" flag supplied in input.context never substitutes.
   */
  propertyEvidenceVerifier?: (
    input: Readonly<SealInput>,
    contracts: readonly PropertyContract[],
  ) => Promise<readonly PropertyEvidenceReview[]>
}

function mandatoryPropertyCount(spec: string | null): number {
  if (!spec) return 0
  return spec.split(/^\s*###\s+Requirement:/im).slice(1).reduce((count, section) => {
    // Match Orca's description boundary, RFC2119 precedence and default SHALL.
    // The requirement title does not determine its strength.
    const description = section.split('\n').slice(1).join('\n')
      .split(/^####\s+(?:Scenario|Property):/m)[0]
    const strength = ['SHALL', 'MUST', 'SHOULD', 'MAY']
      .find(keyword => description.includes(keyword)) ?? 'SHALL'
    if (strength !== 'MUST' && strength !== 'SHALL') return count
    return count + (section.match(/^\s*####\s+Property:/gim)?.length ?? 0)
  }, 0)
}

function issue(rule: string, detail: string): SealIssue {
  return makeIssue({
    type: 'SPEC_UNTESTED', severity: 'HIGH', layer: 'L4', source: 'core',
    rule_id: rule, required_verdict: 'BLOCK',
    evidence: detail,
    required_fix: 'Provide fresh executable Property evidence and meaningful isolated mutation kills through the trusted harness verifier',
  })
}

const digestPattern = /^[a-f0-9]{64}$/
function contractsFrom(value: unknown): PropertyContract[] | null {
  if (!Array.isArray(value)) return null
  const result: PropertyContract[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' ||
      !/^[a-z0-9][a-z0-9-]*$/.test(item.id) ||
      !['MUST', 'SHOULD', 'MAY'].includes(item.priority) ||
      !Number.isSafeInteger(item.runs) || item.runs <= 0 ||
      typeof item.contract_sha256 !== 'string' || !digestPattern.test(item.contract_sha256)) return null
    result.push({ id: item.id, priority: item.priority, runs: item.runs, contract_sha256: item.contract_sha256 })
  }
  return new Set(result.map(p => p.id)).size === result.length ? result : null
}

/** Policy only: the separately supplied harness proves where each fact came from. */
export async function evaluatePropertyEvidence(input: SealInput, options: PropertyReviewOptions = {}): Promise<SealIssue[]> {
  if (input.artifact_type === 'plan_review') return []
  const count = mandatoryPropertyCount(input.spec)
  const raw = input.context?.property_contracts
  if (raw === undefined && count === 0) return []
  const contracts = contractsFrom(raw)
  if (!contracts) return [issue('PMUST-01', 'Missing or malformed Property contracts; raw certification is not executable evidence')]
  const required = contracts.filter(p => p.priority === 'MUST')
  if (required.length < count) return [issue('PMUST-01', 'Mandatory Properties are missing from the harness contract set')]
  if (!required.length) return []
  if (typeof options.propertyEvidenceVerifier !== 'function') {
    return [issue('PMUST-01', 'MUST Property evidence requires a trusted verifier, separately supplied from raw input')]
  }

  let reviews: readonly PropertyEvidenceReview[]
  try {
    reviews = await options.propertyEvidenceVerifier(input, required)
  } catch (error) {
    return [issue('PMUST-01', `Property evidence verifier unavailable: ${String(error).slice(0, 500)}`)]
  }
  if (!Array.isArray(reviews) || reviews.length !== required.length ||
    new Set(reviews.map(r => r?.property_id)).size !== reviews.length) {
    return [issue('PMUST-01', 'Verifier must cover every mandatory Property exactly once')]
  }
  const findings: SealIssue[] = []
  for (const contract of required) {
    const review = reviews.find(r => r?.property_id === contract.id)
    if (!review || review.contract_sha256 !== contract.contract_sha256 ||
      review.status !== 'verified' || review.fresh !== true ||
      !Number.isSafeInteger(review.runs_actual) || review.runs_actual < contract.runs ||
      !Number.isInteger(review.seed) || review.seed < -2147483648 || review.seed > 2147483647) {
      findings.push(issue('PMUST-02', `${contract.id}: fresh seeded execution matching the current contract and RUNS was not established`))
      continue
    }
    const mutants = review.mutants
    if (!Array.isArray(mutants) || !mutants.length ||
      mutants.some(m => !m || typeof m.id !== 'string' || !m.id.trim()) ||
      new Set(mutants.map(m => m.id)).size !== mutants.length) {
      findings.push(issue('PMUST-03', `${contract.id}: isolated mutation evidence is missing or malformed`))
      continue
    }
    const unresolved = mutants.filter(m => m.outcome !== 'killed' &&
      !(m.outcome === 'equivalent' && m.equivalence_verified === true))
    if (unresolved.length) {
      findings.push(issue('PMUST-03', `${contract.id}: unresolved mutations ${unresolved.map(m => `${m.id} (${m.outcome})`).join(', ')}`))
    }
    if (!mutants.some(m => m.outcome === 'killed')) {
      findings.push(issue('PMUST-04', `${contract.id}: no meaningful mutant was killed; equivalent-only evidence remains untested`))
    }
  }
  return findings
}
