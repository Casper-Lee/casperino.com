'use client'
import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import "./ProfileCard.css";
import { trackExperienceClick } from "../../_utils/gtm";

// TypeScript interfaces
interface AnimationConfig {
  SMOOTH_DURATION: number;
  INITIAL_DURATION: number;
  INITIAL_X_OFFSET: number;
  INITIAL_Y_OFFSET: number;
  DEVICE_BETA_OFFSET: number;
}

interface AnimationHandlers {
  updateCardTransform: (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => void;
  createSmoothAnimation: (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => void;
  cancelAnimation: () => void;
}

interface ProfileCardProps {
  avatarUrl?: string | StaticImageData;
  iconUrl?: string | StaticImageData;
  grainUrl?: string | StaticImageData;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string | StaticImageData;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
  priority?: boolean; // Next.js Image priority prop
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
}

interface DeviceOrientationEvent extends Event {
  beta: number | null;
  gamma: number | null;
}

interface DeviceMotionEvent extends Event {
  requestPermission?: () => Promise<string>;
}

// Extend Window interface for device orientation
declare global {
  interface Window {
    DeviceMotionEvent: {
      requestPermission?: () => Promise<string>;
    };
  }
}

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG: AnimationConfig = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
};

const clamp = (value: number, min: number = 0, max: number = 100): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision: number = 3): number => parseFloat(value.toFixed(precision));

