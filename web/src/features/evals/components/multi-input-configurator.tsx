/**
 * TIREA: Multi-Input Configurator Component
 * Allows configuration of multiple inputs for comparison evaluations
 */

import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { type EvalFormType } from "../utils/evaluator-form-utils";
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
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/utils/tailwind";
import { GitCompare, Plus, Trash2, Layers } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

interface MultiInputConfiguratorProps {
  form: UseFormReturn<EvalFormType>;
  disabled?: boolean;
}

export function MultiInputConfigurator({ form, disabled }: MultiInputConfiguratorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inputMappings",
  });

  const multiInputMode = form.watch("multiInputMode");

  const addInput = () => {
    append({
      name: `input_${fields.length + 1}`,
      mapping: {
        langfuseObject: "trace",
        selectedColumnId: "output",
      },
    });
  };

  return (
    <Card className="border-tirea-primary-200 dark:border-tirea-primary-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitCompare className="h-5 w-5 text-tirea-primary-500" />
          Multi-Input Comparison
        </CardTitle>
        <CardDescription>
          Configure multiple inputs to compare different outputs or models.
          The judge will evaluate and score each input.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comparison Mode */}
        <FormField
          control={form.control}
          name="multiInputMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Comparison Mode
              </FormLabel>
              <Select
                value={field.value || "comparison"}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="comparison">
                    <div className="flex flex-col">
                      <span>A/B Comparison</span>
                      <span className="text-xs text-muted-foreground">
                        Compare two outputs and pick a winner
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ensemble">
                    <div className="flex flex-col">
                      <span>Ensemble Scoring</span>
                      <span className="text-xs text-muted-foreground">
                        Score each input independently
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How the judge should evaluate the multiple inputs
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input Mappings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-medium">Input Mappings</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInput}
              disabled={disabled || fields.length >= 5}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Input
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center">
              <GitCompare className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No inputs configured. Add at least 2 inputs for comparison.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInput}
                disabled={disabled}
                className="mt-3"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add First Input
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {fields.map((field, index) => (
                <AccordionItem
                  key={field.id}
                  value={field.id}
                  className={cn(
                    "rounded-lg border px-4",
                    index === 0 && "border-blue-300 bg-blue-50 dark:bg-blue-950",
                    index === 1 && "border-green-300 bg-green-50 dark:bg-green-950"
                  )}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white",
                        index === 0 && "bg-blue-500",
                        index === 1 && "bg-green-500",
                        index > 1 && "bg-gray-500"
                      )}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">
                        {form.watch(`inputMappings.${index}.name`) || `Input ${index + 1}`}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name={`inputMappings.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Input Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`input_${index + 1}`}
                              disabled={disabled}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A descriptive name for this input (e.g., &quot;model_a_output&quot;)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`inputMappings.${index}.mapping.langfuseObject`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Object</FormLabel>
                          <Select
                            value={field.value || "trace"}
                            onValueChange={field.onChange}
                            disabled={disabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="trace">Trace</SelectItem>
                              <SelectItem value="generation">Generation</SelectItem>
                              <SelectItem value="span">Span</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`inputMappings.${index}.mapping.selectedColumnId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Field</FormLabel>
                          <Select
                            value={field.value || "output"}
                            onValueChange={field.onChange}
                            disabled={disabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="output">Output</SelectItem>
                              <SelectItem value="input">Input</SelectItem>
                              <SelectItem value="metadata">Metadata</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove Input
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {fields.length === 1 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Add at least one more input for comparison.
            </p>
          )}
        </div>

        {fields.length >= 2 && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              <strong>{fields.length}</strong> inputs configured for{" "}
              <strong>{multiInputMode === "ensemble" ? "ensemble scoring" : "A/B comparison"}</strong>.
              {multiInputMode === "comparison" && " The judge will select a winner between them."}
              {multiInputMode === "ensemble" && " Each input will receive an independent score."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
