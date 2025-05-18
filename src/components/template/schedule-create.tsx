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

export default function ScheduleCreate() {
    // Initialize form state
    const [form, setForm] = useState({
        title: "",
        description: "",
        isPublic: true,
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
                </CardContent>
                <CardFooter className="flex flex-col sm:justify-between sm:flex-row gap-4">
                    <Button
                        variant="outline"
                        size="default"
                        className="w-full sm:w-auto"
                    >
                        <Play className="size-4" /> Play now
                    </Button>
                    <div className="flex w-full sm:w-auto gap-4">
                        <Button
                            variant="outline"
                            size="default"
                            className="w-1/2 sm:w-auto"
                        >
                            Preview
                        </Button>
                        <Button
                            variant="default"
                            size="default"
                            className="w-1/2 sm:w-auto"
                        >
                            Save schedule
                        </Button>
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
