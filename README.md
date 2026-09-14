# Agentic Governance — marketing site

Marketing + living board + admin twin for **Agentic Governance**.

| | |
|---|---|
| Framework / download | [`paulthorson/agentic-governance`](https://github.com/paulthorson/agentic-governance) |
| This repo | Public marketing site (Vercel) — **not** the product download |

## Status

- Public `/` + admin twin: **Process Instrument in the Void** (AG `#39` MERGED LIVE @ `3e8de677`, craft CLEAR @ `4d4e4d7`)
- **#26 HOLD** — no new redesign beyond approved stills
- Feeds pull **read-only** from AG (traction / improve / scars) — site never invents numbers
- Meta Astryx remains the UI system; void craft tokens are site-local (`--ag-*`)

## Get AG + Terms

Live behavior (PR [#4](https://github.com/paulthorson/agentic-governance-site/pull/4) merged — site clickwrap **taken down**):

1. **Get AG** / Quick start CTAs → [`paulthorson/agentic-governance`](https://github.com/paulthorson/agentic-governance) on GitHub directly (no accept step).
2. **`/terms`** → pending notice only (“Terms of use: pending.”) — not a live agreement; no checkbox / disabled Continue.
3. **`docs/terms.md`** — review residue only; not rendered as a live agreement. Site legal pages are authored by humans later.
4. Product license SoT remains **Apache 2.0** on the AG repo ([#60](https://github.com/paulthorson/agentic-governance/pull/60) @ `86e98081`).
5. Look APPROVED #39 MERGED LIVE @ `3e8de677` — Eng ships approved stills; #26 HOLD for new redesigns.

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
- Terms (pending): http://localhost:3000/terms
- Admin: http://localhost:3000/admin/login

## Deploy

Root-level Next.js app (not nested `dashboard/`). Vercel project **agentic-governance-site** is Git-linked to this repo. Attach custom domain after Cos notifies Paul.

## AG-side cleanup still needed

After this site ships, AG still needs a follow-up PR to:

1. Retire marketing host duty from AG `dashboard/` (publisher-only feeds / sync tooling)
2. Stop treating AG Vercel **agentic-governance-three** as the public marketing face (redirect / re-point)
3. Keep `data/traction.json`, improve corpus, and scar SoT as AG publisher-of-record only
