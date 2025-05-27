import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // or a specific callback URL
      },
    });
  };

  return (
    <Button onClick={handleLogin}>
      Login with Google
    </Button>
  );
}