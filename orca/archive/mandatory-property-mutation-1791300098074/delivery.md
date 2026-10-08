# Local Seal delivery

Candidate version: 0.5.1. Standalone `seal --version` reads the installed Node CLI, replacing the former Bun launcher only after preserving its bytes in `/Users/thoor/.local/state/seal/deploy/20261006-property-policy/previous-seal-launcher`. The user source checkout is unchanged.

Package SHA256: 5783b28d4716fafce6dd887661c09ea4835ad1146e2aa94d234f5e1ca6416dd9. 237 packed files were compared byte-for-byte with `/opt/homebrew/lib/node_modules/seal-gate`. Raw pack manifest, unpacked payload, payload receipt and rollback instructions are in `/Users/thoor/.local/state/seal/deploy/20261006-property-policy`.

Tests before archive: TypeScript build; 204 native tests plus 8 Vietnamese checks; 16 mapped Vitest assertions including real runner/probe/signature cases. Orca executable verify passed 8/8. Gate-plan PASS 100; gate-code PASS_WITH_WARNINGS 80 (LLM review absent). Original RED and adverse gate receipts remain in the archive. These gates bind pre-archive diff/version; do not call them fresh for the post-archive package.

Post-archive build passed. The deployed 0.5.1 API passed the actual offline integration script with seven cases (kill, survivor, invalid, unavailable, signed equivalent plus kill, equivalent-only and forged review). Raw report: `/Users/thoor/.local/state/seal/deploy/20261006-property-policy/installed-integration.json`. The post-archive integration harness can select installed package paths and invoke the actual default Orca gate CLI; test fixture dependencies remain caller-owned.

The default bridge is deployed in Orca 1.6.2-beta.7, carrying bundled Seal 0.5.1. All 541 Orca package files matched the installed runtime. A fresh isolated offline package passed eight loop CLI tests and seven real default gate CLI cases; the registered /opt/homebrew/bin/orca passed those seven cases too. Receipts and the complete beta.5 rollback backup are under /Users/thoor/.local/state/orca/deploy/20261006-seal-property/. Draft reviews: https://github.com/rfcclub/seal-gate/pull/1 and https://github.com/GotakoVN/orca/pull/20. S4/S5 delivery is complete. No registry publication, PR approval or merge is performed.
