# Smart Farming 360 - Design System

This document defines the design system extracted from shop.html to ensure consistency across all components.

## Color Palette

### Primary Colors
- **Primary Green**: `#2E7D32`
- **Primary Dark**: `#1B5E20`
- **Primary Light**: `#E8F5E9`

### Secondary Colors
- **Secondary Orange**: `#FF9800`
- **Secondary Dark**: `#E65100`

### Neutral Colors
- **Dark**: `#111827`
- **Gray**: `#6B7280`
- **Light Gray**: `#F9FAFB`
- **White**: `#FFFFFF`
- **Border**: `#E0E0E0`

### Shadows
- **Shadow SM**: `0 2px 8px rgba(0,0,0,.06)`
- **Shadow**: `0 4px 20px rgba(0,0,0,.10)`
- **Shadow LG**: `0 12px 40px rgba(0,0,0,.15)`
- **Shadow XL**: `0 32px 64px rgba(0,0,0,.18)`

### Border Radius
- **Radius**: `10px`
- **Radius LG**: `16px`

### Transitions
- **Transition**: `all .25s ease`

## Typography

### Font Family
- **Primary Font**: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800
- Black: 900

### Font Sizes
- **Hero Title**: `48px` (mobile: `26px`)
- **Section Title**: `36px` (mobile: `28px`)
- **Card Title**: `16px`
- **Body**: `14px`
- **Small**: `12px`
- **Tiny**: `11px`

## Components

### Navigation Bar
- **Height**: `64px`
- **Background**: White with bottom border
- **Logo**: Gradient circle icon + text
- **Search**: Rounded input with icon (max-width: 420px)
- **Cart Button**: Circular with badge
- **Sticky**: Yes (top: 0, z-index: 900)

### Hero Banner
- **Background**: Gradient from dark green to primary green
- **Animated Orbs**: 3 floating orbs with blur effect
- **Height**: Min 520px
- **Layout**: Grid (text + floating cards)
- **Typewriter Effect**: Animated text with blinking cursor
- **Trust Badges**: Pills with icons
- **Stats Row**: 4 stat cards with numbers
- **Deal Strip**: Orange background with CTA
- **Category Pills**: Scrolling horizontal strip

### Product Cards
- **Border Radius**: `16px`
- **Shadow**: Subtle on default, elevated on hover
- **Hover Effect**: 
  - Translate up 8px
  - Image scale 1.08
  - Shimmer overlay animation
- **Badge**: Top-left corner with category-specific colors
- **Wishlist**: Top-right heart icon
- **Quick View**: Bottom center button (appears on hover)
- **Image Height**: 230px (grid), 200px (list)
- **Padding**: 18px body

### Buttons

#### Primary Button
- **Background**: Linear gradient `#43A047` to `#1B5E20`
- **Color**: White
- **Padding**: `14px 32px`
- **Border Radius**: `10px`
- **Font Weight**: 700
- **Hover**: Translate up 2px + shadow increase

#### Secondary Button
- **Background**: Transparent
- **Border**: `1.5px solid primary`
- **Color**: Primary
- **Hover**: Fill with primary color

#### Icon Button
- **Size**: `36px` circle
- **Background**: Light gray
- **Hover**: Border color change

### Sidebar
- **Width**: `260px`
- **Sticky**: Yes (top: 80px)
- **Cards**: White background with border
- **Category Items**: 
  - Icon + text + count
  - Hover: Light green background
  - Active: Primary green background

### Cart Drawer
- **Width**: `460px`
- **Position**: Fixed right
- **Animation**: Slide from right
- **Backdrop**: Blur overlay
- **Header**: Title + close button
- **Items**: Image + info + quantity controls
- **Footer**: Summary + checkout button

### Modals
- **Max Width**: `860px` (product), `520px` (checkout)
- **Border Radius**: `16px`
- **Backdrop**: Dark with blur
- **Animation**: Scale in from 0.95
- **Close Button**: Top-right circle

### Forms
- **Input Height**: `40px`
- **Border**: `1.5px solid border color`
- **Border Radius**: `8px`
- **Focus**: Primary border + shadow ring
- **Label**: Bold, 13px, uppercase

