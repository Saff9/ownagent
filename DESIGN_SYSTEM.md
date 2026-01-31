# 🎨 LocalAI 2.0 - Visual Design Guide

## 🎯 Interface Overview

```
╔════════════════════════════════════════════════════════════════╗
║  LocalAI Chat Interface - Premium Dark Theme                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  SIDEBAR (300px)          │  MAIN CONTENT AREA              ║
║  ─────────────────────    │  ─────────────────────────────  ║
║  LocalAI      [+ New]     │  My Chat    🟦 qwen:3b [▼]     ║
║                           │                                  ║
║  Conversations:           │  ┌──────────────────────────────┐ ║
║  • Recent Chat 1          │  │                              │ ║
║  • Another Conv           │  │  You: Hello!                │ ║
║  • Latest Chat            │  │                              │ ║
║                           │  │  Assistant: Hi there!       │ ║
║  [📤] [🗑️] [⚙️]          │  │                              │ ║
║                           │  └──────────────────────────────┘ ║
║                           │                                  ║
║                           │  [Type message...    ] [Send]   ║
║                           │                                  ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 🎨 Color System

### Primary Colors
```
🟦 Primary Blue: #6366f1
   Used for: Main buttons, badges, accents
   Hex: #6366f1  RGB: 99, 102, 241
   
🟦 Light Blue: #818cf8
   Used for: Hover states, highlights
   
🟦 Dark Blue: #4f46e5
   Used for: Active states, pressed
```

### Accent Colors
```
🟦 Cyan: #06b6d4
   Used for: Secondary accents, highlights
   
🟦 Light Cyan: #22d3ee
   Used for: Accent highlights
```

### Background Colors
```
🟫 Main BG: #0f172a (Deep Navy)
   Used for: Main page background
   
🟫 Secondary: #1e293b (Darker Gray)
   Used for: Sidebar, cards
   
🟫 Tertiary: #334155 (Gray)
   Used for: Buttons, hover states
   
🟫 Hover: #475569 (Light Gray)
   Used for: Hover effects
```

### Text Colors
```
⚪ Primary: #f1f5f9 (Bright White)
   Used for: Main text
   
⚪ Secondary: #cbd5e1 (Light Gray)
   Used for: Secondary text
   
⚪ Muted: #94a3b8 (Gray)
   Used for: Disabled, muted text
