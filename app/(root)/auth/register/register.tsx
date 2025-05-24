"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, CheckCircle, XCircle } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password strength indicators
  const [passwordFocus, setPasswordFocus] = useState(false);

  const passwordHasMinLength = password.length >= 8;
  const passwordHasNumber = /\d/.test(password);
  const passwordHasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordHasUppercase = /[A-Z]/.test(password);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // Redirect to sign-in page after successful registration
      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError("An error occurred during registration");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen ">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <Smartphone className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-semibold italic">ohcase!</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Create an account
            </h2>
            <p className="text-gray-500 mt-2">
              Join TechAccessories to get exclusive deals and track your orders
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12"
                placeholder="Your full name"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email-address" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12"
                placeholder="name@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                className="w-full h-12"
                placeholder="Create a strong password"
                disabled={isLoading}
              />

              {/* Password strength indicators - only show when password field has focus or has content */}
              {(passwordFocus || password.length > 0) && (
                <div className="mt-2 space-y-2 rounded-md bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Password requirements:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center text-xs">
                      {passwordHasMinLength ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                      )}
                      <span
                        className={
                          passwordHasMinLength
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordHasUppercase ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                      )}
                      <span
                        className={
                          passwordHasUppercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        At least one uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordHasNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                      )}
                      <span
                        className={
                          passwordHasNumber ? "text-green-600" : "text-gray-500"
                        }
                      >
                        At least one number
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordHasSymbol ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                      )}
                      <span
                        className={
                          passwordHasSymbol ? "text-green-600" : "text-gray-500"
                        }
                      >
                        At least one special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}
        <img
          src="https://images.unsplash.com/photo-1593298204880-46a17ccad7b0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Premium phone accessories"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-1/3 left-0 right-0 p-8 text-white">
          {/* overlay */}
          <div className="absolute bg-gradient-to-r from-black/20 to-transparent  w-full h-full" />
          <h1 className="text-4xl font-bold mb-4">Join our community</h1>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p className="text-lg">Exclusive member discounts</p>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p className="text-lg">Early access to new products</p>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p className="text-lg">Free shipping on orders over $50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
