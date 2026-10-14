"use client";

import React, { useState } from "react";
import { isEndBeforeStart } from "@/lib/dates";

export const tripFormFieldNames = ["name", "destination", "startDate", "endDate"] as const;

type TripFormValues = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
};

export function TripForm({
  action,
  submitLabel,
  values,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  values?: Partial<TripFormValues>;
  error?: string;
}) {
  const [startDate, setStartDate] = useState(values?.startDate ?? "");
  const [endDate, setEndDate] = useState(values?.endDate ?? "");
  const [clientError, setClientError] = useState<string | null>(null);
  const message = clientError ?? error;

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (startDate && endDate && isEndBeforeStart(startDate, endDate)) {
          event.preventDefault();
          setClientError("The end date cannot be before the start date.");
        }
      }}
    >
      {message ? (
        <p className="alert" role="alert">
          {message}
        </p>
      ) : null}
      <label>
        Name
        <input name="name" defaultValue={values?.name ?? ""} required />
      </label>
      <label>
        Destination
        <input name="destination" defaultValue={values?.destination ?? ""} required />
      </label>
      <label>
        Start date
        <input
          name="startDate"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          required
        />
      </label>
      <label>
        End date
        <input
          name="endDate"
          type="date"
          min={startDate || undefined}
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          required
        />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
