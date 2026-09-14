# Agentic Governance — marketing site

Marketing + living board + admin twin for **Agentic Governance**.

| | |
|---|---|
| Framework / download | [`paulthorson/agentic-governance`](https://github.com/paulthorson/agentic-governance) |
| This repo | Public marketing site (Vercel) — **not** the product download |

## Status

- Extracted living board + admin twin from AG `dashboard/` (tip `e7bb36e`)
- **Look pixels HOLD** (#39 / #26) — current dashboard UI as-is, not Process Instrument redesign
- Feeds pull **read-only** from AG (traction / improve / scars) — site never invents numbers
- Meta Astryx remains the UI SoT

## Get AG + Terms (Cos LOCK Paul — MIT-only)

1. Public **Get AG** CTAs route to [`/terms`](./src/app/terms/page.tsx) first (**FAIL browsewrap**).
2. **Clickwrap = as-is Terms accept only** — **MIT-only / no default telemetry**; **not** an anonymous-improve or telemetry trade.
3. Pointers on stub: **MIT** `LICENSE` on AG + **Delaware** governing-law intent.
4. `/terms` is a **DRAFT stub** citing AG outline SoT [#57](https://github.com/paulthorson/agentic-governance/pull/57) @ `9b5bcd9` until superseding AG docs amend (`bc-e4300373`) lands.
5. Banner: **DRAFT — lawyer review required before ship**. Production ToS NOT until licensed attorney.
6. After clickwrap accept, download → `https://github.com/paulthorson/agentic-governance` only.
7. **Get AG CTA pixels HOLD** beyond clickwrap stub; look HOLD #39 — no redesign.
8. Site PR for this gate stays **draft** until Cos undrafts (counsel unpaid).


## Feeds (read-only consume)

| Feed | AG publisher path | Site behavior |
|---|---|---|
| Traction / KPIs gate | `data/traction.json` (fallback `dashboard/data/traction.json`) | Hatch / hide when unpaid or below `minVisible` |
| Improve reports | `data/improve.json` or `docs/improve/YYYY-MM-DD.md` | Empty state if pull fails — never invent |
| Scars (admin) | `data/scars.json` or `projects/*/scars/` | Admin twin only; titles/status |

Env (optional):

| Variable | Purpose |
|---|---|
| `AG_FEED_OWNER` / `AG_FEED_REPO` / `AG_FEED_REF` | Override AG source (defaults `paulthorson` / `agentic-governance` / `main`) |
| `AG_TRACTION_URL` / `AG_IMPROVE_URL` | Override specific feed URLs |
| `AG_GITHUB_TOKEN` or `GITHUB_TOKEN` | Required for private AG Contents API pulls |
| `AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Admin twin Google SSO |
| `ADMIN_EMAILS` | Optional allowlist extension |

## Local

```bash
cp .env.example .env.local   # fill AUTH_* for admin SSO; AG_GITHUB_TOKEN if AG private
npm install
npm run dev
```

```bash
npm run build
```

- Public: http://localhost:3000
- Terms gate: http://localhost:3000/terms
- Admin: http://localhost:3000/admin/login

## Deploy

Root-level Next.js app (not nested `dashboard/`). Vercel project **agentic-governance-site** is Git-linked to this repo. Attach custom domain after Cos notifies Paul.

## AG-side cleanup still needed

After this site ships, AG still needs a follow-up PR to:

1. Retire marketing host duty from AG `dashboard/` (publisher-only feeds / sync tooling)
2. Stop treating AG Vercel **agentic-governance-three** as the public marketing face (redirect / re-point)
3. Keep `data/traction.json`, improve corpus, and scar SoT as AG publisher-of-record only
