# Obsidian-class KG splash — Master's HCI Research (peak craft)

**Gate:** Cos LOCK Paul **peak design craft** — SUPERSEDES screenshot-collect freeze on prior tip `b95e4a1`. `RESEARCH_BEFORE_ENHANCE` + ADV_COMP.  
**Ownership:** AG Research (Master's HCI seat). **Eng HOLD.** Chatbot = **phase 2 out**. Cos ACCEPT evidence bar + Adv PASS ACCEPT. UX stills HOLD until Cos merge LIVE.  
**Prior SoT (cite only — do not rewrite):** [`living-graph-splash-2026-09-13.md`](./living-graph-splash-2026-09-13.md) (**#28** @ `f9f38ff`); [`motion-finish-2026-09-13.md`](./motion-finish-2026-09-13.md) (**#27** @ `235610e`); [`evidence.md`](./evidence.md) (**#20** @ `9721af1`).  
**Scope:** Evidence that **teaches senior-director composition**. A completeness / Mobbin tile dump is **not** evidence. No `look.md`. No Check 7–8. No Eng / `dashboard/src`. Codes only (`P-01`…). No secrets, tokens, PII, git/product/human names, Studio sauce.

**Bar test:** If UX cannot compose from this pack alone at peak craft, do not freeze / do not tip.

---

## 0. What this pack is for (read first)

UX must leave this document able to answer, in stills language:

1. What is the **figure** vs **ground** of the splash?
2. Which **marks** and **channels** encode ships / retros / PRs / seats / `P-0n`?
3. How does **proximity / similarity / continuity / closure** organize clusters without a hairball?
4. How do **Fitts** (acquire) and **Hick** (choose) shape hover, click→inspect, filters?
5. What is **idle** vs **measured-event** motion (and why Animate is banned)?
6. How does type / space / hierarchy keep Apple-quiet air while remaining Obsidian-dense?

If a still cannot be defended with §1–§4 vocabulary, it fails peak craft.

---

## 1. Design fundamentals (OPENED sources)

Every claim below maps to a URL Research **opened** this pass. Adv must re-open.

### 1.1 Type, space, hierarchy (extraneous load)

| Principle | Opened source | What it teaches for AG splash |
| --- | --- | --- |
| **Extraneous cognitive load** | https://www.nngroup.com/articles/minimize-cognitive-load/ (opened) | Cut visual clutter that does not help the job. Meaningful type/space stays; flourish and redundant chrome go. Splash ink = measured artifact structure + quiet readout — not Grafana chrome. |
| **Aesthetic & minimalist (H8)** | https://www.nngroup.com/articles/ten-usability-heuristics/ (opened) | Every extra unit competes with relevant units. Density of **data** ≠ density of **chrome**. |
| **Visibility of status (H1)** | same heuristics page (opened) | Idle graph must still communicate measured state (honest stillness / hatch unpaid). Event micro-twitch = status change, not decoration. |
| **Recognition over recall (H6)** | same | Hover readout + inspect panel re-show measured facts; user never memorizes node IDs. Codes `P-01`… are recognizable labels, not secrets. |

**Compose rule — type/space:** One primary type scale for artifact labels at rest; fade threshold (Obsidian Display) for secondary labels; generous negative space at viewport edges so clusters read as figure on quiet ground. Do not fill air with fake nodes.

### 1.2 Gestalt (perceptual organization)

| Factor | Opened source | Compose rule for KG |
| --- | --- | --- |
| **Proximity** | Wertheimer 1923 (Ellis trans.) https://psychclassics.yorku.ca/Wertheimer/Forms/forms.htm (opened) | Smallest intervals win grouping. Force layout (repel / link distance) must produce **cluster proximity** that matches measured co-activity — not uniform scatter. |
| **Similarity** | same | Same mark family / hue family = same artifact class (ships vs retros vs seats). Groups color (Obsidian Groups) = categorical similarity channel. |
| **Good continuation / direction** | same | Edges should read as continuous paths the eye can follow (path tracing), not random chord soup. |
| **Closure / good Gestalt** | same | Local Graph / inspect neighborhood should feel a closed sub-whole (focused artifact + hops), not an unbounded hairball. |
| **Common fate** | same | Only **measured** co-motion (event twitch on related nodes) may share fate. Continuous Animate = false common fate — **do-not-copy**. |

### 1.3 Information visualization (marks & channels)

| Concept | Opened source | Compose rule |
| --- | --- | --- |
| **Marks & channels** | Munzner VAD book index https://www.cs.ubc.ca/~tmm/vadbook/ (opened); course marks PDF https://www.cs.ubc.ca/~tmm/courses/547-20/slides/marks.pdf (opened) | **Nodes = point marks**; **links = connection marks**. Size channel for ordered connectivity (Obsidian: more references → bigger). Hue / group = categorical identity. Do not burn magnitude channels on decoration. |
| **Expressiveness / effectiveness** | same marks PDF | Match ordered attributes → magnitude channels (size, luminance); categorical → identity (hue, shape). Wrong match = peak-craft fail. |
| **Networks emphasize topology** | Munzner Ch 9 (Networks) listed on vadbook (opened index) | Splash job = path / neighborhood understanding of governance artifacts — not treemap containment. |
| **Data-ink** | https://infovis-wiki.net/wiki/Data-Ink_Ratio (opened; cites Tufte 1983 *Visual Display…*) | Maximize ink that changes with measured data. Grid chrome, glow, fake pulse = non-data-ink. Caveat from same page: bare axes can hurt read — keep necessary scales/labels; erase chartjunk. |
| **Manipulate / reduce / focus+context** | Munzner Ch 11–14 listed on vadbook | Pan/zoom = manipulate view; Filters/orphans = reduce items; Local Graph depth = focus+context neighborhood. |

### 1.4 Fitts / Hick / Jakob

| Law | Opened source | Compose rule |
| --- | --- | --- |
| **Fitts (1954)** | https://www.nngroup.com/articles/fitts-law/ (opened) — cites Fitts JEPs 1954; MacKenzie & Buxton CHI'92 | Hover/click targets (nodes, inspect hit areas) must be **large enough** and not overcrowded. Related controls (filter cog, inspect close) near probable prior pointer. Padding alone insufficient if users cannot perceive hit area. |
| **Hick–Hyman** | https://www.nngroup.com/videos/hicks-law-long-menus/ (opened summary); https://www.nngroup.com/articles/minimize-cognitive-load/ | Choice time grows with option count. Do not dump every filter/group control at once — progressive disclosure (Obsidian settings cog; Local Graph depth). Defaults smart; unpaid series hatch/omit so choice set stays honest. |
| **Jakob's Law / consistency (H4)** | https://www.nngroup.com/articles/consistency-and-standards/ (opened); heuristics page | Users expect pan/zoom/hover-highlight/click-open from knowledge-graph products (Obsidian-class). Inventing a novel graph grammar raises load — only break convention when measured job demands it. |

**Original citations (for Adv / academic trail — secondary to opened pages above):**

- Fitts, P. M. (1954). *Journal of Experimental Psychology*, 47(6), 381–391. doi:10.1037/h0055392  
- Hick, W. E. (1952). *Quarterly Journal of Experimental Psychology*, 4(1), 11–26.  
- Nielsen, J. (1994). Enhancing the explanatory power of usability heuristics. *CHI '94*.  
- Wertheimer, M. (1923/1938). Laws of organization in perceptual forms.  
- Tufte, E. (1983). *The Visual Display of Quantitative Information*.  
- Munzner, T. (2014). *Visualization Analysis and Design*.

---

## 2. Expert KG craft — Obsidian FIRST

### 2.1 Obsidian Graph view (PRIMARY lock — opened)

| URL | Opened | Craft lesson |
| --- | --- | --- |
| https://obsidian.md/help/plugins/graph | LIVE opened 2026-09-13 (Interactive Graph widget + docs) | Circles=notes, lines=links; size ∝ references; hover highlights connections; click opens; pan/zoom; Filters; Groups; Display; Forces; Local Graph + depth; **Animate = time-lapse** (do-not-copy as idle alive). |
| https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Plugins/Graph%20view.md | Fetched this pass | Text SoT matching live help — Adv may open either. |
| https://obsidian.md/ | LIVE opened | Marketing Graph feature card (~30 nodes, dense links) — supporting density visual; primary lock remains Help behavior + fundamentals above. |

**Obsidian → composition checklist (teach UX):**

1. **Mark encoding:** point nodes + connection edges; size channel = measured connectivity.  
2. **Hover = recognition:** highlight star neighborhood (Gestalt common fate on focus only).  
3. **Click = inspect:** open Local-Graph-like neighborhood (focus+context), not a new app chrome.  
4. **Forces as layout craft:** center / repel / link force / link distance tune proximity clusters — not random hairball.  
5. **Filters/Groups as Hick control:** reduce choice and categorical similarity without deleting measured truth.  
6. **Idle still:** resting force layout is quiet; **Animate time-lapse is not** AG event motion.

### 2.2 Peer comps that teach density / cluster / pan-zoom (after Obsidian)

Use these only to **teach a craft move** — not as tile wallpaper.

| Comp | URL | Craft teach | Conf |
| --- | --- | --- | --- |
| Greptile dense codegraph | https://mobbin.com/screens/8d56eed4-8a7f-4052-ada5-ced89aa4ae48 | Extreme density aspiration. **Competitor-hole:** 3D spectacle. Scrub git handles. | high (pixels opened) |
| Optimal Workshop chord | https://mobbin.com/screens/38d407c7-929b-45ab-b067-39afdf26ad84 | Relationship weight without toy chaos — supporting edge-weight vocabulary. | high (#28) |
| Twingate Access Graph | https://mobbin.com/screens/a3f36399-4127-4a6b-baa5-2ed6a509b2ce ; https://mobbin.com/screens/e936e96e-ccc9-45a6-8e1f-18e78d308cac ; https://mobbin.com/screens/d173c1ef-1aab-4901-9a17-c33a13f467d9 | Inspect/air + zoom. **Competitor-hole:** sparse path ≠ Obsidian clusters. | high |
| Jira deps | https://mobbin.com/screens/c2cbbf59-d38e-4764-b862-68d584be65b8 | Pan/zoom DAG navigation. DAG ≠ undirected KG — adapt navigation only. Scrub keys. | high |
| KeyLines marketing | https://cambridge-intelligence.com/keylines/ (LIVE opened) | Cluster/ring layouts; GPU pan/zoom claims. Demos trial-gated. Enterprise chrome risk. | medium |
| Connected Papers | https://www.connectedpapers.com/main/84bef2d6102933c1c4201a5cdcd0fc90ec9f916b/graph | LIVE/Adv-opened concrete similarity graph: force-directed clusters; node size proportional to citations; color by year; strong edges. Similarity is not measured AG links — density/pan-zoom/inspect analog only. Scrub paper titles/authors from any paste. Homepage https://www.connectedpapers.com/ is supporting only. | high (concrete graph URL locked) |
| Obsidian Mobbin Graph / Filters / Animate / Forces | https://mobbin.com/screens/4ab8d6cf-4216-4e6d-86ab-b4df27febbc8 ; https://mobbin.com/screens/4712f33b-ad9e-4b86-bd91-7f49219d0ced ; https://mobbin.com/screens/ace97309-2e15-4e21-bead-d9c8fd0e8615 ; https://mobbin.com/screens/750d7b56-5e9f-45d3-a43e-9160b4181c3c | Mobile stills of settings craft. **our-hole:** sparse demo vault ≠ desktop density. Animate button = DNC. Scrub vault labels. | high |

---

## 3. Compose the AG splash (senior-director brief)

**Job:** Public `/` = Obsidian-class measured KG of AG artifacts (ships, retros, PRs, seats, codes). Selling point = framework-in-action. **Anonymize ALL surfaces** → `P-01`… only; seats = ROLE codes; no git/product/human names.

### 3.1 Encoding table (Munzner → AG)

| AG attribute | Mark / channel | Notes |
| --- | --- | --- |
| Artifact identity | Point mark + short code label (`P-01`, seat ROLE) | Recognition (H6); scrub names |
| Artifact class | Hue / group (similarity) | Ships / retros / PRs / seats / projects |
| Connectivity / importance | Node size (magnitude) | Measured degree only |
| Relation | Connection mark; thickness optional if measured weight exists | Else uniform thin links |
| Focus | Hover highlight neighborhood | Temporary common fate |
| Inspect | Click → focus+context panel / local depth | Fitts: large hit; near cursor |
| Unpaid / empty | Hatch or omit | Never invent nodes (data-ink honesty) |
| Event | Micro-twitch on changed marks only | Idle still otherwise |

### 3.2 Layout craft

1. Tune forces until **proximity clusters** match measured co-activity (Wertheimer proximity).  
2. Leave quiet ground (air) at edges — figure/ground clear.  
3. Prefer Local-Graph inspect over opening a second dense global.  
4. Filters reduce Hick load before the eye hits a hairball (Obsidian Filters / Munzner Reduce).

### 3.3 Motion craft (#27 stack)

- Idle = still (Fitness paused honesty from #28 stack; #27 @ `235610e` motion SoT).  
- Micro-twitch **only** on measured store write.  
- **Do not copy** Obsidian Display→Animate time-lapse or continuous Living-Graph parameter cycling.

### 3.4 Type / hierarchy craft

- Primary: artifact codes at readable size when zoomed for inspect.  
- Secondary: fade labels at overview (Obsidian text fade) to protect data-ink and air.  
- Inspect panel: SF/Apple-quiet type; measured fields only; no Studio sauce.

---

## 4. our-hole / competitor-hole / do-not-copy

### our-hole

- Prior #37 tip `b95e4a1` risked **screenshot-collect completeness** without Master's compose teach — Cos LOCK supersedes.  
- #28 @ `f9f38ff` thin vs Obsidian density + filters/forces/local depth.  
- Sparse Mobbin vault stills mistaken for density SoT.  
- Surfaces leaking git/product/human names (must be `P-01`… / ROLE only).  
- Temptation to use Animate / continuous motion as “alive.”

### competitor-hole

- Global hairball without Filters / Local Graph / Groups.  
- Twingate-class sparse path diagrams as density lock.  
- Greptile 3D spectacle / KeyLines enterprise chrome as public splash.  
- n8n / IDE graphs as marketing (from #28).  
- Similarity graphs (Connected Papers) mistaken for measured governance links.

### do-not-copy

- Continuous Animate / time-lapse as idle alive  
- Invented nodes / fake pulse / ticker  
- Git / product / human names on any surface  
- Secrets / tokens / paths / Studio  
- Mobbin emails / handles pasted into AG git  
- Chatbot UX this PR  
- Rewriting #28 / #27 — cite only  
- Eng / look.md / Check 7–8 this tip  
- Tile-dump “evidence” without §0–§3 compose rules  

---

## 5. Data contract

Measured store only. Hatch/omit unpaid. Codes only. Idle still; event twitch only when store updates.

---

## 6. UX stills acceptance (Research → UX handoff)

Stills FAIL peak craft unless they show:

1. Clear figure/ground + air  
2. Point+connection encoding with size/hue used expressively  
3. Cluster proximity readable as groups  
4. Hover highlight + click inspect affordance  
5. Idle frame with **no** continuous motion  
6. Labels as `P-01`… / ROLE only  
7. Written defense citing §1 fundamentals + Obsidian §2  

Research does not paint stills. UX owns Check 7–8 after Cos ACCEPT this tip.

---

## 7. Acceptance record

| Field | Value |
| --- | --- |
| Received | Cos LOCK peak craft + Cos ACCEPT evidence bar + Adv PASS ACCEPT tip; Master's HCI; opened sources; Obsidian FIRST; teach UX; holes; P-01; idle still; stack #28+#27; Eng HOLD; chatbot out; Not LIVE until Cos merge |
| Well-formed? | Yes — fundamentals with opened URLs + Obsidian craft + compose brief + holes + stills acceptance; not a tile dump |
| Additive on | #28 @ `f9f38ff`; #27 @ `235610e` |
| Bar | Pack teaches senior-director compose; completeness alone ≠ evidence |
| PII | None; scrub notes on comps |
| Tip | Cos ACCEPT evidence bar + Adv PASS ACCEPT tip; cheap CONCERNs amended; Not LIVE until Cos merge |
