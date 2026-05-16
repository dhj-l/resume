export interface GenerationRecord {
  _id: string;
  jobDescription: string;
  status: string;
  templateType: string;
  parseType: "upload" | "select" | "manual";
  detailInfo?: {
    name?: string;
    age?: number;
    education?: string;
    school?: string;
    major?: string;
    targetRole?: string;
    yearsOfExperience?: string;
    supplementary?: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationRecordResponse {
  total: number;
  list: GenerationRecord[];
}

export interface AiPolishParams {
  resumeId: string;
  key: string;
  index?: number;
  description?: string;
}

export interface AiPolishResult {
  recordId: string;
  beforeContent: string;
  afterContent: string;
}
