import { AgendaItem } from "@/lib/global-interface";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AgendaItemFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    agendaItem?: AgendaItem;
    onSave: (agendaItem: AgendaItem) => void;
}

export default function AgendaItemFormDialog({ isOpen, onClose, agendaItem, onSave }: AgendaItemFormDialogProps) {
    const [form, setForm] = useState<AgendaItem>(agendaItem || {
        id: "",
        agendaId: "",
        createdAt: new Date().toISOString(),
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(form);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>{agendaItem ? "Edit Agenda Item" : "New Agenda Item"}</DialogTitle>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="flex flex-col gap-4 mt-4">
                    <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
                    <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                    <Input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required />
                    <Input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required />
                    <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="default">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
