import { auth } from "@/auth";
import Register from "./register";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();
  const user = session?.user;
  if (user) {
    redirect("/");
  }
  return (
    <div>
      <Register />
    </div>
  );
}
