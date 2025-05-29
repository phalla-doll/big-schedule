"use client";

import ScheduleCreate from "@/components/template/schedule-create";
import {useState, useEffect} from "react";
import SchedulePublicView from "@/components/template/schedule-public-view";
import {Agenda} from "@/lib/global-interface";
import {AnimatePresence, motion} from "framer-motion";
import Lenis from "@studio-freight/lenis";
import {defaultUser} from "@/lib/utils";
import {supabase} from "@/lib/supabase";
import {toast} from "sonner";
import { useIsAgendaOwner } from '@/hooks/useIsAgendaOwner';

export default function Schedule() {

    useEffect(() => {
        const lenis = new Lenis({
            // Optional: customize options here
            lerp: 0.80, // Adjust for speed vs. smoothness (lower is smoother but can feel slower)
            wheelMultiplier: 1.2, // Increase for faster mouse wheel scrolling
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    const [isViewMode, setIsViewMode] = useState(false);
    const [agenda, setAgenda] = useState<Agenda>({author: defaultUser} as Agenda);
    const [isLoading, setIsLoading] = useState(true);
    const isOwner = useIsAgendaOwner(agenda);

    const handleToggleViewMode = () => {
        setIsViewMode(!isViewMode);
    };

    const handleAgenda = (agenda: Agenda) => {
        setAgenda({...agenda, author: defaultUser}); // Set a default author for the agenda
        setIsViewMode(true);
    };

    useEffect(() => {
        // Scroll to top when isViewMode changes
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [isViewMode]);

    // Example: in a useEffect after redirect
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            if (session) {
                console.log("User session:", session);
            }
        });
    }, []);

    const fetchAgendaBySlug = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const slug = searchParams.get('slug');
        console.log("Fetching agenda with slug:", slug);
        if (slug) {
            try {
                const response = await fetch(`/api/agendas?slug=${slug}`);
                if (!response.ok) {
                    toast.error('Failed to fetch agenda. Please try again later.');
                    throw new Error(`Failed to fetch agenda: ${response.statusText}`);
                }
                const fetchedAgenda: Agenda = await response.json();
                console.log('Fetched agenda:', fetchedAgenda);
                if (fetchedAgenda && fetchedAgenda.id) {
                    setAgenda({...fetchedAgenda, author: fetchedAgenda.author || defaultUser});
                    setIsViewMode(true); // Assuming you want to switch to view mode if agenda is loaded
                } else {
                    // Handle case where slug is present but agenda not found or is invalid
                    setAgenda({author: defaultUser} as Agenda);
                    setIsViewMode(false);
                }
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching agenda by slug:", error);
                // Optionally, set to default agenda or show an error message
                setAgenda({author: defaultUser} as Agenda);
                setIsViewMode(false);
                setIsLoading(false)
            }
        } else {
            setAgenda({author: defaultUser} as Agenda);
            setIsViewMode(false); // Or keep current view mode, depending on desired behavior
            setIsLoading(false);
        }
    };

    // Call this function in a useEffect, for example:
    useEffect(() => {
        fetchAgendaBySlug().then();
        // Add dependencies if needed, e.g., if routing changes can occur without a full page reload
    }, []);

    return (
        <>
            {isLoading ? (
                <div>Is loading...</div>
            ) : (
                <>
                    <div
                        className={"mb-12" + (isViewMode ? " w-full sm:w-5xl text-center" : "")}>
                        <h4 className="text-lg sm:text-xl font-normal mb-4">
                            The Big Schedule Agenda
                        </h4>
                        <h1 className="text-3xl sm:text-5xl font-light">
                            {(isViewMode && agenda?.title) ? agenda.title : 'What schedule would you like to create today?'}
                        </h1>
                        {isViewMode && agenda.description && (
                            <h4 className="text-lg sm:text-xl text-muted-foreground w-full sm:w-4xl font-normal mt-7">
                                {agenda.description}
                            </h4>
                        )}
                    </div>
                    <div className="w-full flex flex-col justify-center">
                        <div className="flex flex-col items-center gap-4 sm:w-auto">
                            <div className="flex justify-center w-full">
                                <AnimatePresence mode="wait">
                                    {isViewMode ? (
                                        <motion.div
                                            key="public-view"
                                            initial={{opacity: 0, y: 10}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -10}}
                                            transition={{duration: 0.3}}
                                        >
                                            <SchedulePublicView agenda={agenda} isOwner={isOwner} onBackToEdit={handleToggleViewMode}/>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="create-view"
                                            initial={{opacity: 0, y: 10}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -10}}
                                            transition={{duration: 0.3}}
                                        >
                                            <ScheduleCreate onPreview={handleAgenda} agendaFromParent={agenda}/>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
