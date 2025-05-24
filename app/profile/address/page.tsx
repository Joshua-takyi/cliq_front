import AddAddress from "../component/address";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Addresses",
  description: "Add, edit, or remove addresses for your account.",
};

export default function Address() {
  return (
    <div>
      <AddAddress />
    </div>
  );
}
