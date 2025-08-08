"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./CardPackAnimation.css";

interface CardPackAnimationProps {
  onAnimationComplete: () => void;
}

const CardPackAnimation: React.FC<CardPackAnimationProps> = ({
  onAnimationComplete,
}) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const packRef = useRef<HTMLDivElement>(null);
  const packTopRef = useRef<HTMLDivElement>(null);
  const packBottomRef = useRef<HTMLDivElement>(null);
  const revealCardRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const burstStarsRef = useRef<HTMLDivElement>(null);

  const startAnimation = () => {
    if (animationStarted) return;
    setAnimationStarted(true);

    // Kill any existing animations
    gsap.killTweensOf([
      packRef.current,
      packTopRef.current,
      packBottomRef.current,
      revealCardRef.current,
    ]);

    const tl = gsap.timeline({
      onComplete: () => {
        // Smooth transition to profile card
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            onAnimationComplete();
          },
        });
      },
    });

    // Initial pack shake and glow with smoother easing
    tl.to(packRef.current, {
      scale: 1.15,
      duration: 0.4,
      ease: "power2.out",
    })
      .to(packRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.in",
      })
      .to(packRef.current, {
        y: -25,
        duration: 0.8,
        ease: "power2.out",
      });

    // Cutting animation - slice the top flap off
    tl.to(
      packTopRef.current,
      {
        y: -30,
        rotationX: -25,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Lock the top section in its final position
          gsap.set(packTopRef.current, {
            y: -30,
            rotationX: -25,
            clearProps: "none"
          });
          // Add CSS class to maintain position
          packTopRef.current?.classList.add('split');
        },
      },
      "-=0.4"
    ).to(
      packBottomRef.current,
      {
        y: -5,
        rotationX: 2,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          // Lock the bottom section in its final position
          gsap.set(packBottomRef.current, {
            y: -5,
            rotationX: 2,
            clearProps: "none"
          });
          // Add CSS class to maintain position
          packBottomRef.current?.classList.add('split');
        },
      },
      "-=0.6"
    );

    // Smooth star burst animation
    tl.to(
      burstStarsRef.current?.children,
      {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      },
      "-=0.4"
    )
      .to(
        burstStarsRef.current?.children,
        {
          x: (i) => {
            const positions = [
              -120, 120, -100, 100, -80, 80, -60, 60, -140, 140, -90, 90, -70,
              70, -110, 110, -50, 50, -130, 130, -85, 85, -75, 75, -95, 95, -65,
              65, -115, 115,
            ];
            return positions[i] || 0;
          },
          y: (i) => {
            const positions = [
              -100, -80, -120, -60, -140, -100, -80, -120, -60, -140, -90, -70,
              -110, -50, -130, -95, -75, -105, -55, -135, -85, -65, -115, -45,
              -125, -87, -67, -107, -47, -127,
            ];
            return positions[i] || -80;
          },
          rotation: (i) => 360 + i * 12,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.1"
      )
      .to(
        burstStarsRef.current?.children,
        {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        },
        "-=1.0"
      );

    // Pack fade out - maintain split positions
    tl.to(
      packRef.current,
      {
        y: -100,
        rotationY: 45,
        opacity: 0,
        duration: 1.0,
        ease: "power2.in",
        onUpdate: () => {
          // Continuously maintain pack sections in their split positions
          if (packTopRef.current) {
            gsap.set(packTopRef.current, {
              y: -30,
              rotationX: -25,
              clearProps: "none"
            });
          }
          if (packBottomRef.current) {
            gsap.set(packBottomRef.current, {
              y: -5,
              rotationX: 2,
              clearProps: "none"
            });
          }
        }
      },
      "-=0.6"
    );

    // Reveal card animation
    tl.to(
      revealCardRef.current,
      {
        scale: 1,
        opacity: 1,
        duration: 1.0,
        ease: "back.out(1.7)",
      },
      "-=0.4"
    );

    // Sparkle effects
    tl.to(
      sparklesRef.current?.children,
      {
        scale: 1.8,
        opacity: 1,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.8"
    ).to(
      sparklesRef.current?.children,
      {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.in",
      },
      "-=0.3"
    );
  };

  useEffect(() => {
    // Initial animations with smoother setup
    gsap.set(revealCardRef.current, { scale: 0, opacity: 0 });
    gsap.set(sparklesRef.current?.children, { scale: 0, opacity: 0 });
    gsap.set(burstStarsRef.current?.children, { scale: 0, opacity: 0 });

    // Smoother floating animation for pack
    gsap.to(packRef.current, {
      y: -15,
      duration: 2.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Add subtle rotation to floating
    gsap.to(packRef.current, {
      rotationY: 5,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <div ref={containerRef} className="card-pack-container">
      {/* Background glow effect */}
      <div className="pack-background-glow" />

      {/* Main pack container */}
      <div
        ref={packRef}
        className="pack-container"
        onClick={startAnimation}
        style={{ cursor: animationStarted ? "default" : "pointer" }}
      >
        {/* Pack wrapper */}
        <div className="pack-wrapper">
          {/* Pack top (will be cut off) */}
          <div ref={packTopRef} className="pack-top">
            <div className="pack-front-top">
              <div className="pack-top-content">
                <div className="pack-top-logo">PORTFOLIO</div>
                <div className="pack-top-subtitle">DEVELOPER PACK</div>
                <div className="pack-top-series">Premium Collection</div>
                <div className="pack-top-description">Special Edition</div>
              </div>
            </div>
          </div>

          {/* Pack bottom (remains) */}
          <div ref={packBottomRef} className="pack-bottom">
            <div className="pack-front-bottom">
              <img 
                src="/cuteghost_v2.jpg" 
                alt="Cute Ghost" 
                className="pack-ghost-full-image"
              />
            </div>
          </div>

          {/* Pack back */}
          <div className="pack-back">
            <div className="pack-back-pattern">
              <div className="pattern-element">✦</div>
            </div>
          </div>

          {/* Sparkle effects */}
          <div ref={sparklesRef} className="sparkles-container">
            <div className="sparkle sparkle-1" />
            <div className="sparkle sparkle-2" />
            <div className="sparkle sparkle-3" />
            <div className="sparkle sparkle-4" />
            <div className="sparkle sparkle-5" />
          </div>
        </div>

        {/* Burst stars that fly out from the pack */}
        <div ref={burstStarsRef} className="burst-stars">
          <div className="burst-star burst-star-1">⭐</div>
          <div className="burst-star burst-star-2">✨</div>
          <div className="burst-star burst-star-3">🌟</div>
          <div className="burst-star burst-star-4">💫</div>
          <div className="burst-star burst-star-5">⭐</div>
          <div className="burst-star burst-star-6">✨</div>
          <div className="burst-star burst-star-7">🌟</div>
          <div className="burst-star burst-star-8">💫</div>
          <div className="burst-star burst-star-9">⭐</div>
          <div className="burst-star burst-star-10">✨</div>
          <div className="burst-star burst-star-11">🌟</div>
          <div className="burst-star burst-star-12">💫</div>
          <div className="burst-star burst-star-13">⭐</div>
          <div className="burst-star burst-star-14">✨</div>
          <div className="burst-star burst-star-15">🌟</div>
          <div className="burst-star burst-star-16">💫</div>
          <div className="burst-star burst-star-17">⭐</div>
          <div className="burst-star burst-star-18">✨</div>
          <div className="burst-star burst-star-19">🌟</div>
          <div className="burst-star burst-star-20">💫</div>
          <div className="burst-star burst-star-21">⭐</div>
          <div className="burst-star burst-star-22">✨</div>
          <div className="burst-star burst-star-23">🌟</div>
          <div className="burst-star burst-star-24">💫</div>
          <div className="burst-star burst-star-25">⭐</div>
          <div className="burst-star burst-star-26">✨</div>
          <div className="burst-star burst-star-27">🌟</div>
          <div className="burst-star burst-star-28">💫</div>
          <div className="burst-star burst-star-29">⭐</div>
          <div className="burst-star burst-star-30">✨</div>
        </div>

        {/* Reveal card placeholder */}
        <div ref={revealCardRef} className="reveal-card">
          <div className="card-glow" />
          <div className="card-placeholder">
            <div className="card-shine" />
            <div className="card-content">
              <div className="card-title">Profile Card</div>
              <div className="card-subtitle">Loading...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction text */}
      <div className={`pack-instruction ${!animationStarted ? "show" : ""}`}>
        Click to open your mystery pack!
      </div>
    </div>
  );
};

export default CardPackAnimation;
