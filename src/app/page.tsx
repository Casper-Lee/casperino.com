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
import { 
  trackCardOpening, 
  trackDockClick 
} from "./_utils/gtm";

export default function Home() {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    // Check if it's an external URL
    if (path.startsWith("http://") || path.startsWith("https://")) {
      window.open(path, "_blank", "noopener,noreferrer");
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
      label: "Card Opening",
      onClick: () => {
        setShowProfileCard(false);
      },
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
      onClick: () => {
        trackDockClick("LinkedIn", "https://www.linkedin.com/in/casper-ljy");
        handleNavigate("https://www.linkedin.com/in/casper-ljy");
      },
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
      onClick: () => {
        trackDockClick("Github", "https://github.com/Casper-Lee");
        handleNavigate("https://github.com/Casper-Lee");
      },
    },
  ];

  const handleAnimationComplete = () => {
    trackCardOpening();
    
    setTimeout(() => {
      setShowProfileCard(true);
    }, 100);
  };

  const handleContactClick = () => {
    const email = "contact.casperlee@gmail.com";
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    
    window.open(gmailUrl, '_blank');
  };

  const experience = [
    {
      company: "Govtech Singapore",
      position: "Software Engineer",
      duration: "Dec 2024 - Present",
      description:
        "Built secure AWS Cognito systems, led production release, optimized mobile apps, and reduced UI bugs by 15% with snapshot testing.",
    },
    {
      company: "Mavericks Consulting",
      position: "Full Stack Developer (Consultant)",
      duration: "Dec 2022 - Present",
      description:
        "Led ReactJS app development, optimized CI/CD, built test suites, and deployed Firebase notifications, cutting bugs by 15% and costs by 20%.",
    },
    {
      company: "Singapore Airlines",
      position: "Flight Simulator Technician",
      duration: "June 2019 - Jan 2022",
      description:
        "Supported software patches and collaborated on cabin crew training equipment installation, including Virtual Slide Trainer.",
    },
  ];

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
            onContactClick={handleContactClick}
            experience={experience}
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
