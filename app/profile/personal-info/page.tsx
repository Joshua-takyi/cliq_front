import { Metadata } from "next";
import PersonalInfoComponent from "../component/personal-info";

export const metadata: Metadata = {
  title: "Personal Information",
  description: "Manage your personal information.",
  keywords: "personal information, user profile, account settings",
  openGraph: {
    title: "Personal Information",
    description: "Manage your personal information.",
    url: "https://cliqk.com/profile/personal-info",
    siteName: "CLIQK",
  },
};

export default function PersonalInfo() {
  return (
    <div>
      <PersonalInfoComponent />
    </div>
  );
}
