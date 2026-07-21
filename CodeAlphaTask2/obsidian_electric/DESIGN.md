---
name: Obsidian Electric
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cfc2d8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#988ca1'
  outline-variant: '#4c4355'
  surface-tint: '#dbb8ff'
  primary: '#dbb8ff'
  on-primary: '#480082'
  primary-container: '#9d3bff'
  on-primary-container: '#fffbff'
  inverse-primary: '#8512e7'
  secondary: '#ffb4aa'
  on-secondary: '#690004'
  secondary-container: '#d20312'
  on-secondary-container: '#ffe2de'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#757474'
  on-tertiary-container: '#fffbfb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#efdbff'
  primary-fixed-dim: '#dbb8ff'
  on-primary-fixed: '#2b0052'
  on-primary-fixed-variant: '#6600b6'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930008'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 12px
  margin-mobile: 16px
  margin-desktop: 24px
  container-max: 1200px
---

## Brand & Style

This design system targets a sophisticated, high-energy social audience that values both information density and visual prestige. The brand personality is "Techno-Noir"—a fusion of high-performance utility and late-night aesthetic refinement.

The visual style is a hybrid of **High-Contrast Bold** and **Glassmorphism**. It utilizes a deep, obsidian-like foundation to allow content to pop with maximum vibrance. By combining the rigorous information density of a microblogging platform with the lush, tactile depth of a media-first app, the UI evokes a sense of "premium speed." Key elements are defined by crisp edges, vibrant accents, and subtle translucent layers that provide a sense of physical stacking.

## Colors

The palette is anchored by **Deep Obsidian (#050505)**, providing a near-perfect black base that eliminates visual noise and maximizes OLED display efficiency. 

- **Primary (Electric Purple):** Used exclusively for high-priority actions, active states, and brand-critical moments. It should vibrate against the dark background.
- **Secondary (Vivid Red):** Actively used for alerts, critical interactions, and high-energy accents. It provides a sharp, aggressive contrast to the primary purple.
- **Tertiary (Graphite):** Used for "squircle" containers and card surfaces to create subtle separation from the base layer.
- **Accents:** Use a 20% opacity Electric Purple for hover states and secondary interactive backgrounds.

## Typography

The system uses **Plus Jakarta Sans** for its modern, friendly yet geometric construction, ensuring readability at high densities. **Hanken Grotesk** is introduced for technical labels and metadata to provide a sharp, precise contrast to the rounder body text.

To maintain information density, body text uses a slightly tighter line height than traditional lifestyle apps, while headlines use heavy weights (700-800) to create clear entry points in the feed. Letter spacing is slightly tracked out for small labels to maintain clarity against the high-contrast background.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model on desktop (12 columns) and a **Fluid Grid** on mobile. The rhythm is based on a strict 4px baseline grid to handle dense information sets efficiently.

- **Mobile:** Single column feed with 16px side margins. Media spans full width to mimic the Instagram immersive feel.
- **Desktop:** Three-column layout. Left (Navigation/Profile), Center (Feed - 600px fixed), Right (Discovery/Trending). 
- **Density:** Gutters are kept tight (12px) to allow more content to be visible above the fold, similar to the information density seen in professional dashboards.

## Elevation & Depth

Hierarchy is achieved through **Glassmorphism** and **High-Contrast Outlines** rather than traditional soft shadows.

1.  **Base (Level 0):** Pure Obsidian (#050505).
2.  **Surface (Level 1):** Graphite (#1A1A1A) with a 1px solid border (#2A2A2A) for containers.
3.  **Floating (Level 2):** Glassmorphic layers. Background blur (20px) with 70% opacity fill. These are used for navigation bars and sticky headers.
4.  **Interaction:** When an element is pressed, it uses an inner glow of Electric Purple or Vivid Red rather than a drop shadow, emphasizing the "tactile" feel.

## Shapes

The "Squircle" is the primary geometric motif. All containers, image masks, and buttons must utilize the `rounded-lg` (16px) or `rounded-xl` (24px) tokens to soften the high-contrast aesthetic.

- **Primary Containers:** 16px (rounded-lg).
- **Interactive Elements (Buttons/Inputs):** 12px (intermediate).
- **Media/Avatars:** 24px (rounded-xl) for a distinct "app-like" look.
- **Borders:** 1px width is standard. Use 2px for active focus states.

## Components

- **Floating Navigation Bar:** Positioned at the bottom on mobile and the top-center on desktop. Uses a glassmorphic background blur (24px) with a subtle 1px border at 10% opacity.
- **Buttons:**
    - *Primary:* Electric Purple background, White text, no border.
    - *Destructive/Critical:* Vivid Red background, White text, no border.
    - *Secondary:* Transparent background, 1px Electric Purple or Vivid Red border.
- **Cards:** Use a "Squircle" shape with Graphite (#1A1A1A) background. High-contrast 1px border (#333) is mandatory to separate content from the obsidian base.
- **Inputs:** Darker than the card surface (#0A0A0A), using Electric Purple for the 2px focus border.
- **Chips/Tags:** Pill-shaped with a 10% Electric Purple or Vivid Red tint and 700 weight Hanken Grotesk text.
- **Feed Items:** Combine high-density text (X-style) with large-format media (Instagram-style). The interaction bar (Like/Share/Reply) uses thin-stroke icons that turn Electric Purple on active states.