// Student Dashboard Theme Colors
// Based on the design system charte graphique

export const studentTheme = {
  // Primary colors from design system
  primary: {
    blue: "hsl(var(--primary))", // #25AAE1 - Main brand color
    blueHover: "hsl(var(--primary-hover))", // Hover state
    blueMuted: "hsl(var(--primary-muted))", // Muted background
  },
  
  // Secondary colors from design system
  secondary: {
    pink: "hsl(var(--secondary))", // #D15A9D - Secondary brand color
    pinkHover: "hsl(var(--secondary-hover))", // Hover state
    pinkMuted: "hsl(var(--secondary-muted))", // Muted background
  },
  
  // Accent colors from design system
  accent: {
    purple: "hsl(var(--accent))", // #7F569F - Tertiary brand color
    purpleMuted: "hsl(var(--accent-muted))", // Muted background
  },
  
  // Semantic colors
  semantic: {
    success: "hsl(var(--success))", // #4CAF50 - Success states
    successMuted: "hsl(var(--success-muted))", // Success background
    warning: "hsl(var(--warning))", // #FF9800 - Warning states
    warningMuted: "hsl(var(--warning-muted))", // Warning background
    destructive: "hsl(var(--destructive))", // #FF5252 - Error states
    destructiveMuted: "hsl(var(--destructive-muted))", // Error background
    info: "hsl(var(--info))", // Same as primary blue
    infoMuted: "hsl(var(--info-muted))", // Info background
  },
  
  // UI colors
  ui: {
    background: "hsl(var(--background))", // Main background
    foreground: "hsl(var(--foreground))", // Main text color
    card: "hsl(var(--card))", // Card background
    cardForeground: "hsl(var(--card-foreground))", // Card text
    muted: "hsl(var(--muted))", // Muted background
    mutedForeground: "hsl(var(--muted-foreground))", // Muted text
    border: "hsl(var(--border))", // Border color
    input: "hsl(var(--input))", // Input border
    ring: "hsl(var(--ring))", // Focus ring
  },
  
  // Page-specific color assignments
  pages: {
    assignments: {
      header: "bg-gradient-to-r from-primary via-secondary to-accent",
      title: "text-white",
    },
    attendance: {
      title: "text-primary",
      reportButton: "bg-secondary hover:bg-secondary-hover",
      printButton: "bg-primary hover:bg-primary-hover",
    },
    character: {
      title: "text-secondary",
      reportButton: "bg-secondary hover:bg-secondary-hover",
      printButton: "bg-primary hover:bg-primary-hover",
      positiveScore: "text-primary",
      negativeScore: "text-destructive",
      progressBar: "bg-gradient-to-r from-success to-destructive",
    },
    communicate: {
      title: "text-success",
      composeButton: "bg-primary hover:bg-primary-hover",
      activeTab: "bg-accent/10",
      inactiveTab: "bg-muted/30",
    },
    gradebook: {
      title: "text-secondary",
      reportButton: "bg-secondary hover:bg-secondary-hover",
      printButton: "bg-primary hover:bg-primary-hover",
    },
    library: {
      title: "text-warning",
      iconBackground: "bg-primary",
      downloadButton: "text-secondary",
      printButton: "text-primary",
    },
    rewards: {
      title: "text-destructive",
      exchangeButton: "bg-secondary hover:bg-secondary-hover",
      transactionsButton: "bg-accent hover:bg-accent/80",
      balance: "text-primary",
      bestMonth: "text-success",
      worstMonth: "text-destructive",
      cardBackground: "bg-accent/10 hover:bg-accent/20",
    },
  },
  
  // Common component styles
  components: {
    button: {
      primary: "bg-primary hover:bg-primary-hover text-white",
      secondary: "bg-secondary hover:bg-secondary-hover text-white",
      accent: "bg-accent hover:bg-accent/80 text-white",
      success: "bg-success hover:bg-success/90 text-white",
      destructive: "bg-destructive hover:bg-destructive/90 text-white",
      outline: "border border-border bg-card hover:bg-accent/5",
      ghost: "hover:bg-accent/5",
    },
    card: {
      default: "bg-card border border-border",
      elevated: "bg-card border border-border shadow-lg",
      interactive: "bg-card border border-border hover:bg-accent/5 cursor-pointer transition-colors",
    },
    table: {
      header: "bg-muted/50 border-b",
      row: {
        even: "bg-accent/5",
        odd: "bg-card",
        hover: "hover:bg-accent/10",
      },
    },
    select: {
      trigger: "bg-card border border-border",
      content: "bg-card border border-border",
    },
    dialog: {
      content: "bg-card border border-border",
      header: "border-b",
    },
  },
} as const;

// Utility functions for consistent color usage
export const getPageColors = (pageName: keyof typeof studentTheme.pages) => {
  return studentTheme.pages[pageName];
};

export const getComponentColors = (componentName: keyof typeof studentTheme.components) => {
  return studentTheme.components[componentName];
};

// Color mapping for different states
export const colorStates = {
  positive: studentTheme.semantic.success,
  negative: studentTheme.semantic.destructive,
  neutral: studentTheme.ui.mutedForeground,
  primary: studentTheme.primary.blue,
  secondary: studentTheme.secondary.pink,
  accent: studentTheme.accent.purple,
} as const; 