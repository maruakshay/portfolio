# Graph Report - .  (2026-05-04)

## Corpus Check
- Corpus is ~6,526 words - fits in a single context window. You may not need a graph.

## Summary
- 79 nodes · 78 edges · 7 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.87)
- Token cost: 2,800 input · 1,950 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Personal Background & AI Expertise|Personal Background & AI Expertise]]
- [[_COMMUNITY_Portfolio App & Tech Stack|Portfolio App & Tech Stack]]
- [[_COMMUNITY_UI Utility Components|UI Utility Components]]
- [[_COMMUNITY_JupiterOne AI Engineering|JupiterOne AI Engineering]]
- [[_COMMUNITY_Chat Interaction Logic|Chat Interaction Logic]]
- [[_COMMUNITY_Home Page & Hero|Home Page & Hero]]
- [[_COMMUNITY_Social Preview Image|Social Preview Image]]

## God Nodes (most connected - your core abstractions)
1. `AI Assistant Portfolio` - 12 edges
2. `Akshay Maru` - 10 edges
3. `Akshay Maru Resume` - 9 edges
4. `cn()` - 6 edges
5. `JupiterOne Senior Product Engineer (AI)` - 6 edges
6. `Hybrid RAG System` - 5 edges
7. `Juno AI` - 3 edges
8. `JupiterOne` - 3 edges
9. `Remote Leaps Founder & Senior Product Engineer` - 3 edges
10. `Hallucination Mitigation` - 3 edges

## Surprising Connections (you probably didn't know these)
- `AI Assistant Portfolio` --references--> `Akshay Maru`  [INFERRED]
  README.md → app/api/chat/private/Akshay Maru Personal.txt
- `RAG Architecture` --semantically_similar_to--> `Hybrid RAG System`  [INFERRED] [semantically similar]
  app/api/chat/private/Akshay Maru Personal.txt → app/api/chat/private/Akshay Maru Resume.txt
- `Agentic Workflows` --semantically_similar_to--> `LangGraph`  [INFERRED] [semantically similar]
  app/api/chat/private/Akshay Maru Personal.txt → app/api/chat/private/Akshay Maru Resume.txt
- `Multi-Agent Systems` --semantically_similar_to--> `Model Context Protocol (MCP)`  [INFERRED] [semantically similar]
  app/api/chat/private/Akshay Maru Personal.txt → app/api/chat/private/Akshay Maru Resume.txt
- `JupiterOne` --references--> `JupiterOne Senior Product Engineer (AI)`  [INFERRED]
  app/api/chat/private/Akshay Maru Personal.txt → app/api/chat/private/Akshay Maru Resume.txt

## Hyperedges (group relationships)
- **JupiterOne Production AI System** — resume_jupiterone_role, resume_hybrid_rag, resume_token_aware_summarization, resume_hallucination_mitigation [EXTRACTED 0.95]
- **Production LLM Engineering Stack** — personal_rag_architecture, personal_vector_search, personal_agentic_workflows, resume_lora_peft, resume_braintrust [INFERRED 0.85]
- **Portfolio Application Tech Stack** — readme_nextjs, readme_vercel_ai_sdk, readme_openai, readme_langchain, readme_tailwindcss [EXTRACTED 0.95]
- **OpenGraph Social Preview Image Components** — opengraph_image_photo, opengraph_image_portfolio_owner, opengraph_image_indoor_setting [INFERRED 0.95]

## Communities (15 total, 2 thin omitted)

### Community 0 - "Personal Background & AI Expertise"
Cohesion: 0.14
Nodes (17): Agentic Workflows, Akshar Eye Clinic & Optical House, Akshay Maru, Dr. Manoj Maru, Multi-Agent Systems, RAG Architecture, Remote Leaps, Vector Search (+9 more)

### Community 1 - "Portfolio App & Tech Stack"
Cohesion: 0.17
Nodes (12): AI Chat API Endpoint, Chat Component, Framer Motion, Hero Section Component, LangChain, Next.js Framework, OpenAI Integration, AI Assistant Portfolio (+4 more)

### Community 3 - "JupiterOne AI Engineering"
Cohesion: 0.36
Nodes (8): AI Trust and Outcomes Philosophy, Juno AI, JupiterOne, Braintrust Evaluation Framework, Hallucination Mitigation, Hybrid RAG System, JupiterOne Senior Product Engineer (AI), Hierarchical Token-Aware Summarization

### Community 4 - "Chat Interaction Logic"
Cohesion: 0.33
Nodes (3): handleKeyDown(), handleSubmit(), LoaderFive()

### Community 7 - "Social Preview Image"
Cohesion: 1.0
Nodes (3): Indoor Decorative Setting, OpenGraph Social Share Image, Portfolio Owner (Person in Photo)

## Knowledge Gaps
- **18 isolated node(s):** `Next.js Framework`, `Vercel AI SDK`, `OpenAI Integration`, `LangChain`, `Tailwind CSS` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Akshay Maru` connect `Personal Background & AI Expertise` to `Portfolio App & Tech Stack`, `JupiterOne AI Engineering`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `AI Assistant Portfolio` connect `Portfolio App & Tech Stack` to `Personal Background & AI Expertise`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `Akshay Maru Resume` connect `Personal Background & AI Expertise` to `JupiterOne AI Engineering`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `Next.js Framework`, `Vercel AI SDK`, `OpenAI Integration` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Personal Background & AI Expertise` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._