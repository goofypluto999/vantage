# Vantage App - 3D Implementation Instructions

**Context:**
This application is a prototype for a $5 token-based, risk-free, high-demand job preparation tool called "Vantage". The user wants a highly premium, boutique aesthetic using a "pastel glassmorphism" theme (soft pastel gradients, translucent frosted glass cards, white borders, and indigo text).

**Your Task:**
The user has provided this codebase as a blueprint. Your job is to replace the 3D placeholders in `/src/components/LandingPage.tsx` with high-fidelity, beautiful 3D assets that match the pastel glassmorphism theme.

### Instructions for `/src/components/LandingPage.tsx`:

1. **Hero Section (Globe):**
   - Locate the `InteractiveGlobePlaceholder` component.
   - Replace it with a high-quality, translucent, glass-like 3D Globe.
   - **CRITICAL LOGIC:** You must retain the hover logic. The globe should spin slowly by default, and spin rapidly when the user hovers their mouse over it (`onPointerOver` / `onPointerOut`).

2. **Scroll Section (Middle Object):**
   - Locate the `ScrollObjectPlaceholder` component.
   - Replace it with a high-fidelity 3D Document, a stack of glass papers, or an abstract geometric object that represents "data extraction" and "signal from noise".
   - **CRITICAL LOGIC:** You must retain the scroll logic. The object must rotate and move dynamically based on `window.scrollY` as the user scrolls down the page.

*Note: The layout structure, UI components, and pastel glassmorphism styling are already perfect. Do not change the overall layout or CSS theme, only focus on upgrading the 3D elements inside the `<Canvas>` components.*