const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "<Placeholder for avatar URL>",
  iconUrl = "<Placeholder for icon URL>",
  grainUrl = "<Placeholder for grain URL>",
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Javi A. Torres",
  title = "Software Engineer",
  handle = "javicodes",
  status = "Online",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
  priority = false,
  experience,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const animationHandlers = useMemo((): AnimationHandlers | null => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement): void => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement): void => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number): void => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(
        event.clientX - rect.left,
        event.clientY - rect.top,
        card,
        wrap
      );
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback((): void => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent): void => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove("active");
      card.classList.remove("active");
    },
    [animationHandlers]
  );

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent): void => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const { beta, gamma } = event;
      if (!beta || !gamma) return;

      animationHandlers.updateCardTransform(
        card.clientHeight / 2 + gamma * mobileTiltSensitivity,
        card.clientWidth / 2 +
          (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    const handleClick = (): void => {
      if (!enableMobileTilt || typeof window !== 'undefined' && window.location.protocol !== "https:") return;
      if (typeof window !== 'undefined' && typeof window.DeviceMotionEvent.requestPermission === "function") {
        window.DeviceMotionEvent.requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener(
                "deviceorientation",
                deviceOrientationHandler as EventListener
              );
            }
          })
          .catch((err: Error) => console.error(err));
      } else if (typeof window !== 'undefined') {
        window.addEventListener("deviceorientation", deviceOrientationHandler as EventListener);
      }
    };

    card.addEventListener("pointerenter", pointerEnterHandler as EventListener);
    card.addEventListener("pointermove", pointerMoveHandler as EventListener);
    card.addEventListener("pointerleave", pointerLeaveHandler as EventListener);
    card.addEventListener("click", handleClick);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler as EventListener);
      card.removeEventListener("pointermove", pointerMoveHandler as EventListener);
      card.removeEventListener("pointerleave", pointerLeaveHandler as EventListener);
      card.removeEventListener("click", handleClick);
      if (typeof window !== 'undefined') {
        window.removeEventListener("deviceorientation", deviceOrientationHandler as EventListener);
      }
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    enableMobileTilt,
    animationHandlers,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  const cardStyle = useMemo(
    (): React.CSSProperties => ({
      "--icon": iconUrl ? `url(${typeof iconUrl === 'string' ? iconUrl : iconUrl.src})` : "none",
      "--grain": grainUrl ? `url(${typeof grainUrl === 'string' ? grainUrl : grainUrl.src})` : "none",
      "--behind-gradient": showBehindGradient
        ? behindGradient ?? DEFAULT_BEHIND_GRADIENT
        : "none",
      "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
    } as React.CSSProperties),
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback((): void => {
    onContactClick?.();
  }, [onContactClick]);

  const handleFlipClick = useCallback((): void => {
    // Track experience button click
    trackExperienceClick();
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
  }, []);

  const handleMiniAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.style.opacity = "0.5";
    target.src = typeof avatarUrl === 'string' ? avatarUrl : avatarUrl.src;
  }, [avatarUrl]);

  // Helper function to check if URL is external
  const isExternalUrl = (url: string | StaticImageData): boolean => {
    if (typeof url !== 'string') return false; // StaticImageData is always internal
    if (typeof window === 'undefined') return false;
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.origin !== window.location.origin;
    } catch {
      return false;
    }
  };

  // Helper function to get image props for Next.js Image component
  const getImageProps = (src: string | StaticImageData, alt: string, className: string, priority: boolean = false) => {
    const isExternal = isExternalUrl(src);
    const imageSrc = typeof src === 'string' ? src : src.src;
    
    if (isExternal) {
      return {
        src: imageSrc,
        alt,
        className,
        width: 0,
        height: 0,
        unoptimized: true,
        priority,
        onError: handleAvatarError,
      };
    }
    
    return {
      src: imageSrc,
      alt,
      className,
      width: 0,
      height: 0,
      priority,
      onError: handleAvatarError,
    };
  };

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      {/* Flip Button - Outside the card */}
      <button
        className="pc-flip-btn-outside"
        onClick={handleFlipClick}
        type="button"
        aria-label="Flip card to see experience"
      >
        <span className="flip-icon">🔄</span>
        <span className="flip-text">{isFlipped ? 'Profile' : 'Experience'}</span>
      </button>

      {/* Main Profile Card */}
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          {/* Background Image - Covers entire card */}
          <div className="pc-background-image">
            <Image
              {...getImageProps(avatarUrl, `${name || "User"} background`, "pc-bg-img", priority)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              alt="background"
            />
          </div>

          {/* Overlay Effects */}
          <div className="pc-shine" />
          <div className="pc-glare" />
          
          {/* Content Overlay */}
          <div className="pc-content-overlay">
            {/* Name and Title */}
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>

            {/* User Info Footer */}
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <Image
                      {...getImageProps(
                        miniAvatarUrl || avatarUrl, 
                        `${name || "User"} mini avatar`, 
                        "pc-mini-avatar-img", 
                        false
                      )}
                      alt="mini avatar"
                      fill
                      sizes="40px"
                      style={{ objectFit: "cover" }}
                      onError={handleMiniAvatarError}
                    />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <button
                  className="pc-contact-btn"
                  onClick={handleContactClick}
                  style={{ pointerEvents: "auto" }}
                  type="button"
                  aria-label={`Contact ${name || "user"}`}
                >
                  {contactText}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience Modal - Separate from card wrapper */}
      {isFlipped && (
        <div className="pc-experience-modal">
          <div className="pc-experience-modal-content">
            <div className="pc-experience-header">
              <h3>Experience</h3>
              <button
                className="pc-close-btn"
                onClick={handleFlipClick}
                type="button"
                aria-label="Close experience"
              >
                ✕
              </button>
            </div>
            
            <div className="pc-experience-content">
              {experience && experience.length > 0 ? (
                experience.map((exp, index) => (
                  <div key={index} className="pc-experience-item">
                    <div className="pc-exp-header">
                      <h4 className="pc-exp-position">{exp.position}</h4>
                      <span className="pc-exp-company">{exp.company}</span>
                    </div>
                    <div className="pc-exp-duration">{exp.duration}</div>
                    <p className="pc-exp-description">{exp.description}</p>
                  </div>
                ))
              ) : (
                <div className="pc-no-experience">
                  <p>No experience data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;
