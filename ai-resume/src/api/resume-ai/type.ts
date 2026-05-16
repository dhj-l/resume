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
