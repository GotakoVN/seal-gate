# Design

Seal owns a deterministic Property evidence policy. Raw JSON can describe a contract but cannot certify its own execution or equivalence review. `Seal.review` accepts a trusted verifier callback separately from raw input; without that callback mandatory Property evidence fails closed. The callback validates actual current runner/report/source/test/generator/corpus bindings and operator signatures in Orca, returning typed findings that Seal checks for contract coverage, freshness and resolved mutations.

Seal detects mandatory Property presence structurally to require evidence, without inventing Property IDs. Orca's shared parser derives those IDs and all detailed execution contracts. A code gate with mandatory Properties requires complete matching verified reviews, at least one meaningful killed mutant per Property, and no invalid, unavailable, unreviewed-equivalent or surviving mutants. Plan review describes future work and does not require implementation mutation receipts.

Add policy findings to the main review pipeline and enforce BLOCK regardless of numeric score or LLM optimism. No adapter, malformed data or adapter exceptions become passing evidence. An operator-reviewed equivalent survivor may be excluded only after the trusted verifier establishes its signature and fresh execution; equivalent-only evidence is insufficient.

Use Bun tests for the native Seal suite and a small Vitest alias configuration for the same new tests so deployed Orca can execute its supported adapter and archive genuine reporter evidence. Integrate with Orca through a follow-on bridge and packaged local Seal candidate; keep registry publication/review separate from local deployment.
