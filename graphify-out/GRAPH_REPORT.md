# Graph Report - portfolio  (2026-11-14)

## Corpus Check
- 24 files · ~16,021 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 143 nodes · 149 edges · 12 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d17995d`
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
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `AI Assistant Portfolio` - 12 edges
2. `Akshay Maru` - 10 edges
3. `Akshay Maru Resume` - 9 edges
4. `callHref()` - 8 edges
5. `SiteHeader()` - 6 edges
6. `cn()` - 6 edges
7. `JupiterOne Senior Product Engineer (AI)` - 6 edges
8. `Hybrid RAG System` - 5 edges
9. `SiteFooter()` - 4 edges
10. `frame()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AI Assistant Portfolio` --references--> `Akshay Maru`  [INFERRED]
  README.md → app/api/chat/private/Akshay Maru Personal.txt
- `generateMetadata()` --calls--> `getDeepDive()`  [INFERRED]
  app/work/[slug]/page.tsx → lib/content.ts
- `SiteHeader()` --calls--> `callHref()`  [INFERRED]
  components/site-header.tsx → lib/content.ts
- `SiteFooter()` --calls--> `callHref()`  [INFERRED]
  components/site-footer.tsx → lib/content.ts
- `RAG Architecture` --semantically_similar_to--> `Hybrid RAG System`  [INFERRED] [semantically similar]
  app/api/chat/private/Akshay Maru Personal.txt → app/api/chat/private/Akshay Maru Resume.txt

## Hyperedges (group relationships)
- **JupiterOne Production AI System** — resume_jupiterone_role, resume_hybrid_rag, resume_token_aware_summarization, resume_hallucination_mitigation [EXTRACTED 0.95]
- **Production LLM Engineering Stack** — personal_rag_architecture, personal_vector_search, personal_agentic_workflows, resume_lora_peft, resume_braintrust [INFERRED 0.85]
- **Portfolio Application Tech Stack** — readme_nextjs, readme_vercel_ai_sdk, readme_openai, readme_langchain, readme_tailwindcss [EXTRACTED 0.95]
- **OpenGraph Social Preview Image Components** — opengraph_image_photo, opengraph_image_portfolio_owner, opengraph_image_indoor_setting [INFERRED 0.95]

## Communities (26 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (25): Agentic Workflows, AI Trust and Outcomes Philosophy, Akshar Eye Clinic & Optical House, Akshay Maru, Juno AI, JupiterOne, Dr. Manoj Maru, Multi-Agent Systems (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (7): Monogram(), SectionRule(), SiteFooter(), SiteHeader(), callHref(), getDeepDive(), generateMetadata()

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (12): AI Chat API Endpoint, Chat Component, Framer Motion, Hero Section Component, LangChain, Next.js Framework, OpenAI Integration, AI Assistant Portfolio (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (4): frame(), remapUVs(), roundedRectPath(), roundedRectShape()

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (3): handleKeyDown(), handleSubmit(), LoaderFive()

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (3): Indoor Decorative Setting, OpenGraph Social Share Image, Portfolio Owner (Person in Photo)

## Knowledge Gaps
- **18 isolated node(s):** `Next.js Framework`, `Vercel AI SDK`, `OpenAI Integration`, `LangChain`, `Tailwind CSS` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Akshay Maru` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `AI Assistant Portfolio` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `SiteHeader()` connect `Community 1` to `Community 12`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `callHref()` (e.g. with `SiteHeader()` and `SiteFooter()`) actually correct?**
  _`callHref()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Next.js Framework`, `Vercel AI SDK`, `OpenAI Integration` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._