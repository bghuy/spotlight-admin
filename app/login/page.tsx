"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = () => {
    // console.log("Starting login with audience: spotlight");
    loginWithRedirect({
      appState: {
        returnTo: "/callback",
      },
      authorizationParams: {
        audience: "spotlight",
        scope: "openid profile email",
      },
    }).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Please log in to access the application</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <Button onClick={handleLogin} className="w-full">
            Login with Auth0
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}