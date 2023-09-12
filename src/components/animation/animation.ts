export const stagger = {
  initial: {
    opacity: 0,
    transition: {
      delayChildren: 5,
      staggerChildren: 4,
      duration: 0.6,
      type: "cubic-bezier",
    },
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 5,
      staggerChildren: 4,
      duration: 0.6,
      type: "cubic-bezier",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      type: "cubic-bezier",
      delayChildren: 5,
      staggerChildren: 4,
      duration: 0.6,
    },
  },
};

export const pageTransition = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      type: "cubic-bezier",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      type: "cubic-bezier",
    },
  },
};

export const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      type: "cubic-bezier",
    },
  },
  exit: {
    y: 60,
    opacity: 0,
    transition: {
      type: "cubic-bezier",
    },
  },
};

export const fadeInLeft = {
  initial: {
    x: -60,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      type: "cubic-bezier",
    },
  },
  exit: {
    x: -60,
    opacity: 0,
    transition: {
      type: "cubic-bezier",
    },
  },
};

export const fadeInRight = {
  initial: {
    x: 60,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      type: "cubic-bezier",
    },
  },
  exit: {
    x: 60,
    opacity: 0,
    transition: {
      type: "cubic-bezier",
    },
  },
};

export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "cubic-bezier",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      type: "cubic-bezier",
    },
  },
};

export const down = {
  initial: { y: -100 },
  animate: {
    y: 0,
  },
  exit: {
    y: 100,
  },
};

export const zoomIn = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      type: "cubic-bezier",
    },
    scale: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      type: "cubic-bezier",
    },
    scale: 0,
  },
};

export const countdownTimer = {
  initial: {
    y: "50%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "cubic-bezier",
    },
  },
  exit: {
    y: "-20%",
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
