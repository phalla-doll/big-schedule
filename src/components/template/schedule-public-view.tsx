import { Agenda } from "@/lib/global-interface";
import ScheduleDetailSection from "@/components/template/schedule-detail-section";
import { Button } from "@/components/ui/button";

export default function SchedulePublicView({
    agenda,
    onBackToEdit,
    isOwner = false,
}: {
    agenda: Agenda | undefined;
    onBackToEdit: (value: boolean) => void;
    isOwner: boolean;
}) {
    return (
        <div className="relative w-full sm:w-5xl overflow-hidden">
            {agenda && agenda?.agendaItems?.length ? (
                <>
                    <ScheduleDetailSection agendaItems={agenda.agendaItems} isInPreviewMode={true} />
                    {isOwner && (
                        <div className="my-15 flex flex-col sm:flex-row justify-end w-full gap-4">
                            <Button
                                variant="ghost"
                                className="text-sm w-full sm:w-auto"
                                onClick={() => onBackToEdit(true)}
                            >
                                Close preview
                            </Button>
                            <Button
                                variant="default"
                                className="text-sm w-full sm:w-auto"
                            >
                                Publish
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <p>No agenda available.</p>
            )}
        </div>
    );
}