'use client'

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CardPackAnimation.css';

interface CardPackAnimationProps {
  onAnimationComplete: () => void;
}

const CardPackAnimation: React.FC<CardPackAnimationProps> = ({ onAnimationComplete }) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const packRef = useRef<HTMLDivElement>(null);
  const packTopRef = useRef<HTMLDivElement>(null);
  const packBottomRef = useRef<HTMLDivElement>(null);
  const revealCardRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startAnimation = () => {
    if (animationStarted) return;
    setAnimationStarted(true);

    // Kill any existing animations
    gsap.killTweensOf([packRef.current, packTopRef.current, packBottomRef.current, revealCardRef.current]);

    const tl = gsap.timeline({
      onComplete: () => {
        // Smooth transition to profile card
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            onAnimationComplete();
          }
        });
      }
    });

    // Initial pack shake and glow with smoother easing
    tl.to(packRef.current, {
      scale: 1.15,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(packRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.in"
    })
    .to(packRef.current, {
      y: -25,
      rotationY: 20,
      duration: 0.8,
      ease: "power2.out"
    });

    // Cutting animation - slice the top flap off
    tl.to(packTopRef.current, {
      y: -30,
      rotationX: -25,
      duration: 0.8,
      ease: "power2.inOut"
    }, "-=0.4")
    .to(packBottomRef.current, {
      y: -5,
      rotationX: 2,
      duration: 0.6,
      ease: "power2.inOut"
    }, "-=0.6");

    // Pack fade out
    tl.to(packRef.current, {
      y: -100,
      rotationY: 45,
      opacity: 0,
      duration: 1.0,
      ease: "power2.in"
    }, "-=0.6");

    // Reveal card animation
    tl.to(revealCardRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1.0,
      ease: "back.out(1.7)"
    }, "-=0.4");

    // Sparkle effects
    tl.to(sparklesRef.current?.children, {
      scale: 1.8,
      opacity: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.8")
    .to(sparklesRef.current?.children, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.in"
    }, "-=0.3");
  };

  useEffect(() => {
    // Initial animations with smoother setup
    gsap.set(revealCardRef.current, { scale: 0, opacity: 0 });
    gsap.set(sparklesRef.current?.children, { scale: 0, opacity: 0 });
    
    // Smoother floating animation for pack
    gsap.to(packRef.current, {
      y: -15,
      duration: 2.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    // Add subtle rotation to floating
    gsap.to(packRef.current, {
      rotationY: 5,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
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
        style={{ cursor: animationStarted ? 'default' : 'pointer' }}
      >
        {/* Pack wrapper */}
        <div className="pack-wrapper">
          {/* Pack top (will be cut off) */}
          <div ref={packTopRef} className="pack-top">
            <div className="pack-front-top">
              {/* Top flap - just a small decorative element */}
            </div>
          </div>

          {/* Pack bottom (remains) */}
          <div ref={packBottomRef} className="pack-bottom">
            <div className="pack-front-bottom">
              <div className="pack-logo">
                <div className="pack-brand">Mystery</div>
                <div className="pack-title">Card Collection</div>
              </div>
              <div className="pack-art">
                <div className="card-symbol">🃏</div>
              </div>
              <div className="pack-details">
                <div className="pack-series">Premium Edition</div>
                <div className="pack-cards">Special Card</div>
              </div>
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
      <div className={`pack-instruction ${!animationStarted ? 'show' : ''}`}>
        Click to open your mystery pack!
      </div>
    </div>
  );
};

export default CardPackAnimation; 