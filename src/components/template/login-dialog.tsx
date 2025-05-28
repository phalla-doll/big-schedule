import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function LoginDialog({ onClose }: { onClose: () => void }) {

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}?loginStatus=ok`, // or a specific callback URL
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="w-md">
                <DialogHeader>
                    <DialogTitle>Welcome Back!</DialogTitle>
                </DialogHeader>
                <DialogDescription className="flex flex-col gap-2 my-3">
                    <span className="flex justify-center mb-2">
                        <Image src="/undraw_to-the-moon_w1wa.svg" alt="Google" width={230} height={230} className="h-auto" />
                    </span>
                    <span className="text-center">
                        Login to your account to get started.
                    </span>
                </DialogDescription>
                <DialogFooter>
                    <Button className="w-full" onClick={handleLogin} variant="default" size="lg">
                        <Image src="/Google_Favicon_2025.svg.png" alt="Google" width={20} height={20} />
                        Login with Google
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}