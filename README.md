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

## Get AG + Terms (Paul LOCK)

1. Public **Get AG** CTAs route to [`/terms`](./src/app/terms/page.tsx) first.
2. `/terms` is a **DRAFT stub / outline** only — banner: **DRAFT — lawyer review required before ship**.
3. **Clickwrap required** before the download CTA enables (Paul LOCK).
4. **Never ship ToS without counsel** — replace stub after lawyer review; not legal advice.
5. After clickwrap accept, download always targets `https://github.com/paulthorson/agentic-governance` — never this site repo.
6. Look pixels HOLD (#39) — no redesign on this path.

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
