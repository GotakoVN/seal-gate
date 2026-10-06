# Local Seal delivery

Candidate version: 0.5.1. Standalone `seal --version` reads the installed Node CLI, replacing the former Bun launcher only after preserving its bytes in `/Users/thoor/.local/state/seal/deploy/20261006-property-policy/previous-seal-launcher`. The user source checkout is unchanged.

Package SHA256: 5783b28d4716fafce6dd887661c09ea4835ad1146e2aa94d234f5e1ca6416dd9. 237 packed files were compared byte-for-byte with `/opt/homebrew/lib/node_modules/seal-gate`. Raw pack manifest, unpacked payload, payload receipt and rollback instructions are in `/Users/thoor/.local/state/seal/deploy/20261006-property-policy`.

Tests before archive: TypeScript build; 204 native tests plus 8 Vietnamese checks; 16 mapped Vitest assertions including real runner/probe/signature cases. Orca executable verify passed 8/8. Gate-plan PASS 100; gate-code PASS_WITH_WARNINGS 80 (LLM review absent). Original RED and adverse gate receipts remain in the archive. These gates bind pre-archive diff/version; do not call them fresh for the post-archive package.

Post-archive build passed. The deployed 0.5.1 API passed the actual offline integration script with seven cases (kill, survivor, invalid, unavailable, signed equivalent plus kill, equivalent-only and forged review). Raw report: `/Users/thoor/.local/state/seal/deploy/20261006-property-policy/installed-integration.json`. The only post-archive test change lets this smoke select the installed Seal path explicitly.

The Orca default code-gate bridge still needs its final candidate deployment. S4/S5 delivery checkboxes remain pending that deployment and draft PR creation. No registry publication, PR approval or merge is performed.
