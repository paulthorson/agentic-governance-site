# QA results — Cos GO public `/` dashboard

**Seat:** AG QA  
**When:** 2026-09-13 ~1:46 PM ET (LIVE_SOT cite fix ~1:54 PM ET)  
**Story SoT:** LIVE Cos ACCEPT MERGED AG #21 @ `b2d703e` (Check 7+8 IA on main)  
**Historical Adv PASS tip (not live SoT):** `4ecb309`  
**Research LIVE:** AG #20 @ `9721af1`  
**Adv:** PASS tip `4ecb309` (historical); Critic separate stamp **owed**  
**Live:** https://agentic-governance-three.vercel.app  
**Verdict line:** Report UP AG PM → Cos. **Eng HOLD on look. No Eng GO from QA.** Look craft retip = new PR (not #21).

## Executive verdict

| Layer | Verdict |
| --- | --- |
| Check 7 artifacts (story) | **PASS** |
| Check 8 still pack (story target) | **PASS** (pack complete on LIVE #21 @ `b2d703e`; UX self-check PASS; Critic stamp still owed) |
| Live `/` vs story target | **FAIL** (expected — Eng HOLD on look; Cos: stills cleaner README not enterprise wow) |
| Honesty on live `/` (no invented numbers / no fake ticker) | **PASS** |
| Eng GO | **HOLD** — no Eng GO from QA |

## G1 — Check 7 present + research-cited → PASS

- Present on LIVE #21 @ `b2d703e`: `dashboard/docs/ux/jtbd.md`, `dashboard/docs/ux/userflows.md` (Mermaid F1–F5).
- Research cite (both files): LIVE Cos ACCEPT MERGED AG #20 @ `9721af1` → `dashboard/docs/research/evidence.md`; Adv PASS tip `b868672` secondary.
- Jobs map to flows; cites §2/§3/§6/§7/§8/§9. No `NO_RESEARCH`.

## G2 — Check 8 stills mobile+desktop → PASS

Index: `dashboard/docs/ux/qa/visual-qa.md` (LIVE via #21 @ `b2d703e`)  
Stills (12, all non-empty at verify):

| Step | Desktop | Mobile |
| --- | --- | --- |
| F1-land | f1-land-desktop.png | f1-land-mobile.png |
| F1-chart | f1-chart-desktop.png | f1-chart-mobile.png |
| F2-update | f2-update-desktop.png | f2-update-mobile.png |
| F3-empty | f3-empty-desktop.png | f3-empty-mobile.png |
| F4-cta | f4-cta-desktop.png | f4-cta-mobile.png |
| F5-toast | f5-toast-desktop.png | f5-toast-mobile.png |

## G3 — Check 8 FAIL review on **stills** (story target) → PASS w/ notes

Opened stills (not Eng pixels):

- **Primary CTA:** one header **Get AG**; in-page **Get AG on GitHub** + secondary Quick start text — Hick/Fitts designed PASS on stills.
- **Chrome (Jakob):** brand + Overview/Reports (+ Changelog) + reserved Get AG; mobile keeps Get AG + menu — consistent product chrome vs live.
- **Layout-shift:** stills show reserved-width header CTA; F4 motion note claims no CLS on Get AG.
- **NOTE (not FAIL):** nav on stills includes **Changelog**; userflows prose emphasizes Overview/Reports/Get AG. Secondary nav density only.
- **Adv CONCERN (not QA FAIL):** F5 toast thin — Critic/Adv track; QA confirms toast still present on f5-* stills (“Merged PR recorded on the board”).

## G4 — Motion notes → PASS

`visual-qa.md` table has what/when/why per step; measured-feeds-only; idle = static; no celebrate-on-load.

## G5 — No invented numbers / no fake ticker → PASS (live + stills)

**Measured set only (live text + stills):** Daily improve **4**, Retros **2**, AG PRs **2**, Cycle time **Baseline**, Tokens **Baseline**, traction **5 metrics gated**.  
No count-up/pulse/ticker observed on idle live `/` (evidence of absence; matches story).

## G6 — Meta Astryx product face → split

| Surface | Verdict |
| --- | --- |
| Check 8 stills (LIVE #21 @ `b2d703e`) | **PASS** — product IA, KPI card system, designed empty hatch, Latest Update card + Progress rail, not kit demo |
| Live `/` | **FAIL vs story** — limp KPI tiles; full **Daily improve reports** MD dump as primary content; internal Cos/launch copy (“Private today → public Vercel… when Cos unlocks launch”) |

Live footer cites Meta Astryx as UI SoT — kit citation present, product-face IA not yet.

## G7 — Public `/` not report dump → split

| Surface | Verdict |
| --- | --- |
| Stills | **PASS** — Latest Update card + Progress rail; reports secondary |
| Live `/` | **FAIL** — full Shipped/Gains/KPIs/Open invites MD bodies dominate below the KPI strip |

## Live chrome / UX-law notes (vs story FAIL list)

Observed live desktop (2026-09-13):

- Nav: **KPIs · Get AG · Changelog · Contribute** + button **Get Agentic Governance** → **Hick FAIL** (multiple competing primaries; story wants one Get AG).
- KPI cards: label + value + method line, but **Baseline** unpaid tiles lack designed hatch/recovery chrome from F3 stills.
- Improve trends chart present; null-day treatment weaker than still hatch narrative.
- Traction gate honest (“5 metrics gated”).
- Internal launch language on Get AG section (story J2 FAIL).

`/admin`: redirected to `/admin/login?callbackUrl=%2Fadmin`, then **Application error: a server-side exception has occurred** (Digest: `2269207030`). Auth wall expected; server exception is a live admin FAIL (not public `/` product face).

### Live mobile (post-load capture)
- Header nav collapses; black **Get Agentic Govern…** CTA **clips** at right edge → **Fitts FAIL** (matches story live mobile clip).
- Layout-shift (~3s post-load desktop): no visible jump → CLS PASS candidate on current live shell.
- Screenshots captured in QA session (not committed): live-home-desktop/mobile, live-md-dump, live-admin.

## G8 — Critic separate stamp → OWED

`CRITIC_SEPARATE_STAMP` remains unpaid per Adv CONCERN. QA does **not** stamp Critic. Flag for Cos/AG PM.

## Decision for Cos / AG PM

1. **Cos ACCEPT MERGED AG #21 @ `b2d703e` (IA LIVE):** QA **PASS** for story completeness (stills + cites + motion). Prior QA tip was `4ecb309`. Look craft retip = **new PR** (not #21); Eng HOLD.  
2. **Live `/`:** still **FAIL** vs story target (MD dump, Hick CTAs, limp baseline, Cos/launch copy, mobile Get AG clip) — **Eng HOLD on look**; look craft retip = **new PR**.  
3. **No Eng GO from QA.**  
4. **Critic separate stamp** still owed — route to Critic, not Eng.  
5. **`/admin` OAuth** unpaid expected; after look; not Eng now.

## Evidence pointers

- Story SoT LIVE: https://github.com/paulthorson/agentic-governance/pull/21 @ `b2d703e`  
- Research LIVE: https://github.com/paulthorson/agentic-governance/pull/20 @ `9721af1`  
- Live: https://agentic-governance-three.vercel.app/  
- This QA docs PR: https://github.com/paulthorson/agentic-governance/pull/22  
