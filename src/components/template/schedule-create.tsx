"use client";

import { Loader2, Sparkles } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Agenda, AgendaItem } from "@/lib/global-interface";
import { Separator } from "@/components/ui/separator";
import ScheduleDetailSection from "@/components/template/schedule-detail-section";
import ScheduleForm from "./schedule-agenda-form";
import AgendaDetailForm from "@/components/template/agenda-detail-form";
import { generatedAgendaItems } from "@/components/template/generated-agenda-items";
import { HowItWorksButton } from "@/components/template/how-it-works-button";

export default function ScheduleCreate({ onPreview, agendaFromParent }: { onPreview?: (agenda: Agenda) => void, agendaFromParent: Agenda | undefined; }) {
    const [agenda, setAgenda] = useState<Agenda | undefined>(agendaFromParent);
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

    // Sync agenda state with agendaFromParent if it changes
    useEffect(() => {
        if (agendaFromParent && agendaFromParent?.title?.length) {
            setAgenda(agendaFromParent); // update agenda state
            setForm({
                title: agendaFromParent.title,
                description: agendaFromParent.description || '',
                isPublic: agendaFromParent.isPublic || false,
                agendaItems: agendaFromParent.agendaItems || [],
            }); // update form fields
        }
    }, [agendaFromParent]);

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

        const newAgenda: Omit<Agenda, 'id' | 'ownerId' | 'createdAt'> & { agendaItems: AgendaItem[] } = {
            title: "3 Days Epic Japan Adventure",
            description: "An AI-crafted itinerary for an unforgettable 3-day journey through the highlights of Japan, focusing on Tokyo and a day trip to Hakone.",
            isPublic: true,
            agendaItems: generatedAgendaItems(tripStartDate, generatedAgendaId, now),
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
        }, 2000);
    };

    return (
        <>
            <Card className="relative w-full sm:w-3xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Create New Schedule</CardTitle>
                    <CardDescription>Fill in the details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScheduleForm form={form} handleChange={handleChange} setForm={setForm} />
                    {agenda?.agendaItems?.length && (
                        <>
                            <Separator className="my-5" />
                            <div className="mt-5">
                                <ScheduleDetailSection agendaItems={agenda.agendaItems} isInPreviewMode={false} />
                            </div>
                        </>
                    )}
                    {isShowDetailItem && (
                        <>
                            <Separator className="my-5" />
                            <AgendaDetailForm
                                detailItem={detailItem}
                                handleDetailChange={handleDetailChange}
                                handleAddDetailItem={handleAddDetailItem}
                            />
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:justify-between sm:flex-row gap-4">
                    <div>
                        <HowItWorksButton />
                    </div>
                    <div className="flex w-full sm:w-auto gap-4">
                        {agenda?.agendaItems?.length && (
                            <Button
                                variant="outline"
                                size="default"
                                className="w-1/2 sm:w-auto"
                                onClick={() => {
                                    if (agenda && onPreview) {
                                        onPreview(agenda);
                                    }
                                }}
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
                                    disabled={form.title !== '' || isGeneratingContent}
                                    onClick={handleGenerateWithAI}
                                    type="button"
                                    area-label="Generate with AI"
                                >
                                    {isGeneratingContent ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" />
                                            Generating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="fill-current text-blue-500" />
                                            <span className="">
                                                Generate with AI
                                            </span>
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    variant="default"
                                    type="button"
                                    size="default"
                                    className="w-1/2 sm:w-auto"
                                    aria-label="Add schedule detail"
                                    disabled={!form.title || !form.description || isGeneratingContent}
                                    onClick={() => setIsShowDetailItem(true)}
                                >
                                    Create detail
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
