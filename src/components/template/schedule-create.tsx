"use client";

import { Play, Sparkles } from "lucide-react";
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
import ScheduleDetailSection from "@/components/template/schedule-detail-section";

export default function ScheduleCreate() {
    const [agenda, setAgenda] = useState<Agenda>();
    const [isShowDetailItem, setIsShowDetailItem] = useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
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

    const handleGenerateWithAI = (): void => {
        const generatedAgendaId = crypto.randomUUID(); // This can be used if you decide to link items before saving
        const now = new Date().toISOString();
        const currentDate = new Date();
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const tripStartDate = nextMonth;
        setIsGeneratingContent(true);

        const generatedAgendaItems: Omit<AgendaItem, 'id' | 'agendaId' | 'createdAt'>[] = [
            {
                title: "Day 1: Tokyo Arrival",
                description: "Arrive at Narita/Haneda Airport and transfer to your hotel in Shinjuku.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate())).toISOString().substring(0, 16), // 09:00
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 11, 0).toISOString().substring(0, 16),
                location: "Shinjuku, Tokyo",
            },
            {
                title: "Day 1: Lunch at Local Izakaya",
                description: "Enjoy a traditional Japanese lunch at a cozy izakaya in Shinjuku.",
                startTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 12, 0).toISOString().substring(0, 16),
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 13, 0).toISOString().substring(0, 16),
                location: "Shinjuku, Tokyo",
            },
            {
                title: "Day 1: Shinjuku Gyoen National Garden",
                description: "Stroll through the beautiful Shinjuku Gyoen National Garden and relax after your flight.",
                startTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 13, 30).toISOString().substring(0, 16),
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 15, 0).toISOString().substring(0, 16),
                location: "Shinjuku Gyoen, Tokyo",
            },
            {
                title: "Day 1: Explore Omoide Yokocho",
                description: "Wander through Omoide Yokocho ('Piss Alley'), famous for its tiny bars and yakitori.",
                startTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 17, 0).toISOString().substring(0, 16),
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 18, 30).toISOString().substring(0, 16),
                location: "Omoide Yokocho, Shinjuku",
            },
            {
                title: "Day 1: Tokyo Metropolitan Government Building",
                description: "Visit the observation deck for panoramic city views.",
                startTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 19, 0).toISOString().substring(0, 16),
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 20, 0).toISOString().substring(0, 16),
                location: "Tokyo Metropolitan Government Building",
            },
            {
                title: "Day 1: Evening Walk in Kabukicho",
                description: "Take an evening stroll through the vibrant Kabukicho district, famous for its neon lights and entertainment.",
                startTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 20, 0).toISOString().substring(0, 16),
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 21, 0).toISOString().substring(0, 16),
                location: "Kabukicho, Shinjuku, Tokyo",
            },
            {
                title: "Day 2: Culture & Pop in Shibuya & Harajuku",
                description: "Morning: Visit Meiji Jingu Shrine. Afternoon: Explore Takeshita Street in Harajuku, try unique street food. Late Afternoon: Walk the iconic Shibuya Scramble Crossing and visit the Hachiko statue. Evening: Dinner and shopping in Shibuya.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate() + 1)).toISOString().substring(0, 10) + "T09:00",
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 20, 0).toISOString().substring(0, 16),
                location: "Shibuya & Harajuku, Tokyo",
            },
            {
                title: "Day 3: Tradition in Asakusa & Sumida River",
                description: "Morning: Explore Senso-ji Temple and Nakamise-dori Street in Asakusa. Afternoon: Take a Sumida River cruise. Late Afternoon: Visit the Tokyo Skytree for stunning views. Evening: Dinner in Asakusa.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate() + 1)).toISOString().substring(0, 10) + "T09:30",
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 21, 0).toISOString().substring(0, 16),
                location: "Asakusa, Tokyo",
            },
            {
                title: "Day 4: Day Trip to Hakone",
                description: "Full day trip to Hakone. Enjoy a scenic boat cruise on Lake Ashi, take the Hakone Ropeway (see volcanic hot springs), visit the Hakone Open-Air Museum. Hope for views of Mount Fuji (weather permitting). Evening: Return to Tokyo.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate() + 1)).toISOString().substring(0, 10) + "T08:00",
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 19, 0).toISOString().substring(0, 16),
                location: "Hakone",
            },
            {
                title: "Day 5: Ueno Park, Museums & Departure",
                description: "Morning: Visit Ueno Park, explore one of its museums (e.g., Tokyo National Museum). Afternoon: Last-minute souvenir shopping at Ameya-Yokocho Market. Transfer to Narita/Haneda Airport for departure.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate() + 1)).toISOString().substring(0, 10) + "T09:00",
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 17, 0).toISOString().substring(0, 16),
                location: "Ueno, Tokyo",
            },
            {
                title: "Day 3: Tradition in Asakusa & Sumida River",
                description: "Morning: Explore Senso-ji Temple and Nakamise-dori Street in Asakusa. Afternoon: Take a Sumida River cruise. Late Afternoon: Visit the Tokyo Skytree for stunning views. Evening: Dinner in Asakusa.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate() + 1)).toISOString().substring(0, 10) + "T09:30", // Day 3
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 21, 0).toISOString().substring(0, 16),
                location: "Asakusa, Tokyo",
            },
            {
                title: "Day 4: Day Trip to Hakone",
                description: "Full day trip to Hakone. Enjoy a scenic boat cruise on Lake Ashi, take the Hakone Ropeway (see volcanic hot springs), visit the Hakone Open-Air Museum. Hope for views of Mount Fuji (weather permitting). Evening: Return to Tokyo.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate() + 1)).toISOString().substring(0, 10) + "T08:00", // Day 4
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 19, 0).toISOString().substring(0, 16),
                location: "Hakone",
            },
            {
                title: "Day 5: Ueno Park, Museums & Departure",
                description: "Morning: Visit Ueno Park, explore one of its museums (e.g., Tokyo National Museum). Afternoon: Last-minute souvenir shopping at Ameya-Yokocho Market. Transfer to Narita/Haneda Airport for departure.",
                startTime: new Date(tripStartDate.setDate(tripStartDate.getDate() + 1)).toISOString().substring(0, 10) + "T09:00", // Day 5
                endTime: new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate(), 17, 0).toISOString().substring(0, 16),
                location: "Ueno, Tokyo",
            },
        ];

        const newAgenda: Omit<Agenda, 'id' | 'ownerId' | 'createdAt'> & { agendaItems: AgendaItem[] } = {
            title: "5 Days Epic Japan Adventure (AI Generated)",
            description: "An AI-crafted itinerary for an unforgettable 5-day journey through the highlights of Japan, focusing on Tokyo and a day trip to Hakone.",
            isPublic: true,
            agendaItems: generatedAgendaItems.map(item => ({
                ...item,
                id: crypto.randomUUID(),
                agendaId: generatedAgendaId,
                createdAt: now,
            })),
        };

        setTimeout(() => {
            setForm(prev => ({
                ...prev,
                title: newAgenda.title,
                description: newAgenda.description ?? "",
                isPublic: newAgenda.isPublic,
            }));
            setAgenda({
                id: "", // No ID for a new, unsaved agenda
                ownerId: "", // No ownerId yet
                createdAt: "", // No createdAt yet
                title: newAgenda.title,
                description: newAgenda.description,
                isPublic: newAgenda.isPublic,
                agendaItems: newAgenda.agendaItems.map(item => ({
                    ...item,
                    id: crypto.randomUUID(),
                    agendaId: "", // Will be set on save
                    createdAt: new Date().toISOString(),
                })),
            });
            setIsShowDetailItem(false);
        }, 2500);
    };

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
                                <ScheduleDetailSection agendaItems={agenda.agendaItems} />
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
                                    variant="secondary"
                                    size="sm"
                                    className="self-end"
                                    onClick={handleAddDetailItem}
                                    type="button"
                                >
                                    {detailItem.id ? 'Update schedule' : 'Add to schedule'}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:justify-between sm:flex-row gap-4">
                    <div>
                        {agenda && agenda?.id && (
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
                            <>
                                <Button
                                    variant="secondary"
                                    size="default"
                                    className="w-1/2 sm:w-auto"
                                    disabled={form.title !== ''}
                                    onClick={handleGenerateWithAI}
                                    type="button"
                                    area-label="Generate with AI"
                                >
                                    <Sparkles />{isGeneratingContent ? 'Generating...' : 'Generate with AI'}
                                </Button>
                                <Button
                                    variant="default"
                                    type="button"
                                    size="default"
                                    className="w-1/2 sm:w-auto"
                                    aria-label="Add schedule detail"
                                    disabled={!form.title || !form.description}
                                    onClick={() => setIsShowDetailItem(true)}
                                >
                                    Schedule detail
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="default"
                                size="default"
                                className="w-1/2 sm:w-auto"
                                onClick={handleSaveSchedule}
                            >
                                {!agenda?.id ? 'Publish' : 'Save schedule'}
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
