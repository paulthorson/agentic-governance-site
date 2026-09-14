# Anonymous Improve Feedback — RESEARCH_HCI consent UX pack

**Gate:** `RESEARCH_HCI` (**#38** @ `214ed5b`) / `RESEARCH_BEFORE_ENHANCE`  
**Epic (provisional name):** Paul LOCK **Anonymous Improve Feedback**  
**Date:** 2026-09-14 (America/New_York)  
**Ownership:** AG Research owns this pack (plain-English “basics,” clear off-switch, layered consent teach). **AG UX** composes screens **after** UX Canvas **LIVE** + Cos craft. **Eng HOLD** until **#39** Paul yes. Research does **not** paint stills, write `look.md`, or touch `src`.  
**Cite locks:** DESIGN_SYSTEM_FIRST **#45** @ `ead012f`; Brand & Design Setup + Research Scope **#46** @ `cdf1c41`; UX Canvas **#48** @ `e9b4827` (named next gate; contents TBD); DESIGN_AGENCY_BAR **#43** @ `7e9e0b6` (restraint — no agency playlist; Pentagram/500/AXM = AG-internal only, NEVER public).  
**Destination (product fact):** improve loop / living board / Cos daily AG digest — **measured only**.  
**Codes only:** pack examples use `P-01`… style; never secrets, tokens, PII, absolute paths, or product secret-sauce.  
**Not legal advice:** GDPR/ICO cites are high-level UX guidance for compose; Legal owns compliance.

**Bar test:** If UX cannot answer the §0 compose questions from this pack alone — without inventing data categories or painting chrome — do not freeze / do not tip Eng.

---

## 0. What this pack is for (compose questions UX must answer)

UX must leave this document able to answer, in stills language (after Canvas LIVE):

1. What are the **four lanes**, and which are **default-on** vs **explicit opt-in** vs **voluntary CTA**?
2. In **plain English**, what does **“anonymous basics”** include — and what does it **never** include?
3. Where is the **clear off-switch** for basics, and how is **withdrawal as easy as grant** (Fitts / Hick / Jakob)?
4. How does **layered consent** separate short notice → expandable detail → settings dashboard — without bundling diagnostics into “basics”?
5. When does **just-in-time** notice appear (bug report / improve idea / richer logs) vs when is a quiet settings surface enough?
6. Which **dark patterns FAIL** this epic (forced consent, hidden off, unequal reject path, bundling, confirmshaming, nagging)?
7. How do lanes feed **measured-only** improve / living board / Cos digest without inventing pulse?

If a still cannot be defended with §1–§6 vocabulary + product facts, it fails RESEARCH_HCI.

---

## 1. Product facts (do not invent beyond these)

| Fact | Bound |
| --- | --- |
| Privacy defaults | **Anonymous basics ON by default**; **richer diagnostic logs OPT-IN**; never secrets / tokens / PII / absolute paths / product secret-sauce. |
| Lane 1 | Anonymous basics — **default-on** |
| Lane 2 | Bug reports — **in-product + site CTA** (voluntary) |
| Lane 3 | Improvement ideas — **in-product + site CTA** (voluntary) |
| Lane 4 | Richer diagnostic logs — **explicit opt-in** |
| Destination | Improve loop / living board / Cos daily AG digest — **measured only** |
| Research OWN | Clear off-switch; plain English what “basics” means (proposal below — Cos may rename) |
| Screens | After UX Canvas **LIVE** + Cos craft; Eng HOLD until **#39** Paul yes |
| Out of scope for Research | Stills, `look.md`, `src`, agency playlist |

---

## 2. Opened sources (every claim maps to a URL opened this pass)

Adv / UX must **re-open** these URLs. Claims without a row here are out of pack.

| ID | URL (opened) | Role for this epic |
| --- | --- | --- |
| S01 | https://www.nngroup.com/articles/cookie-permissions/ | Equal-prominence Accept / Deny-necessary / Manage; no deceptive UI; plain language; options immediately available (not buried under “Learn more”) |
| S02 | https://www.nngroup.com/articles/deceptive-patterns/ | Deceptive-pattern taxonomy: obstruction, visual tricks, nagging, confirmshaming, preselection; cognitive-walkthrough fail questions |
| S03 | https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-methods-can-we-use-to-provide-privacy-information/ | Layered notices; just-in-time; dashboards; withdraw as easy as give |
| S04 | https://privacypatterns.org/patterns/Layered-policy-design | Short notice → longer sections → full policy; highlight unexpected practices in foreground |
| S05 | https://design.cnil.fr/en/design-patterns/layered-information/ | 2–3 layers max; first layer = purposes + controller + how to control; don’t bury rights |
| S06 | https://gdpr.eu/what-is-gdpr/ | Consent = freely given, specific, informed, unambiguous; distinguishable; withdraw anytime; **not legal advice** |
| S07 | https://research.swtch.com/telemetry-opt-in | Transparent telemetry: richer/diagnostic-style collection → **opt-in (default off)**; clear what is / isn’t collected |
| S08 | https://raidcli.dev/docs/telemetry | Opt-in anonymous telemetry; explicit never-collect list (paths, command bodies, env, identifiers); default **No**; preview / off / purge |
| S09 | https://developer.apple.com/app-store/user-privacy-and-data-use/ | Explicit permission for unexpected/tracking-class use; no gating features on consent; no trick/force; purpose string |
| S10 | https://support.apple.com/en-ca/102420 | Full app capability either way; Settings path to revoke anytime |
| S11 | https://www.nngroup.com/articles/fitts-law/ | Off-switch = adequately sized target near related controls; don’t hide at edge of workflow |
| S12 | https://www.nngroup.com/videos/hicks-law-long-menus/ | More simultaneous choices → longer decision time; keep consent choices few and distinguishable |
| S13 | https://www.nngroup.com/videos/jakobs-law-internet-ux/ | Prefer familiar privacy-settings patterns users already know |
| S14 | https://www.nngroup.com/articles/consistency-and-standards/ | Jakob’s Law + Heuristic #4: Settings / Privacy naming and placement consistency |
| S15 | https://linear.app/privacy | Competitor hole: analytics cookies; browser-only opt-out; DNT not honored — do-not-copy for AG off-switch |
| S16 | https://linear.app/docs/security | Usage/analytics always stored; crash debugging tied to account — contrast AG lane split |
| S17 | https://docs.stripe.com/customer-management/configure-portal | Self-serve customer control surface pattern (billing analog); privacy/ToS links in portal — settings-as-home for control, not one-shot banner |

---

## 3. Layered consent compose (teach, not tile dump)

### 3.1 Two consent altitudes (map to product lanes)

| Altitude | Product lane | Default | Consent UX pattern (from opened sources) |
| --- | --- | --- | --- |
| **A — Anonymous basics** | Lane 1 | **ON** | Short, plain-English notice + **always-reachable off-switch** in Settings. Treat like “strictly necessary / minimal measured” layer users can still refuse (S01 deny/necessary-only + S03 dashboard withdrawal). |
| **B — Richer diagnostic logs** | Lane 4 | **OFF** until explicit yes | **Opt-in** (S07, S08, S09). Separate control; never pre-ticked; never bundled into basics (S02 preselection / S06 specific consent). |
| **C — Voluntary reports** | Lanes 2–3 | Off until user acts | Just-in-time micro-copy at submit CTA (S03 JIT): what leaves the device, that codes not PII, destination = improve loop. |

**Compose rule:** One settings **Privacy / Improve feedback** surface owns A+B toggles. CTAs for bugs/ideas are **send actions**, not silent telemetry. Hick (S12): do not present four equal “Accept all” style choices at once — present **two toggles** (basics / richer logs) + **two voluntary CTAs** elsewhere.

### 3.2 Layer architecture (2–3 layers, CNIL/ICO)

From S03–S05:

| Layer | Content | UI job |
| --- | --- | --- |
| **L1 — Short notice** | Who (AG), purpose (improve product from measured anonymized signal), what “basics” means in one sentence, how to turn off, link to L2 | First sight / settings header / first-run quiet strip — **not** a blocking dark-pattern wall |
| **L2 — Expandable detail** | Bullet list of fields in basics; bullet list of fields in richer logs; never-collect list; destination (improve / board / Cos digest — measured only) | Progressive disclosure; scannable bullets (S01) |
| **L3 — Policy / dashboard** | Full privacy text + preference dashboard (on/off, revoke, preview sample payload if Eng later) | Withdrawal as easy as grant (S03, S06) |

**Do not** multiply layers past three clicks to find the off-switch (S05 attention point).

### 3.3 Just-in-time moments

| Moment | JIT copy job (evidence) |
| --- | --- |
| User opens **Report a bug** / **Suggest improve** CTA | S03: brief “what we use this for” at the point of provide; link to L2; no PII ask by default |
| User flips **Richer diagnostic logs** ON | S09 purpose-string spirit: explain *why* diagnostics help this bug; confirm never paths/tokens; Apple: app remains fully usable if they leave OFF (S10) |
| User turns **basics** OFF | Confirm state; stop new basics sends; no nagging re-prompt loop (S02 nagging = FAIL) |

---

## 4. Research propose — plain-English “anonymous basics” vs richer logs

> **Label:** Research propose — Cos may rename. Not Eng schema. Not Legal final.

### 4.1 Anonymous basics (Lane 1 — default ON)

**Plain English (proposed):**  
“Anonymous basics” means a **small, coded usage signal** that helps AG see *whether the product works and which improve lanes get use* — without knowing who you are.

**In (proposed field families — codes only):**

- Event **kind** codes (e.g. `P-01` surface opened, `P-02` CTA shown, `P-03` improve idea submitted count — not body text by default)
- Coarse **outcome** codes (success / fail class), not stack traces
- App / client **version** class; OS family class (`darwin` / `linux` / `windows`-style), not hostname
- Anonymous **install/session token** that is **not** an email, name, or account id (rotate/purge-able — pattern from S08)

**Never in basics (hard FAIL if collected here):**

- Secrets, API tokens, auth cookies
- PII (name, email, phone, address)
- Absolute file paths, repo paths, command bodies, env values
- Product secret-sauce / internal Cos / studio notes
- Free-text bug/idea bodies unless user **explicitly** submits Lane 2/3
- Richer diagnostic payloads (those are Lane 4 only)

**Evidence anchors:** S07/S08 “what we never collect” lists; S01 plain-language bullets; S06 data minimization principle (high-level).

### 4.2 Richer diagnostic logs (Lane 4 — explicit OPT-IN)

**Plain English (proposed):**  
“Richer diagnostic logs” means **extra technical detail you choose to send** when something breaks or you want a deeper bug report — still without secrets/tokens/PII/absolute paths/secret-sauce.

**In (only after explicit opt-in):**

- Redacted error **class** / code tables (not raw dumps with paths)
- Feature-flag / lane codes relevant to the failure
- Optional user-authored note on a bug report (Lane 2) — treated as voluntary content, scrubbed of pasted secrets by Eng policy later

**Still never:** absolute paths, tokens, PII, secret-sauce — even when opted in (product fact).

**Evidence anchors:** S07 revised to opt-in for non-minimal systems; S08 opt-in + never-collect; S09/S10 explicit permission + full capability without grant.

### 4.3 Lanes 2–3 (voluntary CTAs)

Bug reports and improvement ideas are **user-initiated sends**, not background telemetry. JIT explains destination = improve loop / living board / Cos digest (**measured only**). Bodies may be free text the user typed — Eng must still strip secrets; Research forbids asking for PII fields in the default form.

---

## 5. Clear off-switch / control placement (Fitts / Hick / Jakob)

| Principle | Opened source | Compose rule for AG |
| --- | --- | --- |
| **Fitts** | S11 | Off-switch target must be **large enough** and **near** the privacy explanation (same settings cluster). Do not put “turn off basics” three menus away from the notice that mentions basics. Related controls (basics toggle + richer-logs toggle + link to what we collect) sit **close** but not crowded. |
| **Hick** | S12 | Settings page offers **few, labeled toggles** — not a 20-item permission matrix on first view. Progressive disclosure for rare diagnostics. |
| **Jakob / consistency** | S13, S14 | Place under familiar **Settings → Privacy** (or **Settings → Improve feedback**) naming. Users expect privacy controls in Settings, not only in a one-time modal. |
| **Equal refusal path** | S01 | Turning OFF must be **as visible** as leaving ON — no high-contrast “Keep on” vs ghost “Off”; no “Learn more” maze to find Off (S01 Harper’s Bazaar anti-pattern). |
| **Withdrawal ease** | S03, S06 | Dashboard/settings: revoke anytime; honor immediately for new sends. |
| **No feature gate** | S09, S10 | Product remains fully usable with basics OFF and richer logs OFF. Bug/idea CTAs still work (user-authored only). |

**Proposed control inventory (Research — for UX Canvas, not Eng):**

1. Toggle: **Anonymous basics** (default ON) + one-line definition  
2. Toggle: **Richer diagnostic logs** (default OFF) + JIT when enabling  
3. Link: **What we collect** (L2 bullets + never list)  
4. Link: **Privacy policy** (L3)  
5. Optional later: **Preview sample payload** (S08 pattern) — Eng HOLD  

---

## 6. our-hole / competitor-hole / do-not-copy

### 6.1 our-hole (AG Research diagnosis for this epic)

- Risk of shipping improve CTAs **without** a discoverable off-switch for default-on basics (Research OWN gap this pack closes).
- Risk of **undefined “basics”** in UI copy — users cannot consent/refuse what they cannot name (S01 plain language; S04 unexpected practices in foreground).
- Risk of treating Lane 4 diagnostics as “part of analytics” without a separate opt-in (violates product fact + S06 specific consent).
- Screens must wait for UX Canvas **#48** — painting stills now would FAIL ownership.

### 6.2 competitor-hole (opened public patterns)

| Source | What they do | Hole vs AG bar |
| --- | --- | --- |
| **Linear** S15–S16 | Web analytics + cookies; opt-out via **browser cookie settings**; **Do Not Track not honored**; usage/analytics always US-stored; crash debugging can include account info | No first-class in-product equal off-switch for analytics; browser sludge for refusal (S02 obstruction). AG must not copy DNT-ignore or “manage in browser only.” |
| **Stripe Customer Portal** S17 | Strong **self-serve control home** for billing prefs + privacy/ToS links | Portal is billing-centric, not telemetry consent — **adopt** the “settings is the home of control” idea; **do not** pretend Stripe documents an AG-like telemetry split (they don’t in opened docs). |
| **Apple ATT** S09–S10 | System opt-in for tracking-class use; full app if denied; Settings revoke | Tracking ≠ AG basics; **adopt** no-gate + Settings revoke + purpose clarity; **do not** copy IDFA/ad framing into AG copy. |
| **Go transparent telemetry** S07 | Opt-in after community push; educate what is collected | **Adopt** opt-in for non-minimal/diagnostic layer; AG still allows **minimal basics default-on** per product fact — with clear Off. |
| **raid CLI** S08 | Default No; never-collect list; preview; purge | **Adopt** never-collect list + preview spirit for Lane 4; AG Lane 1 default-on is a **product choice** — must pair with equal Off (S01). |

### 6.3 do-not-copy (FAIL if UX/Eng ships)

From S01–S02 + product facts:

1. **Forced consent** — blocking the product until “Accept” with no equal refuse (S01, S02, S09).  
2. **Hidden off** — Off only under “Learn more” / secondary page / unequal contrast (S01).  
3. **Bundling** — richer diagnostics pre-included in “basics” or one Accept-all (S02 preselection; S06 specific).  
4. **Collecting paths / tokens / PII / secret-sauce** in any lane (product fact).  
5. **Confirmshaming** — “No thanks, I don’t want a better product” (S02).  
6. **Nagging** — re-prompt loops after Off (S02).  
7. **Unclear Close/X** that silently means Accept (S01).  
8. **Double-negative toggles** (“Do not sell” ambiguity) (S01).  
9. **Browser-only opt-out** as the sole Off (Linear hole S15).  
10. **Invented measured pulse** on living board / Cos digest from non-events.

**DESIGN_AGENCY_BAR #43:** restraint — no public Pentagram/500/AXM playlist; agency craft stays AG-internal.

---

## 7. Acceptance record

| # | Acceptance criterion | Evidence / owner | Pass? |
| --- | --- | --- | --- |
| A1 | Pack teaches compose questions (§0); not a tile dump | This file §0–§5 | PASS (Research) |
| A2 | Every substantive claim maps to an opened URL (§2) | S01–S17 opened this pass | PASS (Research) |
| A3 | our-hole / competitor-hole / do-not-copy present | §6 | PASS (Research) |
| A4 | Plain-English basics vs richer logs labeled **Research propose** | §4 | PASS (Research) |
| A5 | Clear off-switch placement via Fitts/Hick/Jakob | §5 + S11–S14 | PASS (Research) |
| A6 | Layered consent: default-on basics vs explicit opt-in diagnostics | §3 + product facts | PASS (Research) |
| A7 | Codes only; no PII in examples | Throughout | PASS (Research) |
| A8 | Dark-pattern FAIL list explicit | §6.3 | PASS (Research) |
| A9 | No stills / no `look.md` / no `src`; Eng HOLD until #39 Paul yes | Ownership banner | PASS (Research) |
| A10 | UX Canvas **#48** @ `e9b4827` named as next gate before screens | Banner + §6.1 | PASS (Research) |
| A11 | Agency playlist skipped (AG-internal never public) | #43 cite | PASS (Research) |
| A12 | Cos / Legal rename of “basics” allowed without invalidating pack | §4 label | OPEN (Cos) |
| A13 | Eng schema + scrubbers for never-collect | Out of Research | HOLD (Eng #39) |
| A14 | UX stills after Canvas LIVE + Cos craft | Ownership | HOLD (UX) |

---

## 8. Handoff (what Research is / is not saying)

**Research is saying:**  
Compose consent as **two altitudes** (basics default-on with equal Off; diagnostics opt-in), **layered notices**, **JIT at voluntary CTAs**, **Settings-home off-switch**, and a **hard never-collect** list. Fail dark patterns listed in §6.3.

**Research is not saying:**  
Pixel stills, color, motion, Eng event schema, Legal lawful basis determination, or that Cos must keep the string “anonymous basics.”

**Next gate:** UX Canvas **#48** @ `e9b4827` LIVE → Cos craft → stills. Eng remains HOLD until Paul **#39** yes.
