# JTBD — Public AG dashboard (`/`)

**Gate:** Critic Check 7 (stacked on `RESEARCH_BEFORE_ENHANCE` + `ADV_COMP_CRITIQUE`)
**Research SoT:** [`dashboard/docs/research/evidence.md`](../research/evidence.md) — LIVE Cos ACCEPT MERGED AG #20 @ `9721af1` on main. Adv PASS tip `b868672` (challenge), secondary.
**Surface:** Public marketing + ops face only. Not `/admin`, not OpenClaw, not Studio.
**UI SoT:** Meta Astryx as product face (not a component demo).
**Numbers:** measured feeds only (improve MD, merged PRs, retros). No invented KPI / token / money / visitor / revenue. No fake ticker.

Cite keys below map to evidence.md sections (`§2` live holes, `§3` comps, `§6` do-not-copy, `§7` motion, `§8` keep/adopt, `§9` Cos locks).

## Jobs

### J1 — Trust the living ops board
When a stranger lands on `/`, they want to see that Agentic Governance is a measured, honest ops system — not a pitch deck and not an internal memo — so they can decide the framework is real.

- **Success:** KPI **card system** (label, primary value, source/method line, optional sparkline) reads as product chrome. Baseline/unpaid tiles stay honest. Traction below threshold stays gated.
- **Fail:** Limp label+number tiles; invented pulse; Baseline treated as a measured count.
- **Evidence:** `§2` limp KPI tiles; `§3` Stripe overview + Cloudflare Workers + Amplitude home (adopt card + spark); `§6`/`§7` no fake ticker / invented pulse / simulated live; `§8` keep traction gate + measured-points-only.

### J2 — Understand what AG is without internal chrome
When a visitor scans the fold, they want a one-job headline and a public explanation — so they know what the product is without Cos / launch / private-repo / harness jargon.

- **Success:** Brand + one job headline → product hierarchy. Public copy only.
- **Fail:** “Cos unlocks launch”, private-repo asides, `RESEARCH_BEFORE_ENHANCE` / `ADV_COMP_CRITIQUE` / OpenClaw dump on `/`.
- **Evidence:** `§2` internal Cos/launch copy; `§6`/`§9` strip internal launch language; `§8` product IA not kit demo.

### J3 — Get AG in one move
When a visitor decides to try the framework, they want one obvious primary — clone / GitHub — without choosing among equal buttons.

- **Success:** One primary **Get AG** (header + in-page destination are the same action). Quick start is a secondary text link, not a second primary.
- **Fail:** Hick — header Get AG + GitHub + Quick start + PR “View” all compete as primaries. Fitts — primary shrinks/splits on wrap; sticky CTA clipped on mobile.
- **Evidence:** Live `/` FAIL (competing CTAs, mobile clip); `§8` keep primary toward Get AG / GitHub once public copy is clean; Check 8 Fitts/Hick FAIL bullets.

### J4 — Scan improve health without reading the archive
When a visitor wants “what shipped?”, they want a Latest Update **card** and a Progress rail — not a full daily improve MD dump as the hero.

- **Success:** Latest Update card + Progress rail on `/`. Full reports collapse, or live on `/reports` as secondary.
- **Fail:** Fold hero is Shipped / Gains / Open invites MD.
- **Evidence:** `§2` MD dump as hero; `§3` Linear Latest-Update-as-card + Progress rail (adopt); Better Stack chart-as-hero; `§6`/`§9` do not dump full MD as fold hero.

### J5 — Read unpaid / baseline as designed product
When a metric is unpaid or has no start (Cycle time, Tokens on live `/`), they want a designed empty — not limp “Baseline” text that looks broken.

- **Success:** Illustration or hatch + labeled inactive + recovery next step. Chart axes stay up; null days are intentional gaps.
- **Fail:** Scaffolding disappears; chart gaps look accidental; invented series to fill.
- **Evidence:** `§2` Baseline text only; `§3` Mixpanel / Amplitude empty + Neon hatch + Stripe Radar designed zero; `§6` no fake filled charts; `§8`/`§9` designed empty required; traction stays gated.

### J6 — Notice a real ship, not atmosphere
When a measured ship/merge/retro lands, they want a quiet confirmation. When nothing landed, the board stays calm.

- **Success:** Count-up / spark / pulse / ship toast fire only on measured feeds. Idle = static (today’s live `/` has no count-up/pulse/toast — evidence of absence, not a ticket to fake it).
- **Fail:** Fake ticker, invented pulse, simulated live, celebrate-on-load.
- **Evidence:** `§7` Canny / Wix / Workable / Apollo / Amplitude toast + StackAI spark; pattern↔feed lock; `§6` do-not-copy fake ticker / invented pulse / simulated live.

## Non-jobs (explicit)

- Admin SSO, token ledgers, raw traction below threshold — `/admin` only.
- OpenClaw morning briefs, Discord, Studio PII.
- Editable widget soup (Stripe add/remove) on public `/`.
- Component-gallery Astryx demos without product IA.

## Job → flow map

| Job | Flow (see `userflows.md`) |
| --- | --- |
| J1 Trust ops board | F1 Land & scan KPIs |
| J2 Public what-it-is | F1 Land & scan KPIs |
| J3 Get AG | F4 Get AG |
| J4 Improve health | F2 Latest update / reports |
| J5 Designed empty | F3 Baseline / unpaid |
| J6 Measured motion | F5 Ship toast |

## Acceptance (Check 7)

| Field | Value |
| --- | --- |
| Received | AG PM GO after Cos ACCEPT MERGED AG #20 @ `9721af1` (LIVE Research SoT); Adv PASS tip `b868672` (challenge), secondary; Cos GO public `/` FAIL on look |
| Well-formed? | Yes — jobs cited to evidence.md; no invented metrics; no `NO_RESEARCH` |
| Proceed? | Yes — `userflows.md` next; Check 8 stills after flows. No Eng handoff until Check 8 stills → Cos |
