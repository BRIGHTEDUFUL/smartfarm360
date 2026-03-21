# UI Reference - shop.html Integration

The `shop.html` file serves as the primary UI reference for the entire Smart Farming 360 application. All React components must follow this design language.

## Key Design Elements from shop.html

### 1. Navigation Bar
- Sticky header with white background
- Logo with gradient icon
- Search bar (max-width: 420px)
- Cart button with badge
- Auth buttons or user chip

### 2. Hero Section
- Gradient background (#0a3d0a → #2E7D32)
- Animated floating orbs
- Typewriter effect for dynamic text
- Trust badges with icons
- Stats row (4 metrics)
- Featured deal strip
- Scrolling category pills

### 3. Product Cards
- Clean white cards with shadows
- Image with hover effects (scale + shimmer)
- Category badges (color-coded)
- Wishlist heart button
- Quick view button (appears on hover)
- Farmer info with location
- Star ratings
- Price with unit
- Stock indicator
- Add to cart button (gradient)

### 4. Sidebar Filters
- Sticky positioning
- Category list with icons
- Price range inputs
- Region checkboxes
- Apply/Clear buttons

### 5. Cart Drawer
- Slide from right
- Backdrop blur overlay
- Item list with quantity controls
- Summary with delivery fee
- Checkout button

### 6. Modals
- Product detail modal (2-column grid)
- Checkout modal with forms
- Success state
- Close button top-right

### 7. Animations
- Floating cards (6s ease-in-out)
- Shimmer on hover (0.8s)
- Typewriter blink (0.7s)
- Toast slide-in (0.3s)
- Modal scale-in (0.3s)

## Implementation Guidelines

### For React Components:

1. **Extract CSS to modules**: Convert inline styles to CSS modules
2. **Use CSS variables**: Maintain the color palette
3. **Preserve animations**: Keep all animation keyframes
4. **Maintain structure**: Follow the same HTML structure
5. **Add TypeScript**: Type all props and state
6. **Responsive**: Keep all media queries
7. **Accessibility**: Add ARIA labels where missing

### Component Mapping:

```
shop.html → React Components
├── topnav → <Navbar />
├── shop-hero → <Hero />
│   ├── hero-text → <HeroText />
│   ├── hero-cards-wrap → <FloatingCards />
│   ├── hero-deal-strip → <DealBanner />
│   └── hero-cats-strip → <CategoryScroll />
├── sidebar → <Sidebar />
│   ├── cat-list → <CategoryFilter />
│   ├── price-range → <PriceFilter />
│   └── region-list → <RegionFilter />
├── products-grid → <ProductGrid />
│   └── product-card → <ProductCard />
├── cart-drawer → <CartDrawer />
│   └── cart-item → <CartItem />
├── product-modal → <ProductModal />
└── checkout-modal → <CheckoutModal />
```

### CSS Organization:

```
frontend/src/styles/
├── variables.css (color palette, shadows, etc.)
├── animations.css (all keyframes)
├── components/
│   ├── navbar.module.css
│   ├── hero.module.css
│   ├── product-card.module.css
│   ├── sidebar.module.css
│   ├── cart.module.css
│   └── modal.module.css
└── global.css (resets, utilities)
```

## Critical Design Patterns

### 1. Image Fallback
Always implement the `imgFallback()` function for broken images:
```javascript
function imgFallback(img) {
  // Generate SVG placeholder with initials
  // Color based on product name hash
}
```

### 2. Toast Notifications
Use consistent toast system:
```javascript
toast(message, type) // types: success, error, info, cart
```

### 3. Loading States
- Skeleton loaders for initial load
- Spinner for actions
- Disabled states for buttons

### 4. Hover Effects
- Product cards: translateY(-8px) + shadow
- Images: scale(1.08) + brightness
- Buttons: translateY(-2px) + shadow

### 5. Modal Patterns
- Backdrop click to close
- ESC key to close
- Scroll lock on body
- Focus trap

## Color Usage Guide

### When to use Primary Green (#2E7D32):
- Primary buttons
- Active states
- Links
- Icons (category, location)
- Success messages

### When to use Secondary Orange (#FF9800):
- Accent elements
- Badges (bestseller, deals)
- Call-to-action highlights
- Warning states

### When to use Gradients:
- Hero background
- Primary buttons
- Logo icon
- Floating orbs

## Typography Scale

```css
--fs-hero: 48px;      /* Hero titles */
--fs-h1: 36px;        /* Section titles */
--fs-h2: 26px;        /* Modal titles */
--fs-h3: 20px;        /* Card titles */
--fs-body: 14px;      /* Body text */
--fs-small: 12px;     /* Meta info */
--fs-tiny: 11px;      /* Labels, badges */
```

## Spacing System

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

## Shadow Hierarchy

```css
--shadow-sm: 0 2px 8px rgba(0,0,0,.06);    /* Cards at rest */
--shadow: 0 4px 20px rgba(0,0,0,.10);       /* Elevated cards */
--shadow-lg: 0 12px 40px rgba(0,0,0,.15);   /* Modals, drawers */
--shadow-xl: 0 32px 64px rgba(0,0,0,.18);   /* Overlays */
```

## Testing Checklist

When implementing components, verify:
- [ ] Matches shop.html visual design
- [ ] Hover states work correctly
- [ ] Animations are smooth (60fps)
- [ ] Responsive on all breakpoints
- [ ] Images have fallback
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Toast notifications appear
- [ ] Modals close properly
- [ ] Forms validate correctly

## Reference Files

- **Design System**: `frontend/DESIGN_SYSTEM.md`
- **Original HTML**: `shop.html`
- **Color Palette**: See DESIGN_SYSTEM.md
- **Component Structure**: See component mapping above
