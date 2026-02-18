# Style Migration Guide

This document describes the style migration strategy for the Taiga AngularJS-to-React migration.

## Overview

The migration preserves the existing SCSS structure from the AngularJS application to maintain exact visual appearance. Styles are incrementally extracted into component-specific files as React components are built.

## Directory Structure

```
src/styles/
├── main.scss                 # Main entry point - imports all global styles
├── extras/
│   └── dependencies.scss     # Variables, mixins, reset, helpers (loaded first)
├── themes/
│   └── taiga/
│       ├── variables.scss    # Color palette, theme variables
│       └── custom.scss       # Theme customizations
├── core/                     # Base styles (reset, typography, forms)
│   ├── base.scss
│   ├── typography.scss
│   ├── forms.scss
│   ├── elements.scss
│   └── animation.scss
├── dependencies/             # Mixins, helpers, responsive breakpoints
│   ├── reset.scss
│   ├── helpers.scss
│   ├── responsive.scss
│   └── mixins/               # All reusable SCSS mixins
│       ├── typography.scss
│       ├── sidebar.scss
│       ├── project-card.scss
│       └── ... (23 mixin files)
├── components/               # Reusable UI component styles
│   ├── buttons.scss
│   ├── avatar.scss
│   ├── loader.scss
│   └── ... (26 component files)
├── layout/                   # Page layout styles
│   ├── auth.scss
│   ├── backlog.scss
│   ├── kanban.scss
│   └── ... (15 layout files)
├── modules/                  # Feature module styles
│   ├── admin/
│   ├── auth/
│   ├── backlog/
│   ├── common/
│   ├── epics/
│   ├── help/
│   ├── kanban/
│   ├── search/
│   ├── team/
│   ├── user-settings/
│   └── wiki/
└── shame/                    # Temporary fixes (to be cleaned up)
    └── shame.scss
```

## How Styles Are Loaded

### Global Styles
All global styles are imported via `src/styles/main.scss`, which is loaded in `src/main.jsx`. This ensures the full AngularJS styling is available throughout the React app.

### SCSS Variables and Mixins (Auto-Injected)
The Vite config injects `src/styles/extras/dependencies.scss` into every SCSS file via `css.preprocessorOptions.scss.additionalData`. This means all variables (`$primary`, `$color-link-primary`, etc.) and mixins (`@include font-size()`, `@include project-card`, etc.) are available in any `.scss` file without explicit imports.

### Component-Specific Styles
When migrating a component, extract its styles into a file alongside the component:

```
src/components/cards/
├── ProjectCard.jsx           # React component
└── ProjectCard.scss          # Extracted styles for this component
```

Import the styles directly in the component:
```jsx
import './ProjectCard.scss';
```

## Migration Pattern

### Step 1: Identify the AngularJS styles
Find the styles for the component being migrated. Common locations:
- `app/styles/dependencies/mixins/` - Mixins used via `@include`
- `app/styles/components/` - Standalone component styles
- `app/styles/modules/` - Feature-specific styles
- `app/styles/layout/` - Page layout styles

### Step 2: Create a component SCSS file
Create a `.scss` file next to your React component. If the original styles used a mixin, `@include` it. If they were standalone, copy and adapt them.

Example using the existing mixin:
```scss
// src/components/cards/ProjectCard.scss
.project-card {
  @include project-card;
  cursor: pointer;
}
```

### Step 3: Use the same class names
Use the same CSS class names as the AngularJS templates. This ensures the existing styles apply correctly and the visual appearance is preserved.

```jsx
<div className="project-card">
  <div className="project-card-header">...</div>
</div>
```

### Step 4: Verify visual appearance
Compare the React component side-by-side with the AngularJS version to ensure identical rendering. Check:
- Spacing and padding
- Font sizes and weights
- Colors
- Responsive behavior at different breakpoints

## CSS Modules (Future Use)

CSS modules are configured and available for use when needed. They provide automatic class name scoping to prevent style collisions.

### When to Use CSS Modules
- New components with no AngularJS equivalent
- Components experiencing class name conflicts with global styles
- Shared utility components used across many pages

### When NOT to Use CSS Modules
- Initial migration of existing AngularJS components (use regular SCSS to keep class names identical)
- Components that rely heavily on global class name selectors

### How to Use CSS Modules
Name the file with `.module.scss` extension:

```scss
// ComponentName.module.scss
.card {
  background: $color-white;
  border: 1px solid $color-gray400;
}
```

Import as a module in the component:
```jsx
import styles from './ComponentName.module.scss';

const ComponentName = () => (
  <div className={styles.card}>...</div>
);
```

The class names will be automatically scoped (e.g., `ComponentName__card___a1b2c`).

### CSS Modules Configuration
Configured in `vite.config.js`:
- `localsConvention: 'camelCase'` - Access `.my-class` as `styles.myClass`
- `scopeBehaviour: 'local'` - All classes are scoped by default
- `generateScopedName` - Generates readable scoped names for debugging

## Key Variables Reference

### Colors (from `themes/taiga/variables.scss`)
| Variable | Value | Usage |
|----------|-------|-------|
| `$primary` | #25A28C | Primary brand color |
| `$color-link-primary` | #008AA8 | Links, active states |
| `$color-black900` | #2E3440 | Headings, dark text |
| `$color-black600` | #4C566A | Body text |
| `$color-gray400` | #D8DEE9 | Borders |
| `$color-gray100` | #F9F9FB | Light backgrounds |
| `$color-link-red` | #E44057 | Error states |
| `$color-link-green` | #93C45D | Success states |

### Responsive Breakpoints (from `dependencies/responsive.scss`)
| Variable | Value |
|----------|-------|
| `$mobile` | 480px |
| `$tablet` | 769px |
| `$desktop` | 1024px |
| `$widescreen` | 1216px |
| `$fullhd` | 1408px |
| `$ultrawide` | 1960px |

### Typography Mixins
```scss
@include font-size(small);    // 0.875rem
@include font-size(medium);   // 1rem
@include font-size(large);    // 1.1rem
@include font-size(larger);   // 1.4rem
@include font-type(regular);  // Ubuntu-Regular
@include font-type(medium);   // Ubuntu-Medium
@include font-type(bold);     // Ubuntu-Medium, weight 500
```

## Visual Verification Process

1. Run both the AngularJS app and the React app side by side
2. Navigate to the same page/component in both
3. Compare at multiple viewport widths (mobile, tablet, desktop, widescreen)
4. Check: colors, spacing, fonts, hover states, transitions
5. Use browser DevTools to compare computed styles if differences are spotted
6. Screenshot both and overlay to verify pixel-level accuracy for critical components
