# Self-Check

## Claims
- SC-1: every adverse or unverified mandatory Property case blocks regardless of score and optimistic LLM.
- SC-2: current execution with a meaningful kill permits normal policy evaluation.
- SC-3: independently signed equivalence may exclude a mutant, but equivalent-only evidence is untested.
- SC-4: optional Property, Scenario and plan review behavior remains compatible.
- SC-5: real Orca runner/probe/signature integration reaches this built Seal API offline.

## Evidence
```json
[
  {
    "type": "command",
    "command": "npm run build",
    "exit_code": 0,
    "output": "TypeScript build passed."
  },
  {
    "type": "command",
    "command": "ORCA_TEST_ROOT=<owned Orca candidate> npm test",
    "exit_code": 0,
    "output": "204 pass, 0 fail across 27 files, plus 8/8 Vietnamese checks. Native raw log retained in .harness/evidence/native-final.log. Regression tests reproduce the original erroneous PASS: missing trusted verifier, survived/invalid/unavailable mutants under optimistic LLM and unverified equivalence. They failed in the preserved RED reports and pass in the final native suite."
  },
  {
    "type": "command",
    "command": "ORCA_TEST_ROOT=<owned Orca candidate> node node_modules/vitest/vitest.mjs run --reporter=json",
    "exit_code": 0,
    "output": "16 passed, zero failed. Raw report sha256 a70da194754222734700aa764aaeb09cd39c8dcd606400d40171978cca163271. passed: [compatible-local-integration-real-receipt-bridge] actual runner evidence reaches the packaged Seal policy offline; passed: mandatory Property evidence policy missing trusted verifier blocks MUST evidence including JSON-claimed certification; passed: mandatory Property evidence policy mandatory must not spec strength cannot bypass evidence by omitting context; passed: mandatory Property evidence policy mandatory SHALL NOT spec strength cannot bypass evidence by omitting context; passed: mandatory Property evidence policy survived mutant blocks regardless of a high score or optimistic LLM; passed: mandatory Property evidence policy invalid mutant blocks regardless of a high score or optimistic LLM; passed: mandatory Property evidence policy unavailable mutant blocks regardless of a high score or optimistic LLM; passed: mandatory Property evidence policy fresh verified execution and a meaningful killed mutant permits ordinary gate evaluation; passed: mandatory Property evidence policy stale, under-run or seedless execution cannot establish a passing Property; passed: mandatory Property evidence policy unverified equivalence blocks even alongside a genuine killed mutant; passed: mandatory Property evidence policy independently verified equivalence excludes a mutant while preserving a meaningful kill; passed: mandatory Property evidence policy equivalent-only evidence is untested even with independent verified reviews; passed: mandatory Property evidence policy missing, duplicate or mismatched contract review cannot cover mandatory Properties; passed: mandatory Property evidence policy verifier errors and malformed data fail closed without accepting raw certification; passed: mandatory Property evidence policy optional Properties and ordinary Scenarios keep compatible gate evaluation; passed: mandatory Property evidence policy a plan for a future MUST Property does not require implementation mutation evidence. Actual bridge includes killed, survived, syntax-invalid, unavailable, signed equivalent plus kill, equivalent-only, and forged equivalence. Verified contract mapping: mutation policy returns BLOCK regardless of score or LLM optimism \u2014 survived/invalid/unavailable tests assert high trust and an invoked optimistic LLM still produce BLOCK; real bridge independently asserts BLOCK for adverse outcomes. Fresh verified execution with a kill permits ordinary evaluation \u2014 asserts no PMUST blockers, not unconditional general PASS. Independent verified review with kill excludes an equivalent; all-equivalent blocks PMUST-04. Ordinary Scenario and future plan tests assert no PMUST finding."
  }
]
```

## Known Limitations
- The trusted verifier is application code, not an OS sandbox. Agent JSON cannot supply it.
- Finite sampled runs cannot prove mathematical correctness or alpha.
- Local deployment and draft PR are still pending; the recorded tests exercise candidate builds.
- Optional LLM semantic review was not enabled for the delivery gate; optimistic LLM is an explicit policy regression fixture.

## Unresolved Assumptions
- Operators pin human equivalence keys outside the project; generated test keys are fixtures only.
