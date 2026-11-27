
export type MemorySearchResult = {
  id: string;
  user_id: string;
  type: "factual" | "episodic" | "semantic" | "procedural";
  content: string;
  confidence: number;
  importance: number;
  status: "active" | "archived" | "superseded" | "deleted";
  source_message_id: string | null;
  last_accessed_at: Date;
  created_at: Date;
  updated_at: Date;
  distance: number; //this metadata gives postgres on similarity search
};


export type MemoryAnalysisResult = {
  shouldStore: boolean, 
  memories: { 
    type: "factual" | "episodic" | "semantic" | "procedural";
    content: string, 
    confidence: number, 
    importance: number, 
    operation: "create" | "update" | "no_action" ;
    existingMemoryId: string | null, 
    status: "active" | "archived" | "superseded" | "deleted";
    reason: string;
  }[] 
}