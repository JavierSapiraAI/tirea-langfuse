/**
 * TIREA: Agentic Judge Tools Selector Component
 * Allows selection of tools that the judge can use during evaluation
 */

import { type UseFormReturn } from "react-hook-form";
import { type EvalFormType, AVAILABLE_JUDGE_TOOLS } from "../utils/evaluator-form-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/utils/tailwind";
import { Wrench, Zap, Settings2 } from "lucide-react";

interface AgentToolsSelectorProps {
  form: UseFormReturn<EvalFormType>;
  disabled?: boolean;
}

export function AgentToolsSelector({ form, disabled }: AgentToolsSelectorProps) {
  const selectedTools = form.watch("agentConfig.tools") || [];
  const strategy = form.watch("agentConfig.strategy") || "sequential";

  const handleToolToggle = (toolId: string, checked: boolean) => {
    const currentTools = form.getValues("agentConfig.tools") || [];
    if (checked) {
      form.setValue("agentConfig.tools", [...currentTools, toolId]);
    } else {
      form.setValue("agentConfig.tools", currentTools.filter(t => t !== toolId));
    }
  };

  return (
    <Card className="border-tirea-primary-200 dark:border-tirea-primary-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wrench className="h-5 w-5 text-tirea-primary-500" />
          Agentic Tools
        </CardTitle>
        <CardDescription>
          Select tools the judge can use during evaluation. The judge will
          autonomously decide when to use each tool to gather information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tool Selection */}
        <div className="space-y-3">
          <FormLabel className="text-sm font-medium">Available Tools</FormLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            {AVAILABLE_JUDGE_TOOLS.map((tool) => (
              <div
                key={tool.id}
                className={cn(
                  "flex items-start space-x-3 rounded-lg border p-3 transition-colors",
                  selectedTools.includes(tool.id)
                    ? "border-tirea-primary-500 bg-tirea-primary-50 dark:bg-tirea-primary-950"
                    : "border-border hover:border-tirea-primary-300",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Checkbox
                  id={`tool-${tool.id}`}
                  checked={selectedTools.includes(tool.id)}
                  onCheckedChange={(checked) => handleToolToggle(tool.id, !!checked)}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <label
                    htmlFor={`tool-${tool.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {tool.name}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Strategy */}
        <FormField
          control={form.control}
          name="agentConfig.strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Execution Strategy
              </FormLabel>
              <Select
                value={field.value || "sequential"}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sequential">
                    <div className="flex flex-col">
                      <span>Sequential</span>
                      <span className="text-xs text-muted-foreground">
                        Tools are called one at a time
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="parallel">
                    <div className="flex flex-col">
                      <span>Parallel</span>
                      <span className="text-xs text-muted-foreground">
                        Multiple tools called simultaneously
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How the judge should execute tool calls
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Iterations */}
        <FormField
          control={form.control}
          name="agentConfig.maxIterations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Max Iterations
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="5"
                  disabled={disabled}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                />
              </FormControl>
              <FormDescription>
                Maximum number of tool call iterations (1-20)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedTools.length > 0 && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              <strong>{selectedTools.length}</strong> tool{selectedTools.length !== 1 ? "s" : ""} selected.
              The judge will use {strategy} execution with up to{" "}
              {form.watch("agentConfig.maxIterations") || 5} iterations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
