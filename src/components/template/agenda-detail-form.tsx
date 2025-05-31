import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AgendaItem } from "@/lib/global-interface";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-pickter";
import { isValid } from 'date-fns';

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
    const handleDateTimeRangeUpdate = ({ range }: { range: { from: Date | undefined; to: Date | undefined } }) => {
        console.log('range => ', range);
        // Convert Date objects to datetime-local string format
        const formatForInput = (date: Date | undefined) => {
            if (!date || !isValid(date)) return '';
            return date.toISOString().slice(0, 16);
        };

        // Update both startTime and endTime
        const startTimeEvent = {
            target: {
                name: 'startTime',
                value: formatForInput(range.from)
            }
        } as React.ChangeEvent<HTMLInputElement>;

        const endTimeEvent = {
            target: {
                name: 'endTime', 
                value: formatForInput(range.to)
            }
        } as React.ChangeEvent<HTMLInputElement>;

        handleDetailChange(startTimeEvent);
        handleDetailChange(endTimeEvent);
    };

    // Convert string values back to Date objects for the DateTimeRangePicker
    const getDateFromString = (dateString: string | undefined) => {
        if (!dateString) return undefined;
        return new Date(dateString);
    };

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
            <DateTimeRangePicker
                initialDateFrom={getDateFromString(detailItem.startTime)}
                initialDateTo={getDateFromString(detailItem.endTime)}
                onUpdate={handleDateTimeRangeUpdate}
                className="w-full"
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