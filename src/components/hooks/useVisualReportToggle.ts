"use client";

import { useCallback, useRef } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

interface UseVisualReportToggleOptions<TValues extends FieldValues> {
  /** The form's normal submit handler (the one you pass to ViewReportButton today). */
  onSubmit: SubmitHandler<TValues>;
  /** True while a report is on screen. */
  showReport: boolean;
  /** True while a report is loading. */
  isLoading: boolean;
  /** Name of the switch field in the form. Default: "visualReport". */
  fieldName?: string;
}

/**
 * Re-generates the report with the new switch value when the visual/normal switch is flipped.
 *
 *   const { submitAndRemember, handleVisualToggle } = useVisualReportToggle<MyFormValues>({ onSubmit, showReport, isLoading });
 *   <VisualReportSwitch ... onToggle={handleVisualToggle} disabled={isLoading} />
 *   <ViewReportButton ... onSubmit={submitAndRemember} />
 *
 * It re-sends the values of the LAST SUBMITTED request, so filters the user edited but did not submit are not applied.
 */
export function useVisualReportToggle<TValues extends FieldValues>({
  onSubmit,
  showReport,
  isLoading,
  fieldName = "visualReport",
}: UseVisualReportToggleOptions<TValues>) {
  const lastValuesRef = useRef<TValues | null>(null);

  // pass this to ViewReportButton instead of onSubmit: it remembers what was sent
  const submitAndRemember: SubmitHandler<TValues> = useCallback(
    (data, event) => {
      lastValuesRef.current = data;
      return onSubmit(data, event);
    },
    [onSubmit],
  );

  // pass this to VisualReportSwitch as onToggle
  const handleVisualToggle = useCallback(
    (checked: boolean) => {
      if (!showReport || isLoading || !lastValuesRef.current) return;
      const next = {
        ...lastValuesRef.current,
        [fieldName]: checked,
      } as TValues;
      lastValuesRef.current = next;
      void onSubmit(next);
    },
    [showReport, isLoading, onSubmit, fieldName],
  );

  return { submitAndRemember, handleVisualToggle };
}
