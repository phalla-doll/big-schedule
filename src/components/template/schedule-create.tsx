"use client";

import { Loader2, Sparkles } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Agenda, AgendaItem } from "@/lib/global-interface";
import { Separator } from "@/components/ui/separator";
import ScheduleDetailSection from "@/components/template/schedule-detail-section";
import ScheduleForm from "./schedule-agenda-form";
import AgendaDetailForm from "@/components/template/agenda-detail-form";
import { HowItWorksButton } from "@/components/template/how-it-works-button";
import { defaultUser } from "@/lib/utils";
import { toast } from "sonner";
import { useSupabaseUser } from "@/components/template/supabase-user";
import LoginDialog from "@/components/template/login-dialog";

export default function ScheduleCreate({ onPreview, agendaFromParent }: { onPreview?: (agenda: Agenda) => void, agendaFromParent: Agenda | undefined; }) {
    const [agenda, setAgenda] = useState<Agenda | undefined>(agendaFromParent);
    const [isShowDetailItem, setIsShowDetailItem] = useState(false);
    const [isShowLoginDialog, setIsShowLoginDialog] = useState(false);
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
    const [isSaving, setIsSaving] = useState(false);
    const user = useSupabaseUser();

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
                    author: defaultUser, // Set the author to the temporary user
                    slug: "", // Optional slug for URL-friendly identification
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

    async function handleSaveSchedule(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
        event.preventDefault();
        console.log('current user: ', user);
        if (!user) {
            setIsShowLoginDialog(true);
            return;
        }
        setIsSaving(true);
        try {
            // Prepare agenda payload (no agendaItems)
            const payload = {
                id: agenda?.id || undefined,
                title: form.title,
                description: form.description,
                ownerId: user.id,
                isPublic: form.isPublic,
                createdAt: agenda?.createdAt || new Date().toISOString(),
                agendaItems: agenda?.agendaItems || [],
                slug: agenda?.slug || "",
            };
            console.log('payload', payload);

            const res = await fetch("/api/agendas", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            console.log('response data', data);

            if (!res.ok) {
                toast.error(data.error || "Failed to save agenda");
                throw new Error(data.error || "Failed to save agenda");
            }

            // Update agenda state with response (keep agendaItems)
            setAgenda({
                ...data,
                agendaItems: data.agendaItems || [],
                author: user,
            });
            toast.success("Agenda published successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to save agenda");
        } finally {
            setIsSaving(false);
        }
    }

    // const handleGenerateWithAI = (): void => {
    //     const now = new Date().toISOString();
    //     const currentDate = new Date();
    //     const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    //     const tripStartDate = nextMonth;
    //     setIsGeneratingContent(true);

    //     const newAgenda: Omit<Agenda, 'id' | 'ownerId' | 'createdAt'> & { agendaItems: AgendaItem[] } = {
    //         title: "3 Days Epic Japan Adventure",
    //         description: "An AI-crafted itinerary for an unforgettable 3-day journey through the highlights of Japan, focusing on Tokyo and a day trip to Hakone.",
    //         isPublic: true,
    //         agendaItems: generatedAgendaItems(tripStartDate, now, agenda?.id || undefined),
    //     };

    //     setTimeout(() => {
    //         setForm(prev => ({
    //             ...prev,
    //             title: newAgenda.title,
    //             description: newAgenda.description ?? "",
    //             isPublic: newAgenda.isPublic,
    //         }));
    //         setAgenda({
    //             id: "", // No ID for a new, unsaved agenda
    //             ownerId: "", // No ownerId yet
    //             createdAt: "", // No createdAt yet
    //             title: newAgenda.title,
    //             description: newAgenda.description,
    //             isPublic: newAgenda.isPublic,
    //             agendaItems: newAgenda.agendaItems.map(item => ({
    //                 ...item,
    //                 id: crypto.randomUUID(),
    //                 agendaId: "", // Will be set on save
    //                 createdAt: new Date().toISOString(),
    //             })),
    //             author: defaultUser, // Set the author to the temporary user
    //         });
    //         setIsShowDetailItem(true);
    //         console.log("Generated agenda items:", newAgenda);
    //     }, 2000);
    // };

    const handleAiGeneration = async () => {
        setIsGeneratingContent(true);
        const computedPrompt = `Create a detailed schedule for a ${form.title}, focusing on ${form.description}.`;
        try {
            const result = await generateText(computedPrompt);
            console.log('result => ', result);
            if (result.title && result.description) {
                setForm(prev => ({
                    ...prev,
                    title: result.title,
                    description: result.description,
                }));
            }
            if (result.agendaItems || result.agendaItem) {
                const items = result.agendaItems || result.agendaItem || [];
                setAgenda(prev => ({
                    ...(prev || {
                        id: "",
                        ownerId: "",
                        createdAt: new Date().toISOString(),
                        title: form.title,
                        description: form.description,
                        isPublic: form.isPublic,
                        agendaItems: [],
                        author: defaultUser,
                        slug: "", // Optional slug for URL-friendly identification
                    }),
                    agendaItems: items?.map((item: any) => ({
                        ...item,
                        id: `fake_${crypto.randomUUID()}`,
                        agendaId: agenda?.id ?? "",
                        createdAt: new Date().toISOString(),
                    })),
                }));
                setIsShowDetailItem(true);
            } else {
                toast.error("No agenda items generated. Please try again.");
                console.error("No agenda items generated:", result);
                return;
            }
            toast.success("AI content generated!");
        } catch (error) {
            toast.error("Failed to generate content.");
            console.error(error);
        } finally {
            setIsGeneratingContent(false);
        }
    };

    async function generateText(prompt: string) {
        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error("API error");
            }

            const data = await res.json();
            return data.result;
        } catch (error) {
            throw error;
        }
    }

    return (
        <>
            {isShowLoginDialog && <LoginDialog onClose={() => setIsShowLoginDialog(false)} />}
            <Card className="relative w-full sm:w-3xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Create New Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScheduleForm form={form} handleChange={handleChange} setForm={setForm} readOnly={isGeneratingContent} />
                    {agenda?.agendaItems?.length && (
                        <>
                            <Separator className="my-5" />
                            <div className="mt-5">
                                <ScheduleDetailSection agendaItems={agenda.agendaItems} isInPreviewMode={false} author={user || undefined} />
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
                                    disabled={isGeneratingContent || !form.title || !form.description}
                                    onClick={handleAiGeneration}
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
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" />
                                        Publishing...
                                    </span>
                                ) : (
                                    !agenda?.id ? 'Publish' : 'Save schedule'
                                )}
                            </Button>
                        )}
                    </div>
                </CardFooter>
                <BorderBeam
                    duration={9}
                    size={400}
                    className="from-transparent via-purple-500 to-transparent"
                />
                <BorderBeam
                    duration={9}
                    delay={3}
                    size={400}
                    className="from-transparent via-teal-500 to-transparent"
                />
            </Card>
        </>
    );
}
