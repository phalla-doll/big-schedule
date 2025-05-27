import { AgendaItem, User } from "@/lib/global-interface";
import { Badge } from "@/components/ui/badge";
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
import { useEffect, useState } from "react";
import { MoveRight } from "lucide-react";
import AgendaItemFormDialog from "@/components/template/agenda-item-form-dialog";
import AuthorContactInfoDialog from "@/components/template/author-contact-info-dialog";
import { Button } from "@/components/ui/button";

interface ScheduleDetailSectionProps {
    agendaItems: AgendaItem[];
    isInPreviewMode: boolean;
    author?: User;
}

export default function ScheduleDetailSection({ agendaItems, isInPreviewMode, author }: ScheduleDetailSectionProps) {
    const grouped: Record<string, AgendaItem[]> = {};
    const [onShowEditForm, setOnShowEditForm] = useState<boolean>(false);
    const [onShowAuthorDialog, setOnShowAuthorDialog] = useState<boolean>(false);
    const [activeAgendaItem, setActiveAgendaItem] = useState<AgendaItem>();
    const [currentAgendaItems, setCurrentAgendaItems] = useState<AgendaItem[]>(agendaItems);

    useEffect(() => {
        setCurrentAgendaItems(agendaItems);
    }, [agendaItems]);


    currentAgendaItems.forEach(item => {
        const dateStr = (item.startTime || item.endTime || "").split("T")[0] || "No Date";
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(item);
    });

    const formatDateWithDay = (dateStr: string) => {
        if (dateStr === "No Date") return dateStr;
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    const [now, setNow] = useState<Date>(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const isActiveItem = (item: AgendaItem) => {
        if (!item.startTime || !item.endTime) return false;
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);
        return now >= start && now <= end;
    };

    const isPassedItem = (item: AgendaItem) => {
        if (!item.endTime) return false;
        const end = new Date(item.endTime);
        return now > end;
    };

    const onEditAgendaItem = (item: AgendaItem) => {
        setOnShowEditForm(true);
        setActiveAgendaItem(item);
    };

    const onSaveAgendaItem = (modifiedAgendaItem: AgendaItem) => {
        setCurrentAgendaItems(prevItems =>
            prevItems.map(item =>
                item.id === modifiedAgendaItem.id ? modifiedAgendaItem : item
            )
        );
        setOnShowEditForm(false);
    }

    return (
        <>

            {onShowEditForm && (
                <AgendaItemFormDialog agendaItem={activeAgendaItem} isOpen={onShowEditForm} onClose={() => setOnShowEditForm(false)} onSave={onSaveAgendaItem} />
            )}

            {onShowAuthorDialog && (
                <AuthorContactInfoDialog onClose={() => setOnShowAuthorDialog(false)} author={author || undefined} isOpen={onShowAuthorDialog} />
            )}

            {!isInPreviewMode && (
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="text-md font-medium mb-0.5">Schedule Detail</h4>
                        <p className="text-xs text-muted-foreground">To edit, click on the agenda item.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => setOnShowAuthorDialog(true)}
                    >
                        Add contact info
                    </Button>
                </div>
            )}
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date} className="mb-5">
                    <Badge variant="outline" className="mb-3 mt-5 text-sm">
                        {formatDateWithDay(date)}
                    </Badge>
                    <Timeline>
                        {items.map(item => {
                            const startTime = item.startTime ? item.startTime.split("T")[1]?.slice(0, 5) : "";
                            const endTime = item.endTime ? item.endTime.split("T")[1]?.slice(0, 5) : "";
                            const active = isActiveItem(item);
                            const passed = isPassedItem(item);
                            return (
                                <TimelineItem
                                    key={item.id}
                                    step={Number(item.id)}
                                    className="group-data-[orientation=vertical]/timeline:sm:ms-40"
                                >
                                    <TimelineHeader className={!isInPreviewMode ? "hover:cursor-pointer" : ""} onClick={() => onEditAgendaItem(item)}>
                                        <TimelineSeparator
                                            className={((active || passed) ? "bg-green-500" : "")}
                                        />
                                        <TimelineDate className={"group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-36 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right" + (active ? " text-green-500" : "")}>
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
                                        <TimelineIndicator
                                            className={(active ? "border-green-500" : passed ? "bg-green-500" : "")}
                                        />
                                    </TimelineHeader>
                                    <TimelineContent onClick={() => onEditAgendaItem(item)} className="hover:cursor-pointer">
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