### Badges
- **Bestseller**: Orange `#FF6F00`
- **Organic**: Green `#2E7D32`
- **Premium**: Purple `#6A1B9A`
- **Fresh**: Blue `#0277BD`
- **Seasonal**: Pink `#AD1457`
- **High Protein**: Orange `#E65100`

### Toast Notifications
- **Position**: Bottom-right
- **Width**: Min 260px
- **Border Radius**: `10px`
- **Animation**: Slide from right
- **Duration**: 3.5 seconds
- **Types**: Success (green), Error (red), Info (blue), Cart (orange)

## Layout

### Container
- **Max Width**: `1400px`
- **Padding**: `0 24px`
- **Margin**: `0 auto`

### Shop Layout
- **Grid**: `260px 1fr` (sidebar + main)
- **Gap**: `28px`
- **Padding**: `32px 24px`

### Product Grid
- **Columns**: `repeat(auto-fill, minmax(270px, 1fr))`
- **Gap**: `24px`
- **List View**: Single column

## Animations

### Floating Cards
```css
@keyframes floatCard {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-16px) rotate(-2deg); }
}
```

### Shimmer Effect
```css
@keyframes cardShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Typewriter Blink
```css
@keyframes blink {
  0%, 100% { border-color: var(--secondary); }
  50% { border-color: transparent; }
}
```

### Orb Float
```css
@keyframes orbFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.08); }
}
```

## Responsive Breakpoints

- **Desktop**: > 1100px
- **Tablet**: 900px - 1100px
- **Mobile**: 600px - 900px
- **Small Mobile**: < 600px

### Mobile Adjustments
- Hide navigation links
- Single column layout
- Smaller hero text
- Hide floating cards
- Simplified forms
- Full-width modals

## Icons

### Library
- Font Awesome 6.5.0

### Common Icons
- **Cart**: `fa-basket-shopping`
- **Search**: `fa-magnifying-glass`
- **User**: `fa-user-circle`
- **Heart**: `fa-heart` (regular/solid)
- **Star**: `fa-star`
- **Location**: `fa-map-marker-alt`
- **Check**: `fa-check-circle`
- **Close**: `fa-times`
- **Plus/Minus**: `fa-plus` / `fa-minus`

## Image Handling

### Fallback Strategy
- Generate SVG placeholder with initials
- Color based on product name hash
- Display product name
- Dimensions: 600x400

### Loading
- Lazy loading: `loading="lazy"`
- Error handler: `onerror="imgFallback(this)"`
- Skeleton loaders during initial load

## Accessibility

- Focus states on all interactive elements
- ARIA labels on icon buttons
- Keyboard navigation support
- Color contrast ratios meet WCAG AA
- Alt text on all images

## Performance

- CSS animations use `transform` and `opacity`
- Will-change on hover transforms
- Backdrop-filter for glass effects
- Debounced search input (300ms)
- Lazy image loading
- Skeleton loaders for perceived performance

## State Management

### Local Storage Keys
- `sf360_token`: JWT authentication token
- `sf360_cart`: Cart items array
- `sf360_wishlist`: Wishlist product IDs array

### Cart Item Structure
```javascript
{
  id: number,
  name: string,
  price: number,
  unit: string,
  image: string,
  farmer: string,
  qty: number,
  stock: number
}
```

### Product Structure
```javascript
{
  id: number,
  name: string,
  category: string,
  price: number,
  unit: string,
  stock: number,
  image: string,
  image2: string,
  desc: string,
  farmer: string,
  region: string,
  rating: number,
  reviews: number,
  badge: string
}
```

## Implementation Notes

1. Use CSS custom properties (variables) for theming
2. Implement mobile-first responsive design
3. Use semantic HTML5 elements
4. Optimize images (WebP format preferred)
5. Implement proper error boundaries
6. Add loading states for all async operations
7. Use debouncing for search and filters
8. Implement proper form validation
9. Add toast notifications for user feedback
10. Ensure all animations are smooth (60fps)
