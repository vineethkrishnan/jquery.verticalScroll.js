# Themes

jQuery Vertical Scroll includes four built-in themes that control the appearance of the pagination dots, tooltips, and active-state animations. You can also create fully custom themes using CSS variables.

---

## Built-in Themes

### Default

The default theme uses dark dots with a white active state. Works well on light or colorful backgrounds.

```javascript
$('#page').verticalScroll({ theme: 'default' });
```

- Dot color: `#333333` (dark gray)
- Active color: `#ffffff` (white)
- Border color: `#333333`
- Tooltip: dark background, white text
- Pulse animation on active dot

### Light

The light theme uses light-colored dots designed for dark backgrounds. The active dot is dark for contrast.

```javascript
$('#page').verticalScroll({ theme: 'light' });
```

- Dot color: `#e0e0e0` (light gray)
- Active color: `#333333` (dark gray)
- Border color: `#999999`
- Tooltip: light background, dark text
- Pulse animation on active dot

### Dark

The dark theme features a cyan accent color, ideal for dark or moody designs.

```javascript
$('#page').verticalScroll({ theme: 'dark' });
```

- Dot color: `#555555` (medium gray)
- Active color: `#00bcd4` (cyan)
- Border color: `#777777`
- Tooltip: very dark background, white text
- Cyan pulse animation on active dot

### Minimal

The minimal theme uses small, border-only dots with no fill color. Clean and unobtrusive.

```javascript
$('#page').verticalScroll({ theme: 'minimal' });
```

- Dot color: transparent
- Active color: transparent (filled `#333333`)
- Border: `1px` solid, `8px` dot size
- Tooltip: dark background, white text
- No pulse animation

---

## How Themes Work

Themes are applied as a CSS class on the container element. When you set `theme: 'dark'`, the plugin adds the class `vs-theme-dark` to the container:

```html
<div id="page" class="vs-container vs-theme-dark vs-initialized">
  ...
</div>
```

Each theme class overrides the CSS custom properties (variables) that control dot colors, sizes, and animations. This means you can create your own themes by defining a new class with your preferred variable values.

---

## Creating a Custom Theme

### Step 1: Choose a theme class name

Pick a name for your theme. By convention, use the prefix `vs-theme-`:

```css
.vs-theme-ocean { }
```

### Step 2: Define CSS variables

Override the CSS custom properties inside your theme class:

```css
.vs-theme-ocean {
  --vs-dot-color: rgba(255, 255, 255, 0.3);
  --vs-dot-active-color: #00e5ff;
  --vs-dot-border-color: rgba(255, 255, 255, 0.5);
  --vs-dot-hover-color: rgba(255, 255, 255, 0.6);
  --vs-tooltip-bg: #006064;
  --vs-tooltip-color: #ffffff;
  --vs-dot-size: 10px;
  --vs-dot-spacing: 14px;
  --vs-dot-border-width: 2px;
  --vs-transition-duration: 0.4s;
}
```

### Step 3: Apply with JavaScript

Since the plugin applies `vs-theme-{name}` as a class, you can either:

**Option A:** Use a built-in theme name and override its variables:

```javascript
$('#page').verticalScroll({ theme: 'default' });
```

```css
.vs-theme-default {
  --vs-dot-color: rgba(255, 255, 255, 0.3);
  --vs-dot-active-color: #00e5ff;
  /* ... */
}
```

**Option B:** Use a custom theme name and add the class manually:

```javascript
// Initialize with any theme (the class will be vs-theme-ocean)
$('#page').verticalScroll({ theme: 'ocean' });
```

The plugin will add `vs-theme-ocean` to the container, and your CSS will take effect.

### Step 4: Customize the pulse animation (optional)

If you want a custom pulse color for the active dot:

```css
.vs-theme-ocean .vs-pagination-button.vs-pagination-active .vs-pagination-dot {
  animation-name: vs-pulse-ocean;
}

@keyframes vs-pulse-ocean {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(0, 229, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 229, 255, 0);
  }
}
```

---

## Complete Custom Theme Example

```html
<style>
  .vs-theme-sunset {
    --vs-dot-color: rgba(255, 255, 255, 0.4);
    --vs-dot-active-color: #ff6b35;
    --vs-dot-border-color: rgba(255, 255, 255, 0.6);
    --vs-dot-hover-color: rgba(255, 255, 255, 0.7);
    --vs-tooltip-bg: #ff6b35;
    --vs-tooltip-color: #ffffff;
    --vs-dot-size: 14px;
    --vs-dot-spacing: 16px;
    --vs-dot-border-width: 2px;
    --vs-transition-duration: 0.4s;
  }

  .vs-theme-sunset .vs-pagination-button.vs-pagination-active .vs-pagination-dot {
    animation-name: vs-pulse-sunset;
  }

  .vs-theme-sunset .vs-pagination-tooltip::before {
    border-left-color: #ff6b35;
  }

  @keyframes vs-pulse-sunset {
    0%   { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(255, 107, 53, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
  }
</style>

<script>
  $('#page').verticalScroll({
    theme: 'sunset'
  });
</script>
```

---

## Switching Themes at Runtime

You can change the theme dynamically by updating the container class:

```javascript
function switchTheme(newTheme) {
  var $page = $('#page');

  // Remove old theme class
  $page.removeClass(function(index, className) {
    return (className.match(/vs-theme-\S+/) || []).join(' ');
  });

  // Add new theme class
  $page.addClass('vs-theme-' + newTheme);
}

// Usage
switchTheme('dark');
switchTheme('sunset');
```

---

## CSS Variables Reference

For a full list of all CSS custom properties, see the [CSS Variables](configuration/css-variables.md) page.
