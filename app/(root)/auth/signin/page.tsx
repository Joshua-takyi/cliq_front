import { auth } from "@/auth";
import SignIn from "./signin";
import { redirect } from "next/navigation";
export default async function SignInPage() {
  const session = await auth();
  const user = session?.user;
  if (user) {
    redirect("/");
  }
  return (
    <div>
      <SignIn />
    </div>
  );
}
