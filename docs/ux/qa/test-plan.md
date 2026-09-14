# QA test plan — Cos GO public `/` dashboard

**Seat:** AG QA  
**Epic:** Cos GO public `/` (marketing + ops face)  
**Surfaces:** https://agentic-governance-three.vercel.app `/` and `/admin`  
**Story SoT:** LIVE Cos ACCEPT MERGED AG #21 @ `b2d703e` — Check 7 + Check 8 IA pack on main  
**Historical Adv PASS tip (not live SoT):** `4ecb309` (pre-merge #21 tip; do not treat as OPEN or SoT)  
**Research SoT:** LIVE Cos ACCEPT MERGED AG #20 @ `9721af1` (`dashboard/docs/research/evidence.md`)  
**Adv:** PASS tip `4ecb309` (historical); CONCERN F5 toast thin + Critic separate stamp owed  
**Report line:** AG QA → AG PM → Cos. **No Eng GO from QA alone.** Eng HOLD on look. Look craft retip = new PR (not #21).

## Scope

Verify **vs story, not implementation**. Check 8 stills are the product-face **target** (Meta Astryx IA). Live `/` is audited for honesty gates and for named story FAILs that Eng must close after Cos ACCEPT of look retip.

## Gates

| ID | Gate | How |
| --- | --- | --- |
| G1 | Check 7 present + research-cited | `jtbd.md` + `userflows.md` cite LIVE #20 @ `9721af1` / evidence.md (LIVE on main via #21 @ `b2d703e`) |
| G2 | Check 8 stills mobile+desktop | 6 steps × 2 = 12 PNGs under `visual-stills/` + motion notes in `visual-qa.md` |
| G3 | Check 8 FAIL review (story stills) | No High layout-shift / chrome inconsistency / Fitts\|Hick\|Jakob break on **primary** in the still pack |
| G4 | Motion notes | Per-step what/when/why; measured-feeds-only; no fake ticker |
| G5 | No invented numbers / no fake ticker | Live + stills: only measured labels; idle board calm |
| G6 | Meta Astryx product face | Product IA (not kit demo); brand + one job headline |
| G7 | Public `/` not report dump | Fold is board chrome, not full improve MD hero |
| G8 | Critic separate stamp | `CRITIC_SEPARATE_STAMP` owed — QA notes, does not stamp |

## Out of scope

- Eng implementation GO (Cos HOLD Eng on look)  
- Look craft retip (separate PR)  
- `/admin` OAuth unpaid (after look; not Eng now)  
- Other project teams  
- Inventing KPI / traction / token / money numbers  

## Artifacts

- This plan: `dashboard/docs/ux/qa/test-plan.md`  
- Results: `dashboard/docs/ux/qa/results.md`  
