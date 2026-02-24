import { CloudClient } from "chromadb";

export const chroma = new CloudClient({
  apiKey: 'ck-3TsFjo7sv687o9SNfsxGV2qTFFc713H2Q3sVDTiiLbfq',
  tenant: '3617b3f3-fd9b-4c22-a8f6-8c710a0ecaf1',
  database: 'vector_resume'
});