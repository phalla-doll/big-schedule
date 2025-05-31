"use client";

import { cn } from "@/lib/utils";
import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isValid,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  addDays,
} from "date-fns";
import { enUS, type Locale } from "date-fns/locale";
import { CalendarIcon, CheckIcon, ChevronRightIcon } from "lucide-react";
import type React from "react";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateTimeInput } from "@/components/ui/date-time-input";

export interface DateTimeRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "tomorrow", label: "Tomorrow" },
  { name: "next7", label: "Next 7 days" },
  { name: "next14", label: "Next 14 days" },
  { name: "next30", label: "Next 30 days" },
  { name: "thisWeek", label: "This Week (ends Sunday)" },
  { name: "nextWeek", label: "Next Week" },
  { name: "thisMonth", label: "This Month (ends last day)" },
  { name: "nextMonth", label: "Next Month" },
];

export interface DateTimeRangePickerProps {
  onUpdate?: (values: { range: DateTimeRange }) => void;
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  align?: "start" | "center" | "end";
  locale?: Locale;
  className?: string;
}

const formatDateTime = (
  date: Date | undefined,
  locale: Locale = enUS,
): string => {
  if (!date || !isValid(date)) return "Select date";
  return format(date, "PPP p", { locale });
};

const getDateAdjustedForTimezone = (
  dateInput: Date | string | undefined,
): Date | undefined => {
  if (dateInput === undefined || dateInput === null) return undefined;

  let d: Date;
  if (typeof dateInput === "string") {
    d = new Date(dateInput);
  } else { // dateInput is a Date object
    d = new Date(dateInput); // Clones the date
  }

  return isValid(d) ? d : undefined;
};

