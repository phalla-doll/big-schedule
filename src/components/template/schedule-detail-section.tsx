import { AgendaItem } from "@/lib/global-interface";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";

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
                    <ul className="list-disc pl-5">
                        {items.map(item => {
                            // Extract only the time part (HH:mm) from startTime/endTime
                            const startTime = item.startTime ? item.startTime.split("T")[1]?.slice(0, 5) : "";
                            const endTime = item.endTime ? item.endTime.split("T")[1]?.slice(0, 5) : "";
                            return (
                                <li key={item.id} className="mb-3">
                                    {(startTime || endTime) && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            {startTime && (
                                                <span>{startTime}</span>
                                            )}
                                            <MoveRight className="inline-block" strokeWidth={1} />
                                            {endTime && (
                                                <span>{endTime}</span>
                                            )}
                                        </p>
                                    )}
                                    <h4 className="font-semibold">{item.title}</h4>
                                    {item.description && (
                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                    )}
                                    <div className="text-xs text-gray-500">
                                        {item.location && (
                                            <span>
                                                Location: {item.location}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </>
    );
}
