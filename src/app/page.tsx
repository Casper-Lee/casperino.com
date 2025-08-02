'use client'

import { useState } from 'react';
import ProfileCard from "./components/ProfileCard/ProfileCard";
import CardPackAnimation from "./components/CardPackAnimation/CardPackAnimation";
import me from "../../public/image.jpg";

export default function Home() {
  const [showProfileCard, setShowProfileCard] = useState(false);

  const handleAnimationComplete = () => {
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      setShowProfileCard(true);
    }, 100);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!showProfileCard ? (
        <CardPackAnimation onAnimationComplete={handleAnimationComplete} />
      ) : (
        <div className="profile-card-container">
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
      )}
    </div>
  );
}
