# Intent: Canonical Property strength default

## Problem
Seal counts only explicit MUST/SHALL prose, whereas the canonical Orca parser defaults keyword-absent requirement descriptions to SHALL and ignores the requirement title for strength. This can omit required mutation checks when contracts are absent.

## Desired Outcome
Seal uses the canonical strength default, precedence and description boundary for its mandatory Property count, without adding a parser/runtime dependency or changing IDs.

## Non-Goals
No registry publication, merge, provider changes or semantic proof from finite tests. Optional Properties remain optional; future plan review remains compatible.

## Success Criteria
- SC-1: keyword-absent Property requirements block when evidence is missing.
- SC-2: a strength word in a title does not override the description; explicit optional prose remains optional.
- SC-3: default-SHALL evidence with a genuine verified kill reaches ordinary gate evaluation.

## Intent Approval
Status: APPROVED
Source: Thoor Telegram2032: revise review findings if they make sense. Scope is the demonstrated canonical-strength defect, not an agent-authored approval.
