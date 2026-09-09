"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type BirthParts = { year: string; month: string; day: string };

export function BirthDatePicker({
  initialValue,
  onChange
}: {
  initialValue: string;
  onChange: (value: string) => void;
}) {
  const [parts, setParts] = useState<BirthParts>(() => {
    const [year = "", month = "", day = ""] = initialValue.split("-");
    return { year, month, day };
  });
  const today = new Date();
  const currentYear = today.getFullYear();

  function monthLimit(year: string) {
    return Number(year) === currentYear ? today.getMonth() + 1 : 12;
  }

  function dayLimit(year: string, month: string) {
    if (!year || !month) return 0;
    const days = new Date(Number(year), Number(month), 0).getDate();
    return Number(year) === currentYear &&
      Number(month) === today.getMonth() + 1
      ? today.getDate()
      : days;
  }

  function update(part: keyof BirthParts, value: string) {
    const next = { ...parts, [part]: value };
    if (Number(next.month) > monthLimit(next.year)) next.month = "";
    if (!next.month || Number(next.day) > dayLimit(next.year, next.month)) {
      next.day = "";
    }
    setParts(next);
    onChange(
      next.year && next.month && next.day
        ? `${next.year}-${next.month}-${next.day}`
        : ""
    );
  }

  const fields = [
    {
      key: "year" as const,
      label: "연도",
      suffix: "년",
      autoComplete: "bday-year",
      disabled: false,
      values: Array.from({ length: currentYear - 1899 }, (_, i) =>
        String(currentYear - i)
      )
    },
    {
      key: "month" as const,
      label: "월",
      suffix: "월",
      autoComplete: "bday-month",
      disabled: !parts.year,
      values: Array.from({ length: monthLimit(parts.year) }, (_, i) =>
        String(i + 1).padStart(2, "0")
      )
    },
    {
      key: "day" as const,
      label: "일",
      suffix: "일",
      autoComplete: "bday-day",
      disabled: !parts.year || !parts.month,
      values: Array.from(
        { length: dayLimit(parts.year, parts.month) },
        (_, i) => String(i + 1).padStart(2, "0")
      )
    }
  ];

  return (
    <fieldset className="min-w-0" aria-describedby="birth-help">
      <legend className="text-sm font-bold text-[#12592C]">태어난 날</legend>
      <div className="mt-3 grid grid-cols-[1.4fr_1fr_1fr] gap-2">
        {fields.map((field) => (
          <div key={field.key} className="min-w-0">
            <label
              htmlFor={`birth-${field.key}`}
              className="mb-2 block text-xs font-medium text-[#52685a]"
            >
              {field.label}
            </label>
            <div className="relative">
              <select
                id={`birth-${field.key}`}
                name={`birth-${field.key}`}
                autoComplete={field.autoComplete}
                required
                disabled={field.disabled}
                value={parts[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                className="h-14 w-full min-w-0 appearance-none rounded-lg border border-[#c8dfcf] bg-[#F3F9F5] pr-6 pl-2 text-base font-semibold text-[#12592C] outline-none focus:border-[#1E7F3C] focus:ring-2 focus:ring-[#d5ebdc] disabled:bg-[#f1f3f2] disabled:text-[#8b9990] sm:pl-3"
              >
                <option value="" disabled>
                  {field.label}
                </option>
                {field.values.map((value) => (
                  <option key={value} value={value}>
                    {Number(value)}
                    {field.suffix}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                size={14}
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[#73877a]"
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
