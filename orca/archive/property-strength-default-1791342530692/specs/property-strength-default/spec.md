### Requirement: Canonical strength
Seal MUST count required Properties using requirement description strength, default SHALL and RFC2119 precedence.

#### Scenario: Missing keyword
- **WHEN** a Property requirement omits RFC2119 keywords and lacks trusted evidence
- **THEN** the gate blocks missing mandatory evidence

#### Scenario: Description boundary
- **WHEN** requirement title and description disagree on strength
- **THEN** the description controls and optional properties remain compatible

#### Scenario: Verified default
- **WHEN** default-SHALL evidence has fresh verified execution and a meaningful kill
- **THEN** ordinary policy evaluation is permitted
