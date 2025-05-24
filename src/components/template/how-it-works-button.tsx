import { MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HowItWorksButton() {
    return (
        <Button variant="ghost" className="text-muted-foreground">
            <MessageCircleQuestion className="size-4" />
            How it works?</Button>
    );
}
