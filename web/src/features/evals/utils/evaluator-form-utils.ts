import { z } from "zod/v4";
import {
  singleFilter,
  type langfuseObjects,
  TimeScopeSchema,
} from "@langfuse/shared";
import { wipVariableMapping } from "@langfuse/shared";

export const isTraceTarget = (target: string): boolean => target === "trace";
export const isTraceOrDatasetObject = (object: string): boolean =>
  object === "trace" || object === "dataset_item";

// TIREA: Available tools for agentic judges
export const AVAILABLE_JUDGE_TOOLS = [
  { id: "cie10_lookup", name: "CIE-10 Lookup", description: "Validate CIE-10 medical codes against the catalog" },
  { id: "rag_retrieve", name: "RAG Retrieve", description: "Search knowledge base for relevant context" },
  { id: "web_search", name: "Web Search", description: "Search the web for external information" },
  { id: "code_execute", name: "Code Execute", description: "Execute Python code for calculations" },
] as const;

// TIREA: Custom Judge Configuration Schemas
export const agentConfigSchema = z.object({
  tools: z.array(z.string()),
  strategy: z.enum(["sequential", "parallel"]).default("sequential"),
  maxIterations: z.coerce.number().min(1).max(20).default(5),
}).optional();

export const multiInputMappingSchema = z.object({
  name: z.string().min(1),
  mapping: wipVariableMapping,
});

export const webhookConfigSchema = z.object({
  enabled: z.boolean().default(false),
  url: z.string().url().optional().or(z.literal("")),
  events: z.array(z.enum(["completed", "error", "started"])).default(["completed"]),
}).optional();

export const evalConfigFormSchema = z.object({
  scoreName: z.string(),
  target: z.string(),
  filter: z.array(singleFilter).nullable(), // reusing the filter type from the tables
  mapping: z.array(wipVariableMapping),
  sampling: z.coerce.number().gt(0).lte(1),
  delay: z.coerce.number().min(0).optional().default(10),
  timeScope: TimeScopeSchema,
  // TIREA: Custom Judge Fields
  judgeType: z.enum(["standard", "agentic", "multi-input"]).default("standard"),
  agentConfig: agentConfigSchema,
  multiInputMode: z.enum(["comparison", "ensemble"]).optional(),
  inputMappings: z.array(multiInputMappingSchema).optional(),
  webhookConfig: webhookConfigSchema,
});

export type EvalFormType = z.infer<typeof evalConfigFormSchema>;

export type LangfuseObject = (typeof langfuseObjects)[number];

export type VariableMapping = z.infer<typeof wipVariableMapping>;

// TIREA: Export types for custom judge config
export type AgentConfig = z.infer<typeof agentConfigSchema>;
export type MultiInputMapping = z.infer<typeof multiInputMappingSchema>;
export type WebhookConfig = z.infer<typeof webhookConfigSchema>;
