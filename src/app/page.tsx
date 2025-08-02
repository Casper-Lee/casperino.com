'use client'

import ProfileCard from "./components/ProfileCard/ProfileCard";
import me from "../../public/image.jpg";

export default function Home() {
  return (
    <div>
      <ProfileCard
        name="Casper"
        title="Software Engineer"
        handle="FriendlyGhostCasper"
        status="Online"
        contactText="Contact Me"
        avatarUrl={me}
        showUserInfo={true}
        enableTilt={true}
        enableMobileTilt={false}
        onContactClick={() => console.log("Contact clicked")}
      />
    </div>
  );
}