export const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  initialDateFrom,
  initialDateTo,
  onUpdate,
  align = "center",
  locale = enUS,
  className,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateTimeRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: getDateAdjustedForTimezone(initialDateTo),
  });

  const openedRangeRef = useRef<DateTimeRange | undefined>(undefined);
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined,
  );
  const [calendarMonths, setCalendarMonths] = useState<[Date, Date] | undefined>(undefined);

  useEffect(() => {
    // Initialize calendarMonths on the client side to avoid hydration mismatch
    setCalendarMonths([new Date(), addMonths(new Date(), 1)]);
  }, []);

  const getPresetRange = useCallback((presetName: string): DateTimeRange => {
    const now = new Date();
    const today = startOfDay(now);
    const endToday = endOfDay(now);

    switch (presetName) {
      case "today":
        return { from: today, to: endToday };
      case "tomorrow": {
        const tomorrow = addDays(today, 1);
        return { from: tomorrow, to: endOfDay(tomorrow) };
      }
      case "next7":
        return { from: addDays(today, 1), to: endOfDay(addDays(today, 7)) };
      case "next14":
        return { from: addDays(today, 1), to: endOfDay(addDays(today, 14)) };
      case "next30":
        return { from: addDays(today, 1), to: endOfDay(addDays(today, 30)) };
      case "thisWeek":
        return {
          from: today,
          to: endOfWeek(today, { weekStartsOn: 0 }),
        };
      case "nextWeek": {
        const nextWeekStart = startOfWeek(addDays(today, 7), {
          weekStartsOn: 0,
        });
        const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 0 });
        return {
          from: nextWeekStart,
          to: nextWeekEnd,
        };
      }
      case "thisMonth":
        return {
          from: today,
          to: endOfMonth(today),
        };
      case "nextMonth": {
        const nextMonthStart = startOfMonth(addMonths(today, 1));
        return {
          from: nextMonthStart,
          to: endOfMonth(nextMonthStart),
        };
      }
      default:
        throw new Error(`Unknown date range preset: ${presetName}`);
    }
  }, []);

  const setPreset = (preset: string): void => {
    const newRange = getPresetRange(preset);
    setRange(newRange);
    setSelectedPreset(preset);
    if (newRange.from) {
      setCalendarMonths([newRange.from, addMonths(newRange.from, 1)]);
    }
  };

  const checkPreset = useCallback(() => {
    if (!range.from || !range.to) return;

    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);
      if (
        isEqual(startOfDay(range.from), startOfDay(presetRange.from!)) &&
        isEqual(endOfDay(range.to), endOfDay(presetRange.to!))
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }
    setSelectedPreset(undefined);
  }, [range, getPresetRange]);

  const resetValues = (): void => {
    setRange({
      from: getDateAdjustedForTimezone(initialDateFrom),
      to: getDateAdjustedForTimezone(initialDateTo),
    });
    setSelectedPreset(undefined);
    // Ensure calendarMonths is set on client side
    setCalendarMonths([new Date(), addMonths(new Date(), 1)]);
  };

  useEffect(() => {
    checkPreset();
  }, [checkPreset]);

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }) => (
    <Button
      className={cn("justify-start", isSelected && "bg-muted")}
      variant="ghost"
      onClick={() => setPreset(preset)}
    >
      <CheckIcon
        className={cn("mr-2 h-5 w-5", isSelected ? "opacity-100" : "opacity-0")}
      />
      {label}
    </Button>
  );

  const areRangesEqual = (a?: DateTimeRange, b?: DateTimeRange): boolean => {
    if (!a && !b) return true; // Both are undefined, considered equal
    if (!a || !b) return false; // One is undefined, the other is not, considered not equal

    const fromA = a.from;
    const fromB = b.from;
    const toA = a.to;
    const toB = b.to;

    // Compare 'from' dates
    if (fromA === undefined && fromB === undefined) {
      // Both 'from' are undefined, proceed to compare 'to'
    } else if (fromA === undefined || fromB === undefined) {
      return false; // One 'from' is undefined, the other is not
    } else if (!isEqual(fromA, fromB)) {
      return false; // 'from' dates are different
    }

    // Compare 'to' dates
    if (toA === undefined && toB === undefined) {
      return true; // Both 'to' are undefined, and 'from' were equal or both undefined
    } else if (toA === undefined || toB === undefined) {
      return false; // One 'to' is undefined, the other is not
    } else if (!isEqual(toA, toB)) {
      return false; // 'to' dates are different
    }

    return true; // Both 'from' and 'to' are equal (or both undefined respectively)
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
    }
  }, [isOpen]);

  const handleFromDateTimeChange = (date: Date | undefined) => {
    if (date && !isValid(date)) {
      setRange((prev) => ({ ...prev, from: undefined }));
    } else {
      setRange((prev) => ({ ...prev, from: date }));
    }
    setSelectedPreset(undefined);
  };

  const handleToDateTimeChange = (date: Date | undefined) => {
    if (date && !isValid(date)) {
      setRange((prev) => ({ ...prev, to: undefined }));
    } else {
      setRange((prev) => ({ ...prev, to: date }));
    }
    setSelectedPreset(undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left text-[13px] font-normal text-wrap",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateTime(range.from, locale)}
          {range.to && (
            <>
              <ChevronRightIcon className="mx-2 h-4 w-4" />
              {formatDateTime(range.to, locale)}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align} sideOffset={4}>
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          {/* Calendar Section */}
          <div className="space-y-4">
            <div className="hidden lg:flex space-x-4">
              {/* Two calendars side by side for desktop */}
              <Calendar
                mode="range"
                selected={range}
                onSelect={(newRange) =>
                  newRange && setRange(newRange as DateTimeRange)
                }
                month={calendarMonths?.[0]}
                onMonthChange={(month) =>
                  setCalendarMonths([month, addMonths(month, 1)])
                }
                disabled={!calendarMonths}
                className="border rounded-md"
              />
              <Calendar
                mode="range"
                selected={range}
                onSelect={(newRange) =>
                  newRange && setRange(newRange as DateTimeRange)
                }
                month={calendarMonths?.[1]}
                onMonthChange={(month) =>
                  setCalendarMonths([subMonths(month, 1), month])
                }
                disabled={!calendarMonths}
                className="border rounded-md"
              />
            </div>

            {/* Single calendar for mobile */}
            <div className="lg:hidden">
              <Calendar
                mode="range"
                selected={range}
                onSelect={(newRange) =>
                  newRange && setRange(newRange as DateTimeRange)
                }
                className="border rounded-md"
              />
            </div>

            <div className="flex justify-between items-center">
              <DateTimeInput
                value={range.from}
                onChange={handleFromDateTimeChange}
                label="Start"
              />
              <ChevronRightIcon className="mx-2 h-4 w-4" />
              <DateTimeInput
                value={range.to}
                onChange={handleToDateTimeChange}
                label="End"
              />
            </div>
          </div>

          {/* Presets Section */}
          <div className="lg:border-l lg:pl-4 space-y-2">
            <h3 className="font-medium text-sm">Presets</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
              {PRESETS.map((preset) => (
                <PresetButton
                  key={preset.name}
                  preset={preset.name}
                  label={preset.label}
                  isSelected={selectedPreset === preset.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 py-2 px-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              resetValues();
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (!areRangesEqual(range, openedRangeRef.current)) {
                onUpdate?.({ range });
                console.log('range => ', range);
              } else {
                console.log('range => ', range);
              }
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateTimeRangePicker.displayName = "DateTimeRangePicker";