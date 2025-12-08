/**
 * TIREA: Webhook Configuration Panel Component
 * Allows configuration of webhook notifications for evaluation events
 */

import { type UseFormReturn } from "react-hook-form";
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
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/utils/tailwind";
import { Webhook, Bell, AlertCircle, CheckCircle, PlayCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

interface WebhookConfigPanelProps {
  form: UseFormReturn<EvalFormType>;
  disabled?: boolean;
}

const WEBHOOK_EVENTS = [
  {
    id: "completed" as const,
    name: "Completed",
    description: "When an evaluation completes successfully",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: "error" as const,
    name: "Error",
    description: "When an evaluation fails",
    icon: AlertCircle,
    color: "text-red-500",
  },
  {
    id: "started" as const,
    name: "Started",
    description: "When an evaluation begins",
    icon: PlayCircle,
    color: "text-blue-500",
  },
] as const;

export function WebhookConfigPanel({ form, disabled }: WebhookConfigPanelProps) {
  const enabled = form.watch("webhookConfig.enabled");
  const selectedEvents = form.watch("webhookConfig.events") || ["completed"];

  const handleEventToggle = (eventId: string, checked: boolean) => {
    const currentEvents = form.getValues("webhookConfig.events") || [];
    if (checked) {
      form.setValue("webhookConfig.events", [...currentEvents, eventId as any]);
    } else {
      form.setValue("webhookConfig.events", currentEvents.filter(e => e !== eventId));
    }
  };

  return (
    <Card className={cn(
      "border-tirea-primary-200 dark:border-tirea-primary-800",
      !enabled && "opacity-75"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Webhook className="h-5 w-5 text-tirea-primary-500" />
              Webhook Notifications
            </CardTitle>
            <CardDescription className="mt-1">
              Receive HTTP notifications when evaluation events occur
            </CardDescription>
          </div>
          <FormField
            control={form.control}
            name="webhookConfig.enabled"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardHeader>

      {enabled && (
        <CardContent className="space-y-6">
          {/* Webhook URL */}
          <FormField
            control={form.control}
            name="webhookConfig.url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Webhook URL
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://your-server.com/webhook/evaluations"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The URL that will receive POST requests for evaluation events
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Event Selection */}
          <div className="space-y-3">
            <FormLabel className="text-sm font-medium">Trigger Events</FormLabel>
            <div className="space-y-2">
              {WEBHOOK_EVENTS.map((event) => {
                const Icon = event.icon;
                const isSelected = selectedEvents.includes(event.id);

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-start space-x-3 rounded-lg border p-3 transition-colors",
                      isSelected
                        ? "border-tirea-primary-500 bg-tirea-primary-50 dark:bg-tirea-primary-950"
                        : "border-border hover:border-tirea-primary-300",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Checkbox
                      id={`event-${event.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleEventToggle(event.id, !!checked)}
                      disabled={disabled}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={`event-${event.id}`}
                        className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                      >
                        <Icon className={cn("h-4 w-4", event.color)} />
                        {event.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payload Preview */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">Payload Preview</FormLabel>
            <div className="rounded-md bg-muted p-3 font-mono text-xs">
              <pre className="overflow-x-auto whitespace-pre-wrap text-muted-foreground">
{`{
  "event": "evaluation.completed",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "traceId": "trace_abc123",
    "evaluatorId": "eval_xyz789",
    "scoreName": "accuracy",
    "score": 0.85,
    "reasoning": "..."
  }
}`}
              </pre>
            </div>
          </div>

          {selectedEvents.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active events:</span>
              {selectedEvents.map((event) => (
                <Badge key={event} variant="secondary" className="capitalize">
                  {event}
                </Badge>
              ))}
            </div>
          )}

          {selectedEvents.length === 0 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Select at least one event to trigger webhook notifications.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
