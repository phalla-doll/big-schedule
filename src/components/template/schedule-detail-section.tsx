import { AgendaItem } from "@/lib/global-interface";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";
import {
    Timeline,
    TimelineItem,
    TimelineHeader,
    TimelineSeparator,
    TimelineDate,
    TimelineTitle,
    TimelineIndicator,
    TimelineContent,
} from "@/components/ui/timeline";

interface ScheduleDetailSectionProps {
    agendaItems: AgendaItem[];
}

export default function ScheduleDetailSection({ agendaItems }: ScheduleDetailSectionProps) {
    // Group items by date (YYYY-MM-DD)
    const grouped: Record<string, AgendaItem[]> = {};
    agendaItems.forEach(item => {
        const dateStr = (item.startTime || item.endTime || "").split("T")[0] || "No Date";
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(item);
    });

    // Helper to format date as "Friday, 19 May 2025"
    function formatDateWithDay(dateStr: string) {
        if (dateStr === "No Date") return dateStr;
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <>
            <label className="mb-1.5 text-md">Schedule Detail</label>
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date} className="mb-5">
                    <Badge variant="outline" className="mb-3 mt-5 text-sm">
                        {formatDateWithDay(date)}
                    </Badge>
                    <Timeline>
                        {items.map(item => {
                            const startTime = item.startTime ? item.startTime.split("T")[1]?.slice(0, 5) : "";
                            const endTime = item.endTime ? item.endTime.split("T")[1]?.slice(0, 5) : "";
                            return (
                                <TimelineItem
                                    key={item.id}
                                    step={Number(item.id)}
                                    className="group-data-[orientation=vertical]/timeline:sm:ms-40"
                                >
                                    <TimelineHeader>
                                        <TimelineSeparator/>
                                        <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-36 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                                            {(startTime || endTime) ? (
                                                <>
                                                    <span className="flex items-center gap-1 -mt-1">
                                                        {startTime && <span>{startTime}</span>}
                                                        <span><MoveRight strokeWidth={1} /></span>
                                                        {endTime && <span>{endTime}</span>}
                                                    </span>
                                                </>
                                            ) : null}
                                        </TimelineDate>
                                        <TimelineTitle className="sm:-mt-0.5">{item.title}</TimelineTitle>
                                        <TimelineIndicator />
                                    </TimelineHeader>
                                    <TimelineContent>
                                        {item.description && (
                                            <div className="text-sm text-muted-foreground">{item.description}</div>
                                        )}
                                        {item.location && (
                                            <div className="text-xs text-gray-500">
                                                Location: {item.location}
                                            </div>
                                        )}
                                    </TimelineContent>
                                </TimelineItem>
                            );
                        })}
                    </Timeline>
                </div>
            ))}
        </>
    );
}
