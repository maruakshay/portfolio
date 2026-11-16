# Graph Report - portfolio  (2026-11-16)

## Corpus Check
- 31 files · ~44,261 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 324 nodes · 506 edges · 14 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77cee725`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `TownGame` - 38 edges
2. `Combat` - 35 edges
3. `Vehicles` - 20 edges
4. `buildTown()` - 16 edges
5. `Platforming` - 13 edges
6. `canvasTex()` - 12 edges
7. `AI Assistant Portfolio` - 12 edges
8. `buildCharacter()` - 11 edges
9. `rng()` - 10 edges
10. `callHref()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getDeepDive()`  [INFERRED]
  app/work/[slug]/page.tsx → lib/content.ts
- `SiteHeader()` --calls--> `callHref()`  [INFERRED]
  components/site-header.tsx → lib/content.ts
- `SiteFooter()` --calls--> `callHref()`  [INFERRED]
  components/site-footer.tsx → lib/content.ts
- `AI Assistant Portfolio` --references--> `Akshay Maru`  [INFERRED]
  README.md → app/api/chat/private/Akshay Maru Personal.txt
- `RAG Architecture` --semantically_similar_to--> `Hybrid RAG System`  [INFERRED] [semantically similar]
  app/api/chat/private/Akshay Maru Personal.txt → app/api/chat/private/Akshay Maru Resume.txt

## Hyperedges (group relationships)
- **JupiterOne Production AI System** — resume_jupiterone_role, resume_hybrid_rag, resume_token_aware_summarization, resume_hallucination_mitigation [EXTRACTED 0.95]
- **Production LLM Engineering Stack** — personal_rag_architecture, personal_vector_search, personal_agentic_workflows, resume_lora_peft, resume_braintrust [INFERRED 0.85]
- **Portfolio Application Tech Stack** — readme_nextjs, readme_vercel_ai_sdk, readme_openai, readme_langchain, readme_tailwindcss [EXTRACTED 0.95]
- **OpenGraph Social Preview Image Components** — opengraph_image_photo, opengraph_image_portfolio_owner, opengraph_image_indoor_setting [INFERRED 0.95]

## Communities (27 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (7): BlackBox, buildFoe(), Combat, foeMats(), glitchMat(), part(), textSprite()

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (14): onKeyDown(), run(), Hero(), HeroSection(), HeroVisual(), Monogram(), SectionRule(), SiteFooter() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (37): Agentic Workflows, AI Trust and Outcomes Philosophy, Akshar Eye Clinic & Optical House, Akshay Maru, Juno AI, JupiterOne, Dr. Manoj Maru, Multi-Agent Systems (+29 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (4): animateCharacter(), rayCylinder(), buildCar(), Vehicles

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (18): asphaltTexture(), Batch, brickTexture(), buildSky(), buildTown(), canvasTex(), curtainWall(), grassTexture() (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (13): applyStage(), attachGun(), box(), buildCharacter(), limb(), mat(), mesh(), pivot() (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (9): Dialogue(), Town(), useMedia(), byOrg(), exp(), footprint(), h(), ledgerLink() (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (6): blockTexture(), canvas(), clearOfWalls(), coinGeometry(), crateTexture(), Platforming

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (4): frame(), remapUVs(), roundedRectPath(), roundedRectShape()

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (3): handleKeyDown(), handleSubmit(), LoaderFive()

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (3): Indoor Decorative Setting, OpenGraph Social Share Image, Portfolio Owner (Person in Photo)

## Knowledge Gaps
- **18 isolated node(s):** `Next.js Framework`, `Vercel AI SDK`, `OpenAI Integration`, `LangChain`, `Tailwind CSS` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TownGame` connect `Community 3` to `Community 6`, `Community 7`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Why does `Combat` connect `Community 0` to `Community 4`, `Community 6`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `callHref()` connect `Community 1` to `Community 7`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `Next.js Framework`, `Vercel AI SDK`, `OpenAI Integration` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._