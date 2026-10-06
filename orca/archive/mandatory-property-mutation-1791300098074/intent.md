# Intent: Blocking MUST Property mutation evidence

## Problem
Orca records actual seeded Property runs and isolated production mutation outcomes, but Seal has no blocking policy for those records. A surviving or unavailable probe can still accompany a passing code gate.

## Desired Outcome
Seal prevents MUST Properties from passing without fresh executable evidence and meaningful mutation kills. Equivalence is accepted only through independently verified operator review, and cannot replace every meaningful kill.

## Non-Goals
No mathematical correctness or trading alpha claim. No second Property ID grammar. No GitHub requirement. No automatic approval, provider choice, merge or registry publication. The existing legacy assertion-flipping advisory probe is not executable Property evidence.

## Success Criteria
- SC-1: missing, forged, stale, invalid, unavailable or surviving MUST evidence blocks even when score/LLM are favorable.
- SC-2: fresh validated execution plus at least one killed mutant and no unresolved mutants can pass the mutation policy.
- SC-3: independently verified equivalence can exclude one mutant but an equivalent-only set remains untested.
- SC-4: optional Properties, ordinary Scenario gates and plan review retain compatible behavior.
- SC-5: actual Orca execution/receipt validation reaches the Seal decision in a local integration test and the deployed CLI.

## Intent Approval
Status: APPROVED
Source: Thoor's authorized campaign (Telegram message 1946: finish Orca, then Seal, Pilotfish and Hammerhead) and 2026-10-06 continuation/full-permission message. This implements the already requested blocking mutation rule for Property MUST; no agent-issued approval is inferred.
