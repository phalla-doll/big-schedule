"use client";

import { Play } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Agenda, AgendaItem } from "@/lib/global-interface";
import { Separator } from "@/components/ui/separator";

export default function ScheduleCreate() {
    const [agenda, setAgenda] = useState<Agenda>();
    const [isShowDetailItem, setIsShowDetailItem] = useState(false);
    const [form, setForm] = useState<{
        title: string;
        description: string;
        isPublic: boolean;
        agendaItems: Partial<AgendaItem>[];
    }>({
        title: "",
        description: "",
        isPublic: true,
        agendaItems: [],
    });
    const [detailItem, setDetailItem] = useState<Partial<AgendaItem>>({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
        }));
    };

    // Handle AgendaItem detail input changes
    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDetailItem(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add detail item to agendaItems
    const handleAddDetailItem = () => {
        if (!detailItem.title || !detailItem.startTime) return; // minimal validation
        setAgenda(prev => {
            const newItem: AgendaItem = {
                id: crypto.randomUUID(),
                agendaId: prev?.id ?? "",
                createdAt: new Date().toISOString(),
                title: detailItem.title ?? "",
                description: detailItem.description ?? "",
                startTime: detailItem.startTime ?? "",
                endTime: detailItem.endTime ?? "",
                location: detailItem.location ?? "",
            };
            return {
                ...(prev || {
                    id: "",
                    ownerId: "",
                    createdAt: new Date().toISOString(),
                    title: form.title,
                    description: form.description,
                    isPublic: form.isPublic,
                    agendaItems: [],
                }),
                agendaItems: [
                    ...(prev?.agendaItems || []),
                    newItem,
                ],
            };
        });
        setDetailItem({
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            location: "",
        });
    };

    function handleSaveSchedule(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        // Simulate saving the schedule (could be an API call)
        setAgenda(prev => {
            if (prev) {
                return {
                    ...prev,
                    ...form,
                    agendaItems: prev.agendaItems ?? [],
                };
            } else {
                // Provide default values for required fields
                return {
                    id: "",
                    ownerId: "",
                    createdAt: new Date().toISOString(),
                    ...form,
                    agendaItems: [],
                };
            }
        });
    }

    return (
        <>
            <Card className="relative w-full sm:w-3xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Create New Schedule</CardTitle>
                    <CardDescription>Fill in the details below to create a new agenda or schedule item.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="agenda-title" className="mb-1.5">Title</Label>
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
                            <Label htmlFor="agenda-description" className="mb-1.5">Description</Label>
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
                            <Label htmlFor="agenda-public" className="text-sm">Public</Label>
                        </div>
                    </form>
                    {agenda?.agendaItems?.length && (
                        <>
                            <Separator className="my-5" />
                            <div className="mt-5">
                                <Label className="mb-1.5 text-md">Schedule Detail</Label>
                                <ul className="list-disc pl-5">
                                    {agenda.agendaItems.map(item => (
                                        <li key={item.id} className="mb-2">
                                            <div className="font-semibold">{item.title}</div>
                                            {item.description && (
                                                <div className="text-sm text-muted-foreground">{item.description}</div>
                                            )}
                                            <div className="text-xs text-gray-500">
                                                {item.location && (
                                                    <span>
                                                        Location: {item.location}
                                                    </span>
                                                )}
                                                {(item.startTime || item.endTime) && (
                                                    <span className={item.location ? "ml-2" : ""}>
                                                        {item.startTime && (
                                                            <span>
                                                                Start: {item.startTime}
                                                            </span>
                                                        )}
                                                        {item.endTime && (
                                                            <span className={item.startTime ? "ml-2" : ""}>
                                                                End: {item.endTime}
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                    {isShowDetailItem && (
                        <>
                            <Separator className="my-5" />
                            <div className="flex flex-col gap-3">
                                {/* <Label htmlFor="agenda-detail-title" className="mb-1.5 text-md">Detail</Label> */}
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
                                    variant="default"
                                    size="sm"
                                    className="self-end"
                                    onClick={handleAddDetailItem}
                                    type="button"
                                >
                                    Add more
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:justify-between sm:flex-row gap-4">
                    <div>
                        {agenda && (
                            <Button
                                variant="outline"
                                size="default"
                                className="w-full sm:w-auto"
                                disabled={!agenda.agendaItems?.length}
                                onClick={() => {
                                    // Handle play action
                                    console.log("Play clicked", form);
                                }}
                            >
                                <Play className="size-4" /> Play now
                            </Button>
                        )}
                    </div>
                    <div className="flex w-full sm:w-auto gap-4">
                        {agenda?.agendaItems?.length && (
                            <Button
                                variant="outline"
                                size="default"
                                className="w-1/2 sm:w-auto"
                            >
                                Preview
                            </Button>
                        )}

                        {!agenda?.agendaItems?.length ? (
                            <Button
                                variant="default"
                                size="default"
                                className="w-1/2 sm:w-auto"
                                disabled={!form.title || !form.description}
                                onClick={() => setIsShowDetailItem(true)}
                            >
                                Create schedule detail
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                size="default"
                                className="w-1/2 sm:w-auto"
                                onClick={handleSaveSchedule}
                            >
                                {!agenda?.id ? 'Publish schedule' : 'Save schedule'}
                            </Button>
                        )}
                    </div>
                </CardFooter>
                <BorderBeam
                    duration={6}
                    size={400}
                    className="from-transparent via-red-500 to-transparent"
                />
                <BorderBeam
                    duration={6}
                    delay={3}
                    size={400}
                    className="from-transparent via-blue-500 to-transparent"
                />
            </Card>
        </>
    );
}
