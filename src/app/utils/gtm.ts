// Google Tag Manager Event Utils - Simplified Version

interface GTMEvent {
  event: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  [key: string]: any;
}

// Initialize GTM dataLayer
const initializeDataLayer = (): void => {
  if (typeof window !== 'undefined' && !(window as any).dataLayer) {
    (window as any).dataLayer = [];
  }
};

// Push event to GTM dataLayer
const pushToDataLayer = (event: GTMEvent): void => {
  if (typeof window !== 'undefined') {
    initializeDataLayer();
    const dataLayer = (window as any).dataLayer;
    if (dataLayer) {
      dataLayer.push(event);
    }
  }
};

// Track card opening
export const trackCardOpening = (): void => {
  const event: GTMEvent = {
    event: 'card_opening',
    event_category: 'engagement',
    event_action: 'click',
    event_label: 'pack_animation'
  };
  
  pushToDataLayer(event);
  console.log('GTM: Card Opening Tracked');
};

// Track experience button click
export const trackExperienceClick = (): void => {
  const event: GTMEvent = {
    event: 'experience_click',
    event_category: 'engagement',
    event_action: 'click',
    event_label: 'experience_button'
  };
  
  pushToDataLayer(event);
  console.log('GTM: Experience Click Tracked');
};

// Track profile interactions
export const trackProfileClick = (action: string): void => {
  const event: GTMEvent = {
    event: 'profile_click',
    event_category: 'engagement',
    event_action: 'click',
    event_label: action
  };
  
  pushToDataLayer(event);
  console.log('GTM: Profile Click Tracked', action);
};

// Track dock navigation
export const trackDockClick = (label: string, url: string): void => {
  const event: GTMEvent = {
    event: 'dock_click',
    event_category: 'navigation',
    event_action: 'click',
    event_label: label,
    destination_url: url
  };
  
  pushToDataLayer(event);
  console.log('GTM: Dock Click Tracked', label);
};

export default {
  trackCardOpening,
  trackExperienceClick,
  trackProfileClick,
  trackDockClick
}; 