export const FB_PIXEL_ID = process.env.FACEBOOK_PIXEL_ID;

declare global {
  interface Window {
    fbq: any;
  }
}

export const pageview = () => {
  window.fbq("track", "PageView");
};

export const event = (name: any, options = {}) => {
  window.fbq("track", name, options);
};
