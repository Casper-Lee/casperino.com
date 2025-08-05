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

  const experience = [
    {
      company: "TechCorp Solutions",
      position: "Senior Full Stack Developer",
      duration: "2022 - Present",
      description: "Lead development of scalable web applications using React, Node.js, and cloud technologies. Implemented CI/CD pipelines, mentored junior developers, and delivered projects that improved user engagement by 40%."
    },
    {
      company: "InnovateStartup",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: "Built and maintained multiple web applications using modern frameworks. Contributed to product development decisions, optimized database queries, and implemented responsive design patterns."
    },
    {
      company: "DigitalCraft Agency",
      position: "Frontend Developer",
      duration: "2018 - 2020",
      description: "Developed responsive websites and web applications for diverse clients. Collaborated with designers and backend developers to deliver high-quality products on time and within budget."
    },
    {
      company: "Freelance Developer",
      position: "Web Developer",
      duration: "2016 - 2018",
      description: "Worked with various clients to create custom websites and web applications. Managed projects from concept to deployment, ensuring client satisfaction and technical excellence."
    },
    {
      company: "TechStart Inc",
      position: "Junior Developer",
      duration: "2015 - 2016",
      description: "Assisted in developing web applications and learning modern development practices. Contributed to team projects, participated in code reviews, and gained experience with agile methodologies."
    },
    {
      company: "Open Source Community",
      position: "Contributor",
      duration: "2014 - Present",
      description: "Active contributor to various open source projects. Helped maintain and improve community-driven software solutions, participated in code reviews, and mentored new contributors."
    }
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
            onContactClick={() => console.log("Contact clicked")}
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
