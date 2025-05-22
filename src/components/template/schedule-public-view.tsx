import { Agenda } from "@/lib/global-interface";
import ScheduleDetailSection from "@/components/template/schedule-detail-section";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function SchedulePublicView({
    agenda,
    onBackToEdit,
}: {
    agenda: Agenda | undefined;
    onBackToEdit: (value: boolean) => void;
}) {
    return (
        <div className="relative w-full sm:w-5xl overflow-hidden">
            {agenda && agenda?.agendaItems?.length ? (
                <>
                    <ScheduleDetailSection agendaItems={agenda.agendaItems} />
                    <div className="my-15 flex justify-center w-full">
                        <Button
                            variant="ghost"
                            className=""
                            onClick={() => onBackToEdit(true)}
                        >
                            <span className="flex items-center gap-2">
                                <MoveLeft className="h-4 w-4" />
                                Back to home
                            </span>
                        </Button>
                    </div>
                </>
            ) : (
                <p>No agenda available.</p>
            )}
        </div>
    );
}