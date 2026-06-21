# SOP-001: Styling Convention

## Goal
Ensure visual consistency across all pages.

## Rules
- **Primary color**: Amber (amber-500/600) — buttons, badges, links
- **Backgrounds**: White (`bg-white`) or gray-50 for section alternation
- **Cards**: `rounded-2xl`, `shadow-sm` resting, `shadow-lg` on hover
- **Transitions**: `transition duration-300` on interactive elements, `duration-500` on image zooms
- **Typography**: Gray-900 headings, gray-500/600 body text
- **Buttons**: Rounded-full for CTAs, rounded-lg for inline actions
- **Icons**: Heroicons stroke style via inline SVGs (`w-5 h-5` standard)

## Responsive
- Mobile-first: base styles are mobile, `md:` breakpoint for desktop
- Grids: `grid-cols-2` mobile → `md:grid-cols-4` or `md:grid-cols-5` desktop
- Nav: hamburger on mobile (`md:hidden`), full nav on desktop
