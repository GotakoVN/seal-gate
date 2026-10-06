# mandatory-property-mutation Specification

## Requirements

### Requirement: Mandatory mutation evidence

Seal MUST block unverified or adverse evidence for required Properties.

#### Scenario: Missing verifier

- **WHEN** a MUST Property has missing or JSON-claimed evidence without a trusted verifier
- **THEN** its mutation policy returns BLOCK

#### Scenario: Adverse outcome

- **WHEN** a mandatory Property has surviving, invalid, unavailable or stale mutation evidence
- **THEN** its mutation policy returns BLOCK regardless of score or LLM optimism

#### Scenario: Valid kill

- **WHEN** fresh verified execution has at least one meaningful killed mutant and every mutant is resolved
- **THEN** the mutation policy permits ordinary gate evaluation

### Requirement: Reviewed equivalence

Seal MUST require independent verified operator review to exclude equivalent mutants.

#### Scenario: Unreviewed equivalence

- **WHEN** a survivor is called equivalent without a valid independent review
- **THEN** the mutation policy blocks

#### Scenario: Equivalent only

- **WHEN** every mutant is equivalent even with verified reviews
- **THEN** the Property remains untested and the mutation policy blocks

### Requirement: Compatible local integration

Seal MUST preserve Scenario and planning operation and consume actual local Orca evidence.

#### Scenario: Ordinary gate

- **WHEN** a gate has ordinary Scenarios or only optional Properties
- **THEN** mandatory mutation evidence does not create a new blocker

#### Scenario: Plan review

- **WHEN** a plan describes a future MUST Property
- **THEN** mutation execution is deferred to the implementation gate

#### Scenario: Real receipt bridge

- **WHEN** Orca supplies fresh execution and isolated mutation evidence through the trusted verifier
- **THEN** Seal distinguishes actual kills, survivors, invalid probes and verified equivalence without GitHub
