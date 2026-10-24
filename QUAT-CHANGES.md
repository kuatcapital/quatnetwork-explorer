# Quat Network Testnet explorer — modified Blockscout frontend

This repository is the Corresponding Source of the explorer frontend served at
https://testnet.quatcapital.kz (Quat Network Testnet, chainId 77477).

- Upstream: [blockscout/frontend v2.7.2](https://github.com/blockscout/frontend/tree/v2.7.2),
  commit `446c409eeb54274aab90ff371a705f9699cd84ef`, licensed under **GNU GPL v3.0** (see `LICENSE`).
- The first commit (tag `upstream-v2.7.2`) is the unmodified upstream source.
- Later commits are modifications by Quat Capital (ИП «QUAT CAPITAL», Almaty, Kazakhstan).
  They are distributed under the same GPL-3.0 licence.

## Modifications

| Date | File | Change |
|------|------|--------|
| 2026-10-25 | `ui/snippets/footer/Footer.tsx` | Footer simplified: removed the "Blockscout" links column, the project description and the version lines. Kept the "Made with Blockscout" link and the Blockscout Limited copyright notice. Custom link groups come from `NEXT_PUBLIC_FOOTER_LINKS`. |

## Build

Standard upstream Dockerfile:

```bash
docker build -t quat/blockscout-frontend:v2.7.2 \
  --build-arg GIT_TAG=v2.7.2 --build-arg GIT_COMMIT_SHA=$(git rev-parse --short HEAD) .
```

Runtime configuration (environment variables) for the testnet lives in the operator's deployment and contains no code.

Blockscout is a trademark of Blockscout Limited. This project is not affiliated with or endorsed by Blockscout Limited.
