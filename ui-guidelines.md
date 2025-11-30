# UI Guidelines

## Design Philosophy

- **Style**: Modern hybrid fitness/health (Apple Fitness + Notion minimal)
- **Aesthetic**: Clean, minimal, supportive - no visual noise
- **Tone of Voice**: Calm, neutral, supportive - NO exclamation marks

---

## STYLE SYSTEM: "Hybrid Fitness Premium (Mode D)"

**⚠️ PERMANENT DESIGN RULE — Apply automatically to all UI components and refactors**

### 1. Visual Language

- **Base tone**: Minimal, clean, light spacing rhythm, no heavy borders.
- **Shadows**: Use subtle shadows only for interactive elements (cards, sheets, floating UI).
- **Primary brand color usage** (use intentionally, not decoratively):
  - CTAs (primary buttons)
  - Progress visualization
  - Active navigation state
  - Success confirmations

### 2. Typography Rules

- **Headings**: Clean, bold but not oversized.
- **Body text**: Neutral, softer tone using `textMuted` token.
- **Fonts**: Use no decorative or playful fonts.

### 3. Radius & Surface System

- **Radius defaults**:
  - Buttons: `tokens.radius.md`
  - Cards & modals: `tokens.radius.lg`
  - Icons & inputs: `tokens.radius.sm`
  - Only use `tokens.radius.full` for avatars and circular UI

### 4. Interaction & Motion

- **Micro-interactions**: Small only — `scale(0.98)` on press, soft transitions.
- **Page transitions**: Smooth and subtle — no hard slide animations.
- **Progress/health status**: May use slight motion for feedback.

### 5. Color Philosophy

- **Layout**: Use neutral grayscale with subtle contrast steps.
- **Brand color**: Use intentionally for meaning, not decoration.

### 6. Dark Mode

- **Color inversion**: Do not invert colors aggressively.
- **Surfaces**: Soft layered surfaces, `textMuted` softened, primary remains consistent.

---

## Design System Usage

### Token System

- **Source of Truth**: `packages/design-system/tokens/design-tokens.ts`
- **CSS Variables**: Defined in `apps/web/app/globals.css`
- **Rule**: Always use tokens, never hardcode values

### Component Rules

1. **No inline hardcoded values** for:
   - Spacing (use `tokens.spacing.*`)
   - Colors (use `tokens.colors.*`)
   - Border radius (use `tokens.radius.*`)
   - Font sizes (use `tokens.font.size.*`)
   - Shadows (use `tokens.shadows.*`)

2. **Interactions**:
   - iOS-style smooth press: `scale(0.98)` on active/press
   - Smooth transitions using `tokens.transitions.*`
   - Hover states must be subtle and consistent

3. **Component Location**:
   - Reusable components: `packages/design-system/components/`
   - Page/screen code: `apps/web/app/*`
   - Components must be reusable and not tied to specific pages

4. **Theme Support**:
   - Dark mode must work using existing CSS variables
   - All colors reference CSS variables that support theme switching

5. **Accessibility**:
   - Focus states must be visible
   - Use focus rings from tokens
   - Maintain proper contrast ratios

## Typography

- Use semantic HTML (`<h1>`, `<h2>`, `<h3>`, `<p>`)
- Font sizes are defined in CSS, not via Tailwind classes
- Only use `style={{ fontSize: '14px' }}` for labels when necessary

## Spacing

- Sections: `tokens.spacing.section` (80px)
- Components: `tokens.spacing.component` (24px)
- Cards: `tokens.spacing.card` (16px)
- Small gaps: `tokens.spacing.sm` (8px)

## Colors

- Background: `tokens.colors.background`
- Surface: `tokens.colors.surface`
- Primary: `tokens.colors.primary`
- Text: `tokens.colors.textMain`
- Muted: `tokens.colors.textMuted`

## Component Patterns

### Button
- Use tokens for all styling
- iOS-style press interaction (scale 0.98)
- Smooth transitions
- Proper focus states

### Card
- Use `tokens.colors.surface` for background
- Use `tokens.radius.md` for corners
- Use `tokens.shadows.sm` for subtle shadow

### Input
- Use tokens for borders, colors, spacing
- Focus states with primary color ring

## Refactoring Process

1. Create component in `packages/design-system/components/`
2. Use tokens from `design-tokens.ts`
3. Test component in isolation
4. Update imports across project
5. Mark old component as deprecated
6. Remove deprecated component after verification