```

---

## 📐 Spacing & Sizing

### Spacing Scale
```
4px   - Extra small gaps
8px   - Small gaps
12px  - Medium gaps
16px  - Standard padding
20px  - Large padding
25px  - Extra large padding
30px  - Section padding
```

### Border Radius
```
8px   - Small elements (buttons)
10px  - Medium elements (input, cards)
12px  - Large elements (containers)
14px  - Message bubbles
16px  - Modals, large components
20px  - Extra large (badges)
```

### Font Sizes
```
12px  - Small text, labels
13px  - Input text, controls
14px  - Body text
16px  - Sidebar title, input
18px  - Modal headers
22px  - Chat title
```

---

## 🎭 Component Styles

### Buttons

**Primary Button** (Send, Save)
```
Background: Linear gradient (#6366f1 → #818cf8)
Color: White
Padding: 12px 20px
Border-radius: 10px
Shadow: 0 4px 12px rgba(99, 102, 241, 0.3)
Hover: transform: translateY(-2px), stronger shadow
```

**Secondary Button** (Export, Settings)
```
Background: #334155
Color: #f1f5f9
Border: 1px solid #334155
Padding: 8px 14px
Border-radius: 8px
Hover: Background #6366f1, Color white
```

### Messages

**User Message**
```
Background: Linear gradient (#2d3748 → #1d4ed8)
Color: White
Padding: 14px 16px
Border-radius: 14px
Alignment: Right
Shadow: 0 2px 8px rgba(99, 102, 241, 0.3)
```

**Assistant Message**
```
Background: #1e293b
Color: #f1f5f9
Border: 1px solid #334155
Padding: 14px 16px
Border-radius: 14px
Alignment: Left
```

### Input Field
```
Background: #1e293b
Color: #f1f5f9
Border: 1px solid #334155
Padding: 12px 16px
Border-radius: 10px
Focus: Border #6366f1, shadow 0 0 0 3px rgba(99, 102, 241, 0.1)
```

---

## 🎬 Animations

### Standard Transition
```css
Duration: 0.35s
Timing: cubic-bezier(0.4, 0, 0.2, 1)
Uses: Hover states, state changes
```

### Message Animation
```css
Slide in from bottom + fade
Duration: 0.3s
Effect: translateY(10px) → translateY(0)
Opacity: 0 → 1
```

### Loading Dots
```css
Duration: 1.4s infinite
Effect: Scale (1 → 1.2) + opacity change
Staggered: 0s, 0.2s, 0.4s
```

### Button Hover
```css
Duration: 0.35s
Effect: translateY(-2px) + stronger shadow
```

---

## 📱 Responsive Breakpoints

### Desktop (1200px+)
```
Sidebar: 300px
Message width: 65%
Full layout visible
```

### Tablet (768px - 1023px)
```
Sidebar: 260px
Message width: 75%
Adjusted padding
```

### Mobile (480px - 767px)
```
Sidebar: Horizontal scroll
Message width: 85%
Smaller padding
```

### Small Mobile (< 480px)
```
Single column
Full width
Minimal padding
Touch-optimized (44px+ targets)
```

---

## 🎨 Message Styling

### User Message Bubble
```
┌────────────────────────────┐
│  Your message goes here    │  ← Light blue gradient
└────────────────────────────┘
       ↗ (right aligned)
```

### Assistant Message Bubble
```
     ↙ (left aligned)
┌────────────────────────────┐
│  AI's response here        │  ← Dark with border
└────────────────────────────┘
```

### Code in Messages
```
Inline: `code` with cyan color
Block: Dark background with syntax highlight
Font: JetBrains Mono (monospace)
```

---

## 🎯 Shadow System

### Small Shadow (sm)
```
0 2px 8px rgba(0, 0, 0, 0.3)
Uses: Small elements, cards
```

### Standard Shadow
```
0 8px 24px rgba(0, 0, 0, 0.35)
Uses: Buttons, modals, containers
```

### Large Shadow (lg)
```
0 20px 60px rgba(0, 0, 0, 0.6)
Uses: Modals, dropdowns, large overlays
```

---

## 🔤 Typography

### Font Family
```
UI Text: Inter
  - 300 (Light)
  - 400 (Regular)
  - 500 (Medium)
  - 600 (Semi-bold)
  - 700 (Bold)
  - 800 (Extra-bold)

Code: JetBrains Mono
  - 400 (Regular)
  - 500 (Medium)
```

### Font Weight Usage
```
300 - Light text, timestamps
400 - Body text, messages
500 - Labels, conversation titles
600 - Button text, section headers
700 - Chat title, modal headers
800 - Page title (if any)
```

### Line Height
```
1.4 - Compact
1.6 - Messages (comfortable reading)
1.8 - Body text
```

---

## 🎯 Interactive States

### Button States
```
Default:    Background color + shadow
Hover:      Darker/gradient + translate up
Active:     No transform, stronger shadow
Disabled:   Opacity 0.5, no cursor
Focus:      Ring outline (for keyboard nav)
```

### Input States
```
Default:    Border color, light background
Hover:      Slightly darker border
Focus:      Primary color border + glow
Disabled:   Opacity 0.5, no events
Error:      Red border, error text
```

### Conversation Item States
```
Default:    Gray background, left border transparent
Hover:      Lighter background, border accent
Active:     Primary color background, white text
```

---

## 📊 Component Sizing

### Sidebar
```
Desktop:  300px wide × 100vh tall
Tablet:   260px wide × 100vh tall
Mobile:   100vw wide × 60px tall
```

### Chat Container
```
Message max-width: 65% desktop, 75% tablet, 85% mobile
Min message height: auto (no fixed height)
Max message height: 100px (scrollable for very long)
```

### Input Area
```
Height: auto (grows with text)
Max height: 100px
Padding: 20px bottom/top, 25px left/right
```

### Modal
```
Width: 90% (max 500px)
Centered on screen
Backdrop: Semi-transparent dark
```

---

## ✅ Design Principles Used

1. **Consistency** - Same colors, spacing, shadows throughout
2. **Hierarchy** - Clear visual hierarchy with size/weight
3. **Contrast** - High contrast text (WCAG AA)
4. **Spacing** - Consistent 4px grid system
5. **Animation** - Smooth, purposeful transitions
6. **Responsiveness** - Works on all screen sizes
7. **Accessibility** - Keyboard navigation, focus states
8. **Minimalism** - Clean, uncluttered interface

---

## 🎓 How to Customize

To change colors, edit the `:root` variables in `app.html`:

```css
:root {
    --primary: #6366f1;        /* Change this */
    --accent: #06b6d4;         /* Or this */
    --background: #0f172a;     /* Or this */
    /* etc... */
}
```

All elements use these variables, so changing them updates the whole app!

---

**Design System Version:** 2.0  
**Created:** January 17, 2026  
**Status:** ✅ Complete & Implemented
