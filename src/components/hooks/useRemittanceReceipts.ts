// components/hooks/useRemittanceReceipts.ts
"use client";

import remittanceReceiptService from "@/services/Remit/RemittanceReceiptService";
import { getAuthClaims } from "@/utilis/auth/jwt";
import { useEffect, useRef, useState } from "react";

type Option = { id: number | string; name: string };
const DEFAULT_OPTIONS: Option[] = [{ id: "", name: "-- Select --" }];

interface Args {
  fromDate?: string | null;
  toDate?: string | null;
  isReceived?: boolean;
}

export function useRemittanceReceipts({
  fromDate,
  toDate,
  isReceived = true,
}: Args) {
  const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  // Primitive deps only, so unrelated form re-renders never restart the fetch.
  useEffect(() => {
    const requestId = ++requestIdRef.current;

    if (!fromDate || !toDate) {
      setOptions(DEFAULT_OPTIONS);
      return;
    }

    // createdBy and officeIds come from the JWT, not the form.
    const { userId, officeIds } = getAuthClaims();
    const createdBy = Number(userId ?? "");
    const parsedOfficeIds = (officeIds ?? "")
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !Number.isNaN(id));

    if (
      !userId ||
      !officeIds ||
      Number.isNaN(createdBy) ||
      parsedOfficeIds.length === 0
    ) {
      setOptions(DEFAULT_OPTIONS);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const rows = await remittanceReceiptService.getRemittanceReceipts({
          isReceived,
          createdBy,
          fromDateBs: fromDate,
          toDateBs: toDate,
          officeIds: parsedOfficeIds,
        });
        if (requestId !== requestIdRef.current) return; // stale response
        setOptions([...DEFAULT_OPTIONS, ...rows]);
      } catch {
        if (requestId !== requestIdRef.current) return;
        setOptions(DEFAULT_OPTIONS);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [fromDate, toDate, isReceived]);

  return { options, loading };
}
