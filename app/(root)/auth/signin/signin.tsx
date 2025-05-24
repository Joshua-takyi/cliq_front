"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GithubIcon, Smartphone, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { callbackUrl });
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen ">
      {/* Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}
        <img
          src="https://images.unsplash.com/photo-1577954732026-2071521acdfb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Phone accessories showcase"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h1 className="text-3xl font-bold mb-2">TechAccessories</h1>
          <p className="text-lg">
            Elevate your mobile experience with premium accessories
          </p>
        </div>
      </div>

      {/* Sign-in Side */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <Smartphone className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold italic">ohcase!</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 mt-2">
              Sign in to your account to access exclusive deals and track your
              orders
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-5" onSubmit={handleCredentialsSignIn}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in to your account"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full h-12 text-base"
          >
            <GithubIcon className="mr-2 h-5 w-5" />
            GitHub
          </Button>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
              <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
              <span>Your information is secure with us</span>
            </div>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
