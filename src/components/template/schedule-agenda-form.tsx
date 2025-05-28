import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AgendaItem } from "@/lib/global-interface";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ScheduleFormProps = {
    form: {
        title: string;
        description: string;
        isPublic: boolean;
        agendaItems: Partial<AgendaItem>[];
        [key: string]: unknown;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setForm: React.Dispatch<React.SetStateAction<{
        title: string;
        description: string;
        isPublic: boolean;
        agendaItems: Partial<AgendaItem>[];
        [key: string]: unknown;
    }>>;
    readOnly?: boolean;
};

export default function ScheduleForm({ form, handleChange, setForm, readOnly }: ScheduleFormProps) {
    return (
        <form className="flex flex-col gap-4">
            <div>
                <Label htmlFor="agenda-title" className="mb-1.5 text-sm text-muted-foreground">What kind of schedule are you planning?</Label>
                <Input
                    id="agenda-title"
                    name="title"
                    type="text"
                    placeholder="Enter schedule title"
                    value={form.title}
                    onChange={handleChange}
                    readOnly={readOnly}
                />
            </div>
            <div>
                <Label htmlFor="agenda-description" className="mb-1.5 text-x text-muted-foreground">Purpose of this schedule</Label>
                <Textarea
                    id="agenda-description"
                    name="description"
                    placeholder="Enter schedule description, how many days, and your interest"
                    value={form.description}
                    onChange={handleChange}
                    readOnly={readOnly}
                />
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    id="agenda-public"
                    name="isPublic"
                    checked={form.isPublic}
                    onCheckedChange={checked => setForm(f => ({ ...f, isPublic: !!checked }))}
                    disabled={readOnly}
                />
                <Label htmlFor="agenda-public" className="text-sm">
                    Public{" "}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span tabIndex={0}>
                                    <Info size={16} className="text-muted-foreground" />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Public can be shared with anyone with the link
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Label>
            </div>
        </form>
    );
}