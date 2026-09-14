# Userflows — Public AG dashboard (`/`)

**Gate:** Critic Check 7 — Mermaid required (entry, success, error/empty, exits).
**Research SoT:** [`dashboard/docs/research/evidence.md`](../research/evidence.md) — LIVE Cos ACCEPT MERGED AG #20 @ `9721af1` on main. Adv PASS tip `b868672` (challenge), secondary.
**Jobs:** [`jtbd.md`](./jtbd.md) J1–J6.
**Chrome (Jakob):** Same primary chrome on desktop and mobile: brand, Overview, Reports, one **Get AG** primary. Mobile collapses Overview/Reports into a menu; **Get AG** stays a reserved-width header control (no clip, no wrap). Documented exception: secondary nav labels hide behind the menu at mobile — primary + brand stay visible.

Hierarchy (evidence `§8`): brand + one job headline → KPI cards → primary chart → Latest Update + Progress rail → CTA. Reports are secondary.

Measured numbers on stills (live `/` audit, not invented): Daily improve **4**, Retros **2**, AG PRs **2**, Cycle time **Baseline**, Tokens **Baseline**, chart points 2026-09-11 → 2026-09-12, traction **5 metrics gated**.

## F1 — Land & scan KPIs (J1, J2)

Entry: visitor opens `/`. Success: they trust the board and know the job. Empty: unpaid tiles use designed empty (F3). Exit: scroll to update (F2), Get AG (F4), or leave.

```mermaid
flowchart TD
  E1[Entry: open public /] --> H1[Brand + one job headline]
  H1 --> K1[KPI card system: label + value + source/method + optional spark]
  K1 --> C1{Metric measured?}
  C1 -->|yes: Gains 4, Retros 2, AG PRs 2| M1[Show measured value + spark from feed]
  C1 -->|no: Cycle time, Tokens| E3[Designed empty: hatch or labeled Baseline + recovery]
  M1 --> CH[Primary chart: measured points only]
  E3 --> CH
  CH --> N1{Null day in series?}
  N1 -->|yes| N2[Intentional gap / hatch — axes stay]
  N1 -->|no| N3[Plot measured point]
  N2 --> T1[Traction strip: hide below threshold]
  N3 --> T1
  T1 --> X1[Exit: scroll to Latest Update F2]
  T1 --> X2[Exit: Get AG F4]
  T1 --> X3[Exit: leave]
```

**Cite:** `§2` limp tiles + sparse chart; `§3` Stripe / Cloudflare / Amplitude cards, Vercel KPI→chart, Neon hatch; `§8` hierarchy; `§9` no invented numbers.

## F2 — Latest update / reports (J4)

Entry: from F1 fold or Reports nav. Success: visitor gets “what shipped” from a card + rail. Empty: no report yet → designed empty card (not a blank hole). Exit: expand one report, go `/reports`, or back to fold.

```mermaid
flowchart TD
  E2[Entry: fold scroll or Reports] --> U1[Latest Update card — summary not full MD]
  U1 --> P1[Progress rail: scope / shipped / retros from measured feeds]
  P1 --> R1{Want full archive?}
  R1 -->|no| X1[Exit: back to KPIs or Get AG]
  R1 -->|yes| R2[Expand one card or open /reports]
  R2 --> R3{Reports exist?}
  R3 -->|yes| R4[Secondary list — not fold hero]
  R3 -->|no| R5[Empty: no reports yet + link to improve docs]
  R4 --> X2[Exit: back /]
  R5 --> X2
```

**Cite:** `§2` MD dump as hero; `§3` Linear Latest-Update + Progress rail; `§6`/`§9` collapse reports on `/`.

## F3 — Baseline / unpaid (J5)

Entry: visitor hits Cycle time or Tokens (live unpaid) or a traction-gated slot. Success: empty reads as product. Error: feed missing — BLANK / unpaid labeled, never a fake number. Exit: recovery next step or ignore and continue F1.

```mermaid
flowchart TD
  E3[Entry: unpaid KPI or gated traction] --> S1{Feed has a measured value?}
  S1 -->|yes| S2[Render card with value + source line]
  S1 -->|no / below threshold| S3[Designed empty]
  S3 --> S4[Keep card chrome + axes]
  S4 --> S5[Hatch or labeled inactive / Baseline]
  S5 --> S6[Recovery: why unpaid + next step — not invent]
  S6 --> X1[Exit: continue scan F1]
  S2 --> X1
  S3 --> S7[Error: source unset → label BLANK — never invent]
  S7 --> X1
```

**Cite:** `§2` Baseline text only; `§3` Mixpanel / Amplitude recovery, Neon hatch, Stripe Radar zero; `§6` no fake fill; traction gate keep.

## F4 — Get AG (J3)

Entry: header **Get AG** or in-page CTA (same destination). Success: visitor reaches GitHub clone. Error: repo/link unavailable → supporting text, no second fake primary. Exit: GitHub, Quick start (secondary), or back.

```mermaid
flowchart TD
  E4[Entry: header Get AG or in-page Get AG] --> A1[One primary: Get AG → GitHub]
  A1 --> A2[Secondary text: Quick start]
  A2 --> A3{Link available?}
  A3 -->|yes| A4[Exit: GitHub clone]
  A3 -->|no| A5[Error: CTA stays, copy says source unavailable — no invented mirror]
  A5 --> X1[Exit: back to board]
  A4 --> X2[Done]
  A2 --> X1
```

**Hick / Fitts lock:** One primary in the thumb/header zone. No GitHub + Quick start as twin primaries. No theme toggle in the CTA cluster. Header CTA has reserved width so it does not clip or wrap (live mobile FAIL). PR “View” links are supporting, not primaries.

**Cite:** live `/` competing CTAs + clipped sticky; `§8` primary toward Get AG / GitHub; Check 8 Fitts/Hick.

## F5 — Measured ship toast (J6)

Entry: a measured ship/merge/retro is recorded in a feed. Success: one quiet toast. Empty/idle: no toast. Exit: toast dismisses; board values update only from the feed.

```mermaid
flowchart TD
  E5[Entry: measured ship / merge / retro lands] --> Q1{Event in measured feed?}
  Q1 -->|no| Q2[Idle: no toast, no pulse, no ticker]
  Q1 -->|yes| Q3[Quiet ship toast — one shot]
  Q3 --> Q4[Optional count-up on that KPI only]
  Q4 --> Q5[Spark takes the new point]
  Q5 --> X1[Exit: toast gone; board calm]
  Q2 --> X2[Exit: stay calm]
```

**Cite:** `§7` Canny / Workable / Apollo / Amplitude toast + StackAI spark; live `/` evidence of absence (no count-up/pulse/toast today); `§6` no fake ticker / invented pulse / simulated live.

## Mobile vs desktop (Jakob)

Same steps, same primary chrome. Mobile: single column; chart title does not wrap into a broken heading (live FAIL); reports stay collapsed; **Get AG** reserved in header (not clipped). Desktop nav labels may collapse — documented exception above.

## Acceptance (Check 7)

| Field | Value |
| --- | --- |
| Mermaid | F1–F5 each have entry, success, empty/error, exits |
| Map to JTBD | F1→J1/J2, F2→J4, F3→J5, F4→J3, F5→J6 |
| Research | Cited to LIVE Cos ACCEPT MERGED AG #20 @ `9721af1` evidence.md on main; Adv PASS tip `b868672` (challenge), secondary — no contradiction, no invented jobs |
| Next | Check 8 `VISUAL_STEP_STILLS` per step mobile+desktop + motion note. Stills → AG PM → Cos before Eng |
