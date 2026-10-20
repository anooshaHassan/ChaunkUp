import { z } from "zod";

export const redFlagSchema = z.object({
  phrase: z.string(),
  reason: z.string(),
});

export const analysisSchema = z.object({
  verdict: z.enum(["scam", "suspicious", "safe"]),
  confidence: z.number().int().min(0).max(100),
  scam_type: z.string(),
  red_flags: z.array(redFlagSchema),
  explanation_en: z.string(),
  explanation_ur: z.string(),
  explanation_roman: z.string(),
  recommended_actions: z.array(z.string()),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
