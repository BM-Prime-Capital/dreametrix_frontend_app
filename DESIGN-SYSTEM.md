# DreaMetrix Design System

This document outlines the design system for the DreaMetrix educational platform.

## Core Principles

1. **Consistency** - Maintain visual and interaction consistency across the platform
2. **Accessibility** - Ensure the platform is usable by everyone
3. **Simplicity** - Keep interfaces clean and focused on the task at hand
4. **Hierarchy** - Create clear visual hierarchy to guide users
5. **Feedback** - Provide clear feedback for all user interactions

## Color System

### Brand Colors

- **Primary Blue** - `hsl(195, 82%, 52%)` - #25AAE1
  - Main brand color, used for primary actions and key UI elements
  - Hover: `hsl(195, 82%, 42%)`
  - Muted: `hsl(195, 82%, 95%)`

- **Secondary Pink** - `hsl(322, 65%, 59%)` - #D15A9D
  - Secondary brand color, used for accents and secondary actions
  - Hover: `hsl(322, 65%, 49%)`
  - Muted: `hsl(322, 65%, 95%)`

- **Accent Purple** - `hsl(262, 38%, 47%)` - #7F569F
  - Tertiary brand color, used for special highlights
  - Muted: `hsl(262, 38%, 95%)`

### Semantic Colors

- **Success** - `hsl(142, 76%, 36%)`
  - Used for success states, confirmations, and positive indicators
  - Muted: `hsl(142, 76%, 95%)`

- **Warning** - `hsl(38, 92%, 50%)`
  - Used for warnings, alerts that need attention
  - Muted: `hsl(38, 92%, 95%)`

- **Destructive** - `hsl(0, 84%, 60%)`
  - Used for errors, destructive actions
  - Muted: `hsl(0, 84%, 95%)`

- **Info** - Same as Primary Blue
  - Used for informational messages and indicators

### UI Colors

- **Background** - `hsl(210, 40%, 98%)`
  - Main background color
  - Dark mode: `hsl(222, 47%, 11%)`

- **Foreground** - `hsl(222, 47%, 11%)`
  - Main text color
  - Dark mode: `hsl(210, 40%, 98%)`

- **Muted** - `hsl(210, 40%, 96%)`
  - Used for subtle backgrounds, disabled states
  - Muted Foreground: `hsl(215, 16%, 47%)`
  - Dark mode: `hsl(217, 33%, 20%)`

- **Card** - `hsl(0, 0%, 100%)`
  - Used for card backgrounds
  - Card Hover: `hsl(210, 40%, 98%)`
  - Dark mode: `hsl(222, 47%, 15%)`

- **Border** - `hsl(214, 32%, 91%)`
  - Used for borders and dividers
  - Dark mode: `hsl(217, 33%, 25%)`

## Typography

### Font Families

- **Sans-serif** - Inter
  - Used for body text, UI elements
- **Display** - Lexend
  - Used for headings, titles

### Text Sizes

- **xs** - 0.75rem (12px)
- **sm** - 0.875rem (14px)
- **base** - 1rem (16px)
- **lg** - 1.125rem (18px)
- **xl** - 1.25rem (20px)
- **2xl** - 1.5rem (24px)
- **3xl** - 1.875rem (30px)
- **4xl** - 2.25rem (36px)

### Font Weights

- **normal** - 400
- **medium** - 500
- **semibold** - 600
- **bold** - 700

## Spacing

- **0** - 0px
- **0.5** - 0.125rem (2px)
- **1** - 0.25rem (4px)
- **1.5** - 0.375rem (6px)
- **2** - 0.5rem (8px)
- **2.5** - 0.625rem (10px)
- **3** - 0.75rem (12px)
- **3.5** - 0.875rem (14px)
- **4** - 1rem (16px)
- **5** - 1.25rem (20px)
- **6** - 1.5rem (24px)
- **8** - 2rem (32px)
- **10** - 2.5rem (40px)
- **12** - 3rem (48px)
- **16** - 4rem (64px)
- **20** - 5rem (80px)

## Border Radius

- **none** - 0px
- **sm** - 0.125rem (2px)
- **DEFAULT** - 0.25rem (4px)
- **md** - 0.375rem (6px)
- **lg** - 0.5rem (8px)
- **xl** - 0.75rem (12px)
- **2xl** - 1rem (16px)
- **3xl** - 1.5rem (24px)
- **full** - 9999px

## Shadows

- **sm** - 0 1px 2px 0 rgb(0 0 0 / 0.05)
- **DEFAULT** - 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
- **md** - 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- **lg** - 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
- **xl** - 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
- **2xl** - 0 25px 50px -12px rgb(0 0 0 / 0.25)
- **soft** - 0 4px 20px rgba(0, 0, 0, 0.08)
- **card** - 0 2px 12px rgba(0, 0, 0, 0.06)
- **dropdown** - 0 10px 25px rgba(0, 0, 0, 0.1)

## Components

### Buttons

- **Primary** - Main call-to-action buttons
- **Secondary** - Alternative actions
- **Outline** - Less prominent actions
- **Ghost** - Minimal visual impact
- **Destructive** - Dangerous or irreversible actions
- **Link** - Appears as a text link
- **Gradient** - Special emphasis with gradient background

### Cards

- **Default** - Standard card with border and shadow
- **Elevated** - More prominent card with stronger shadow
- **Outline** - Card with border only
- **Flat** - Card with border but no shadow
- **Interactive** - Card that responds to hover/focus
- **Gradient** - Card with subtle gradient background

### Inputs

- Standard text input with consistent styling
- Support for icons (left and right)
- Clear error states
- Disabled states

### Data Display

- **StatCard** - For displaying key metrics
- **DataDisplayGrid** - For organizing multiple data points
- **Tables** - For structured data

### Feedback

- **Toast** - For temporary notifications
- **Alert** - For important messages
- **Progress** - For showing completion status
- **Skeleton** - For loading states

## Accessibility Guidelines

1. **Color Contrast** - Maintain WCAG 2.1 AA compliance (4.5:1 for normal text)
2. **Keyboard Navigation** - All interactive elements must be keyboard accessible
3. **Screen Readers** - Use proper ARIA attributes
4. **Focus States** - Clear visual indication of focused elements
5. **Text Sizing** - Support browser text resizing
6. **Reduced Motion** - Respect user preferences for reduced motion

## Animation Guidelines

1. **Purpose** - Animations should have purpose (feedback, guidance, etc.)
2. **Duration** - Keep animations brief (150-300ms)
3. **Easing** - Use appropriate easing functions
4. **Subtlety** - Prefer subtle animations over dramatic ones
5. **Performance** - Optimize for performance (prefer opacity/transform)

## Implementation Notes

This design system is implemented using:
- Tailwind CSS for styling
- Radix UI for accessible primitives
- Class Variance Authority for component variants
- Custom React components for complex patterns