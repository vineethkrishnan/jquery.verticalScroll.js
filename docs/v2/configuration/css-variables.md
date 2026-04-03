# CSS Variables

jQuery Vertical Scroll uses CSS custom properties (variables) for all visual styling. This makes it easy to customize colors, sizes, and animations without touching the source CSS.

---

## Variable Reference

All variables are defined on `:root` and can be overridden at any level of the cascade.

### Color Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--vs-dot-color` | `#333333` | Background color of inactive pagination dots. |
| `--vs-dot-active-color` | `#ffffff` | Background color of the active pagination dot. |
| `--vs-dot-border-color` | `#333333` | Border color of all pagination dots. |
| `--vs-dot-hover-color` | `#666666` | Background color of a dot on hover. |
| `--vs-tooltip-bg` | `#333333` | Background color of the pagination tooltip. |
| `--vs-tooltip-color` | `#ffffff` | Text color of the pagination tooltip. |

### Size Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--vs-dot-size` | `12px` | Width and height of each pagination dot. |
| `--vs-dot-spacing` | `12px` | Vertical gap between pagination dots. |
| `--vs-dot-border-width` | `2px` | Border width of each pagination dot. |

### Animation Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--vs-transition-duration` | `0.3s` | Duration of CSS transitions for dots, tooltips, and hover states. |
| `--vs-transition-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Easing curve for CSS transitions. |

---

## Global Customization

Override variables on `:root` to change the appearance globally for all instances:

```css
:root {
  --vs-dot-color: #ff6b6b;
  --vs-dot-active-color: #ffffff;
  --vs-dot-border-color: #ff6b6b;
  --vs-dot-hover-color: #ee5a5a;
  --vs-tooltip-bg: #ff6b6b;
  --vs-tooltip-color: #ffffff;
  --vs-dot-size: 14px;
  --vs-dot-spacing: 16px;
  --vs-dot-border-width: 2px;
  --vs-transition-duration: 0.4s;
}
```

---

## Per-Instance Customization

Override variables on a specific container to style one instance differently:

```css
#hero-page {
  --vs-dot-color: rgba(255, 255, 255, 0.3);
  --vs-dot-active-color: #ffd700;
  --vs-dot-border-color: rgba(255, 255, 255, 0.5);
  --vs-dot-size: 10px;
}

#portfolio-page {
  --vs-dot-color: #ccc;
  --vs-dot-active-color: #e91e63;
  --vs-dot-border-color: #e91e63;
  --vs-dot-size: 8px;
  --vs-dot-border-width: 1px;
}
```

---

## Per-Theme Variable Values

Each built-in theme sets its own variable values. Here is a complete reference:

### Default Theme (`vs-theme-default`)

| Variable | Value |
|----------|-------|
| `--vs-dot-color` | `#333333` |
| `--vs-dot-active-color` | `#ffffff` |
| `--vs-dot-border-color` | `#333333` |
| `--vs-dot-hover-color` | `#666666` |
| `--vs-tooltip-bg` | `#333333` |
| `--vs-tooltip-color` | `#ffffff` |

### Light Theme (`vs-theme-light`)

| Variable | Value |
|----------|-------|
| `--vs-dot-color` | `#e0e0e0` |
| `--vs-dot-active-color` | `#333333` |
| `--vs-dot-border-color` | `#999999` |
| `--vs-dot-hover-color` | `#cccccc` |
| `--vs-tooltip-bg` | `#f5f5f5` |
| `--vs-tooltip-color` | `#333333` |

### Dark Theme (`vs-theme-dark`)

| Variable | Value |
|----------|-------|
| `--vs-dot-color` | `#555555` |
| `--vs-dot-active-color` | `#00bcd4` |
| `--vs-dot-border-color` | `#777777` |
| `--vs-dot-hover-color` | `#888888` |
| `--vs-tooltip-bg` | `#1a1a1a` |
| `--vs-tooltip-color` | `#ffffff` |

### Minimal Theme (`vs-theme-minimal`)

| Variable | Value |
|----------|-------|
| `--vs-dot-color` | `transparent` |
| `--vs-dot-active-color` | `transparent` (filled `#333333`) |
| `--vs-dot-border-color` | `#333333` |
| `--vs-dot-hover-color` | `rgba(51, 51, 51, 0.3)` |
| `--vs-dot-size` | `8px` |
| `--vs-dot-border-width` | `1px` |
| `--vs-tooltip-bg` | `#333333` |
| `--vs-tooltip-color` | `#ffffff` |

---

## Examples

### Larger Dots with More Spacing

```css
:root {
  --vs-dot-size: 16px;
  --vs-dot-spacing: 20px;
  --vs-dot-border-width: 3px;
}
```

### Glass-Morphism Style

```css
.vs-theme-glass {
  --vs-dot-color: rgba(255, 255, 255, 0.1);
  --vs-dot-active-color: rgba(255, 255, 255, 0.9);
  --vs-dot-border-color: rgba(255, 255, 255, 0.3);
  --vs-dot-hover-color: rgba(255, 255, 255, 0.3);
  --vs-tooltip-bg: rgba(0, 0, 0, 0.6);
  --vs-tooltip-color: #ffffff;
  --vs-dot-size: 10px;
  --vs-dot-border-width: 1px;
  --vs-transition-duration: 0.5s;
}
```

### Neon Glow

```css
.vs-theme-neon {
  --vs-dot-color: transparent;
  --vs-dot-active-color: #39ff14;
  --vs-dot-border-color: #39ff14;
  --vs-dot-hover-color: rgba(57, 255, 20, 0.3);
  --vs-tooltip-bg: #0a0a0a;
  --vs-tooltip-color: #39ff14;
  --vs-dot-size: 10px;
  --vs-dot-border-width: 2px;
}

.vs-theme-neon .vs-pagination-button.vs-pagination-active .vs-pagination-dot {
  box-shadow: 0 0 8px #39ff14, 0 0 16px rgba(57, 255, 20, 0.3);
  animation: none;
}
```

### Matching OS Dark Mode

Use the `prefers-color-scheme` media query to automatically adapt:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --vs-dot-color: #555555;
    --vs-dot-active-color: #bb86fc;
    --vs-dot-border-color: #777777;
    --vs-dot-hover-color: #888888;
    --vs-tooltip-bg: #1e1e1e;
    --vs-tooltip-color: #ffffff;
  }
}
```

---

## Media Query Overrides

The plugin CSS includes built-in media query overrides for accessibility:

### `prefers-reduced-motion: reduce`

All transitions and animations are disabled:

```css
/* Built into the plugin CSS */
@media (prefers-reduced-motion: reduce) {
  .vs-pagination-dot,
  .vs-pagination-button,
  .vs-pagination-tooltip {
    transition: none;
  }

  .vs-pagination-button.vs-pagination-active .vs-pagination-dot {
    animation: none;
  }
}
```

### `prefers-contrast: high`

Border widths are increased and colors become more distinct:

```css
/* Built into the plugin CSS */
@media (prefers-contrast: high) {
  .vs-pagination-dot {
    border-width: 3px;
  }

  .vs-pagination-button.vs-pagination-active .vs-pagination-dot {
    background-color: #000000;
    border-color: #ffffff;
  }
}
```

You do not need to add these yourself -- they are included in the plugin stylesheet automatically.
