"use client";

import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";
// Add Shadcn Tooltip imports
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Theme = "light" | "dark";

function ThemeToggle({ className }: { className?: string }) {
    // Initialize theme as undefined. It will be set on the client after mount.
    const [theme, setTheme] = useState<Theme | undefined>(undefined);

    // Effect to set the initial theme based on localStorage or system preference (client-side only)
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            // If no theme is stored, use system preference
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        }
    }, []); // Empty dependency array means this runs once after mount

    // Effect to apply the theme to the document and update localStorage
    useEffect(() => {
        // Only run if theme is determined
        if (theme === undefined) {
            return;
        }

        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            root.style.colorScheme = "dark";
        } else {
            root.classList.remove("dark");
            root.style.colorScheme = "light";
        }
        localStorage.setItem("theme", theme);
    }, [theme]); // Re-run when theme changes

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            // Only change if no theme is explicitly set by the user
            if (!localStorage.getItem("theme-user-preference")) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        // Set a flag indicating user has made a preference
        localStorage.setItem("theme-user-preference", "true");
    };

    // Fullscreen state
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // If the theme is not yet determined, render null to prevent hydration mismatch.
    // The component will render correctly on the client after useEffect.
    if (theme === undefined) {
        return null;
    }

    return (
        <div className={className}>
            <div className="flex gap-1">
                {/* Hide this full-screen toggle when mobile screen */}
                <div className="hidden sm:block">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Toggle
                                    variant="default"
                                    size="sm"
                                    className="group data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
                                    pressed={isFullscreen}
                                    onPressedChange={toggleFullscreen}
                                    aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
                                >
                                    <Maximize2
                                        size={16}
                                        strokeWidth={2}
                                        className="shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
                                        aria-hidden="true"
                                    />
                                    <Minimize2
                                        size={16}
                                        strokeWidth={2}
                                        className="absolute shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
                                        aria-hidden="true"
                                    />
                                </Toggle>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            {isFullscreen ? "Exit full screen" : "Enter full screen"}
                        </TooltipContent>
                    </Tooltip>
                </div>
                {/* Theme toggle */}
                <Toggle
                    variant="default"
                    size="sm"
                    className="group data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
                    pressed={theme === "dark"}
                    onPressedChange={toggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    <Moon
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
                        aria-hidden="true"
                    />
                    <Sun
                        size={16}
                        strokeWidth={2}
                        className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
                        aria-hidden="true"
                    />
                </Toggle>
            </div>
        </div>
    );
}

export { ThemeToggle };
