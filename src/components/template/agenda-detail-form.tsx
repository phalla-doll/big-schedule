import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AgendaItem } from "@/lib/global-interface";

interface AgendaDetailFormProps {
    detailItem: Partial<AgendaItem>;
    handleDetailChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleAddDetailItem: () => void;
}

export default function AgendaDetailForm({
    detailItem,
    handleDetailChange,
    handleAddDetailItem,
}: AgendaDetailFormProps) {
    return (
        <div className="flex flex-col gap-3">
            <Input
                id="agenda-detail-title"
                name="title"
                type="text"
                placeholder="Detail title"
                value={detailItem.title}
                onChange={handleDetailChange}
            />
            <Textarea
                id="agenda-detail-description"
                name="description"
                placeholder="Detail description"
                value={detailItem.description}
                onChange={handleDetailChange}
            />
            <Input
                id="agenda-detail-start"
                name="startTime"
                type="datetime-local"
                placeholder="Start time"
                value={detailItem.startTime}
                onChange={handleDetailChange}
            />
            <Input
                id="agenda-detail-end"
                name="endTime"
                type="datetime-local"
                placeholder="End time"
                value={detailItem.endTime}
                onChange={handleDetailChange}
            />
            <Input
                id="agenda-detail-location"
                name="location"
                type="text"
                placeholder="Location"
                value={detailItem.location}
                onChange={handleDetailChange}
            />
            <Button
                variant="secondary"
                size="sm"
                className="self-end"
                onClick={handleAddDetailItem}
                type="button"
            >
                {detailItem.id ? 'Update schedule' : 'Add to schedule'}
            </Button>
        </div>
    );
}