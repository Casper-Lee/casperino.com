"use client";

import { useState } from "react";
import Image from "next/image";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import CardPackAnimation from "./components/CardPackAnimation/CardPackAnimation";
import photo from "../../public/photo.jpg";
import Dock from "./components/Dock/Dock";
import linkedin from "../../public/linkedin.svg";
import house from "../../public/house.svg";
import github from "../../public/github.svg";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    // Check if it's an external URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      // Internal navigation
      router.push(path);
    }
  };

  const items = [
    {
      icon: (
        <div className="dock-svg-icon">
          <Image
            src={house}
            alt="Home"
            width={32}
            height={32}
            className="dock-icon-image"
          />
        </div>
      ),
      label: "Home",
      onClick: () => handleNavigate("/"),
    },
    {
      icon: (
        <div className="dock-svg-icon">
          <Image
            src={linkedin}
            alt="LinkedIn"
            width={32}
            height={32}
            className="dock-icon-image"
          />
        </div>
      ),
      label: "LinkedIn",
      onClick: () => handleNavigate("https://www.linkedin.com/in/casper-ljy"),
    },
    {
      icon: (
        <div className="dock-svg-icon">
          <Image
            src={github}
            alt="Github"
            width={32}
            height={32}
            className="dock-icon-image"
          />
        </div>
      ),
      label: "Github",
      onClick: () => handleNavigate("https://github.com/Casper-Lee"),
    },
  ];

  const handleAnimationComplete = () => {
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      setShowProfileCard(true);
    }, 100);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {!showProfileCard ? (
        <CardPackAnimation onAnimationComplete={handleAnimationComplete} />
      ) : (
        <div className="profile-card-container">
          <ProfileCard
            name="Casper"
            title="Full Stack Developer"
            handle="Casper"
            status="Coding"
            contactText="Contact Me"
            avatarUrl={photo}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => console.log("Contact clicked")}
          />
          <Dock
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      )}
    </div>
  );
}
