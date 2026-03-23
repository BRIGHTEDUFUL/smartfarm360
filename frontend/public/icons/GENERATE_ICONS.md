# Smart Farming 360 - PWA Icon Generation Guide

## App Branding
- **Primary Color**: Deep Green (#0D5415, #1B7E28, #2E9B3F)
- **Accent Color**: Golden Yellow (#FBBF24, #F59E0B)
- **Icon Symbol**: Leaf (🌿) representing agriculture and growth
- **App Name**: Smart Farming 360

## Icon Design Specifications

### Base Design
```
Background: Linear gradient (135deg, #0D5415 0%, #1B7E28 50%, #2E9B3F 100%)
Icon: Leaf symbol in golden yellow (#FBBF24)
Border: Optional 2px rounded border in lighter green
Shadow: Subtle drop shadow for depth
```

### SVG Template
Use this as a base for generating icons:

```svg
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0D5415;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1B7E28;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2E9B3F;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FBBF24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="80" fill="url(#bgGradient)"/>
  
  <!-- Leaf Icon (centered, 60% of canvas) -->
  <g transform="translate(256, 256)" filter="url(#shadow)">
    <!-- Leaf shape -->
    <path d="M 0,-150 Q 80,-120 100,-50 Q 110,20 80,80 Q 50,120 0,140 Q -50,120 -80,80 Q -110,20 -100,-50 Q -80,-120 0,-150 Z" 
          fill="url(#iconGradient)" 
          stroke="#FFF" 
          stroke-width="4"/>
    <!-- Leaf vein -->
    <line x1="0" y1="-150" x2="0" y2="140" 
          stroke="#FFF" 
          stroke-width="6" 
          stroke-linecap="round"/>
    <!-- Side veins -->
    <path d="M 0,-80 Q 40,-60 60,-20" 
          stroke="#FFF" 
          stroke-width="4" 
          stroke-linecap="round" 
          fill="none"/>
    <path d="M 0,-80 Q -40,-60 -60,-20" 
          stroke="#FFF" 
          stroke-width="4" 
          stroke-linecap="round" 
          fill="none"/>
    <path d="M 0,0 Q 40,20 60,60" 
          stroke="#FFF" 
          stroke-width="4" 
          stroke-linecap="round" 
          fill="none"/>
    <path d="M 0,0 Q -40,20 -60,60" 
          stroke="#FFF" 
          stroke-width="4" 
          stroke-linecap="round" 
          fill="none"/>
  </g>
</svg>
```

## Icon Sizes Required

### Standard Icons
1. **72x72** - Small tile
2. **96x96** - Small tile
3. **128x128** - Medium tile
4. **144x144** - Medium tile
5. **152x152** - iOS home screen
6. **192x192** - Android home screen (minimum)
7. **384x384** - Large tile
8. **512x512** - Splash screen (maximum)

### Maskable Icons
1. **192x192-maskable** - Android adaptive icon
2. **512x512-maskable** - Android adaptive icon (large)

**Maskable Icon Requirements**:
- Safe zone: 80% of canvas (center 410x410 for 512x512)
- Icon should be centered and not touch edges
- Background must extend to full canvas

### Shortcut Icons
1. **shop-96x96.png** - Shopping bag icon
2. **orders-96x96.png** - Box/package icon
3. **cart-96x96.png** - Shopping cart icon

## Generation Methods

### Method 1: Online Tools (Recommended)

#### PWA Builder Image Generator
1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload the 512x512 base icon
3. Select all required sizes
4. Download the generated package
5. Extract to `frontend/public/icons/`

#### Real Favicon Generator
1. Go to: https://realfavicongenerator.net/
2. Upload the 512x512 base icon
3. Configure PWA settings
4. Download and extract

### Method 2: Using Figma/Sketch

1. Create 512x512 artboard
2. Apply gradient background
3. Add leaf icon (centered, 60% size)
4. Export at all required sizes
5. Use "Export for Web" for optimized PNGs

### Method 3: Using ImageMagick (Command Line)

```bash
# Install ImageMagick first
# Then run these commands:

# Generate standard icons
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 384x384 icon-384x384.png

# Generate maskable icons (with padding)
convert icon-512x512.png -resize 410x410 -gravity center -extent 512x512 -background "#0D5415" icon-512x512-maskable.png
convert icon-192x192.png -resize 154x154 -gravity center -extent 192x192 -background "#0D5415" icon-192x192-maskable.png
```

### Method 4: Using Node.js Script

Create `generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const baseSvg = fs.readFileSync('./icon-base.svg');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(baseSvg)
      .resize(size, size)
      .png()
      .toFile(`./icon-${size}x${size}.png`);
    console.log(`Generated icon-${size}x${size}.png`);
  }
  
  // Generate maskable icons with safe zone
  await sharp(baseSvg)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 13, g: 84, b: 21, alpha: 1 }
    })
    .png()
    .toFile('./icon-512x512-maskable.png');
  
  await sharp(baseSvg)
    .resize(154, 154)
    .extend({
      top: 19,
      bottom: 19,
      left: 19,
      right: 19,
      background: { r: 13, g: 84, b: 21, alpha: 1 }
    })
    .png()
    .toFile('./icon-192x192-maskable.png');
  
  console.log('All icons generated successfully!');
}

generateIcons();
```

Run with: `npm install sharp && node generate-icons.js`

## Shortcut Icon Designs

### Shop Icon (Shopping Bag)
```svg
<svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="16" fill="url(#bgGradient)"/>
  <path d="M 30,35 L 30,70 Q 30,75 35,75 L 61,75 Q 66,75 66,70 L 66,35" 
        stroke="#FBBF24" stroke-width="4" fill="none"/>
  <path d="M 38,35 Q 38,25 48,25 Q 58,25 58,35" 
        stroke="#FBBF24" stroke-width="4" fill="none"/>
</svg>
```

### Orders Icon (Package Box)
```svg
<svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="16" fill="url(#bgGradient)"/>
  <rect x="28" y="35" width="40" height="35" 
        stroke="#FBBF24" stroke-width="4" fill="none"/>
  <line x1="28" y1="45" x2="68" y2="45" 
        stroke="#FBBF24" stroke-width="4"/>
  <line x1="48" y1="35" x2="48" y2="70" 
        stroke="#FBBF24" stroke-width="4"/>
</svg>
```

### Cart Icon (Shopping Cart)
```svg
<svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="16" fill="url(#bgGradient)"/>
  <path d="M 25,30 L 30,30 L 35,55 L 65,55" 
        stroke="#FBBF24" stroke-width="4" fill="none"/>
  <circle cx="40" cy="65" r="4" fill="#FBBF24"/>
  <circle cx="60" cy="65" r="4" fill="#FBBF24"/>
  <rect x="35" y="35" width="30" height="20" 
        stroke="#FBBF24" stroke-width="3" fill="none"/>
</svg>
```

## Testing Icons

### Browser Testing
1. Chrome DevTools > Application > Manifest
2. Check all icon sizes load correctly
3. Verify maskable icons have proper safe zones

### Device Testing
1. **Android**: Add to home screen, check icon appearance
2. **iOS**: Add to home screen, check icon appearance
3. **Desktop**: Install PWA, check taskbar/dock icon

### Lighthouse Audit
Run Lighthouse PWA audit to verify:
- ✅ Manifest includes 192px and 512px icons
- ✅ Maskable icons provided
- ✅ Icons are square
- ✅ Icons load successfully

## Quick Start

1. Save the SVG template above as `icon-base.svg`
2. Use one of the generation methods
3. Place all generated icons in `frontend/public/icons/`
4. Verify manifest.json references are correct
5. Test on multiple devices

## Color Palette Reference

```css
/* Primary Gradient */
background: linear-gradient(135deg, #0D5415 0%, #1B7E28 50%, #2E9B3F 100%);

/* Icon Gradient */
background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);

/* Individual Colors */
--deep-green: #0D5415;
--forest-green: #1B7E28;
--bright-green: #2E9B3F;
--golden-yellow: #FBBF24;
--amber: #F59E0B;
```

## Troubleshooting

### Icons not showing
- Clear browser cache
- Check file paths in manifest.json
- Verify file permissions
- Check console for 404 errors

### Icons look pixelated
- Ensure PNG files are high quality
- Use lossless compression
- Generate from SVG for best quality

### Maskable icons cut off
- Increase safe zone padding
- Center icon properly
- Test with Android's mask preview tool

---

**Last Updated**: 2026-03-23
**Version**: 1.0
**Status**: Ready for implementation
