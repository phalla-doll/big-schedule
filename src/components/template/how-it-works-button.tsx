import { MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

export function HowItWorksButton() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground">
                    <MessageCircleQuestion className="size-4 mr-2" />
                    How it works?
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 sm:w-112">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">How does it work?</h4>
                        <p className="text-sm text-muted-foreground">
                            This application, &quot;Big Schedule,&quot; is a web tool for creating, managing, and sharing detailed agendas or schedules.
                        </p>
                    </div>
                    <div>
                        <Image width={400} height={300} className="min-w-full rounded-lg shadow-sm" src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmEwd3R0eTRpZDhjODJ6Z2xzbWhzdHZjZHFtdTZheG5ncmV0dzN0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gZEBpuOkPuydi/giphy.gif" alt="How it works GIF" />
                    </div>
                </div>

            </PopoverContent>
        </Popover>
    );
}
