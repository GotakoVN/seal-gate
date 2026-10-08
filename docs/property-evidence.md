# Mandatory Property mutation evidence

`Seal.review(input, { propertyEvidenceVerifier })` accepts a trusted application
callback separately from the agent's input JSON. Mandatory `#### Property:`
blocks under MUST/SHALL requirements require contract descriptors in
`context.property_contracts`. Ordinary Scenarios, optional Properties and
`plan_review` retain their existing behavior.

The harness derives IDs from its shared parser and pins each contract digest.
Its callback must execute the actual local runner, verify current source, test,
generator, corpus and runner bindings, and rerun isolated production mutations.
A raw `status`, `verified`, run count or `equivalence_verified` flag supplied by
the agent is never a substitute for that callback. The callback is trusted
application code; this API does not sandbox malicious application code.

Missing, stale, under-run or unseeded execution evidence blocks. Every applicable
mutation must be killed or independently reviewed as equivalent. Survived,
invalid and unavailable outcomes block, including syntax/import/setup failures.
Equivalence requires a pinned human operator key outside the project, a signature
bound to the actual surviving probe and current replay. At least one meaningful
mutant must still be killed; equivalent-only evidence remains untested.

PMUST findings force BLOCK regardless of trust score or LLM recommendations.
Finite property samples do not prove correctness or trading alpha.

The Orca bridge uses executable receipts from its production mutation runner.
The older advisory `checkTestPinsBehavior` helper is not suitable evidence for
mandatory Properties and is not used by this policy.
