# Plan

- [x] S1 — Write failing policy tests in tests/property/policy.test.ts for missing/forged/stale/surviving/invalid/unavailable evidence and equivalent-only evidence; implement src/property/policy.ts and its public contract types.
- [x] S2 — Write failing Seal.review tests for hard BLOCK with optimistic LLM/score and no raw-JSON certification; wire a separate trusted verifier into src/index.ts and enforce the finding in src/engine/policy-engine.ts.
- [x] S3 — Test optional Property, Scenario and plan-review compatibility; document adapter trust, signatures and actual mutation outcomes, and expose the policy API.
- [ ] S4 — Run build/native full suite/Orca mapped Vitest/gates/archive; package/deploy Seal with rollback and a draft PR.
- [ ] S5 — Wire and test real Orca seeded execution and isolated mutation/signature validation through the Seal API, then package/deploy the local Orca bridge without a registry publish or GitHub requirement.

## Locked criteria mapping
- SC-1: S1/S2/S5 block every unverified or adverse MUST case and preserve actual raw evidence.
- SC-2: S1/S2/S5 establish positive actual execution and at least one kill.
- SC-3: S1/S5 verify operator-reviewed equivalence independently and reject all-equivalent sets.
- SC-4: S3 preserves optional, Scenario and plan review operation.
- SC-5: S4/S5 prove packaged/deployed local integration with real runners and mutation receipts.
