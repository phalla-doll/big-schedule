"use client";

import ScheduleCreate from "@/components/template/schedule-create";
import { useState, useEffect, useRef } from "react";
import SchedulePublicView from "@/components/template/schedule-public-view";
import { Agenda } from "@/lib/global-interface";
import { animate, stagger, AnimatePresence, motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";

function customSplitText(
    element: HTMLElement,
    options?: { wordFormat?: (wordElement: HTMLElement) => void }
): { words: HTMLElement[] } {
    if (!element.textContent) {
        return { words: [] };
    }
    const text = element.textContent.trim();
    const wordsArray = text.split(/\s+/).filter((word) => word.length > 0);
    const wordElements: HTMLElement[] = [];

    element.innerHTML = "";

    wordsArray.forEach((wordStr, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = wordStr;
        if (options?.wordFormat) {
            options.wordFormat(wordSpan);
        }
        element.appendChild(wordSpan);
        wordElements.push(wordSpan);

        if (index < wordsArray.length - 1) {
            element.appendChild(document.createTextNode(" "));
        }
    });

    return { words: wordElements };
}

export default function Schedule() {

    const textContainerRef = useRef<HTMLDivElement>(null);

    // Lenis setup
    useEffect(() => {
        const lenis = new Lenis({
            // Optional: customize options here
            lerp: 0.85, // Adjust for speed vs. smoothness (lower is smoother but can feel slower)
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

    useEffect(() => {
        const container = textContainerRef.current;
        if (!container) return;

        const h4Element = container.querySelector("h4");
        const h1Element = container.querySelector("h1");

        if (!h4Element || !h1Element) return;

        document.fonts.ready.then(() => {
            if (!textContainerRef.current || !h4Element || !h1Element) return;

            textContainerRef.current.style.visibility = "visible";

            const addTailwindClassesToWord = (word: HTMLElement) => {
                word.classList.add(
                    "inline-block", // Ensures proper layout and transform behavior
                    "will-change-transform", // Optimizes transform animations
                    "will-change-opacity" // Optimizes opacity animations
                );
            };

            // Use customSplitText instead of splitText from motion-plus
            const { words: h4Words } = customSplitText(h4Element, {
                wordFormat: addTailwindClassesToWord,
            });
            const { words: h1Words } = customSplitText(h1Element, {
                wordFormat: addTailwindClassesToWord,
            });

            // Animate h4 words
            animate(
                h4Words,
                { opacity: [0, 1], y: [10, 0] },
                {
                    type: "spring",
                    duration: 1.5, // Slightly shorter duration for subtitle
                    bounce: 0,
                    delay: stagger(0.05),
                }
            );

            // Animate h1 words, starting after h4 animation begins
            animate(
                h1Words,
                { opacity: [0, 1], y: [10, 0] },
                {
                    type: "spring",
                    duration: 2,
                    bounce: 0,
                    delay: h4Words.length * 0.05 * 0.5, // Delay before starting h1 animation
                }
            );
        });
    }, []);

    const [isViewMode, setIsViewMode] = useState(false);
    const [agenda, setAgenda] = useState<Agenda>({} as Agenda);

    const handleToggleViewMode = () => {
        setIsViewMode(!isViewMode);
    };

    const handleAgenda = (agenda: Agenda) => {
        setAgenda(agenda);
        setIsViewMode(true);
    };

    return (
        <>
            <div
                className="mb-12"
                ref={textContainerRef}
                style={{ visibility: "hidden" }}
            >
                <h4 className="text-lg sm:text-2xl font-normal mb-4">
                    The Big Schedule Agenda
                </h4>
                <h1 className="text-3xl sm:text-6xl font-light">
                    {(isViewMode && agenda?.title) ? agenda.title : 'What schedule would you like to create today?'}
                </h1>
                {isViewMode && agenda.description && (
                    <h4 className="text-lg sm:text-xl text-muted-foreground w-full sm:w-4xl font-normal mt-5">
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
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SchedulePublicView agenda={agenda} onBackToEdit={handleToggleViewMode} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="create-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ScheduleCreate onPreview={handleAgenda} agendaFromParent={agenda} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
}
