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
};

export default function ScheduleForm({ form, handleChange, setForm }: ScheduleFormProps) {
    return (
        <form className="flex flex-col gap-4">
            <div>
                <Label htmlFor="agenda-title" className="mb-1.5 text-sm text-muted-foreground">Title</Label>
                <Input
                    id="agenda-title"
                    name="title"
                    type="text"
                    placeholder="Enter agenda title"
                    value={form.title}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="agenda-description" className="mb-1.5 text-sm text-muted-foreground">Description</Label>
                <Textarea
                    id="agenda-description"
                    name="description"
                    placeholder="Enter agenda description"
                    value={form.description}
                    onChange={handleChange}
                />
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    id="agenda-public"
                    name="isPublic"
                    checked={form.isPublic}
                    onCheckedChange={checked => setForm(f => ({ ...f, isPublic: !!checked }))}
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