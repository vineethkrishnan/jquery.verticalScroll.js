# Accessibility

jQuery Vertical Scroll is designed with accessibility in mind. It follows WAI-ARIA best practices, supports keyboard navigation, respects user motion preferences, and works with screen readers.

---

## ARIA Attributes

When `ariaLabels: true` (the default), the plugin adds the following ARIA attributes automatically:

### Container

```html
<div id="page" role="region" aria-label="Vertical scrolling content">
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `role` | `region` | Marks the container as a landmark region for screen readers. |
| `aria-label` | `Vertical scrolling content` | Provides a description of the region. |

### Sections

```html
<section role="group" aria-label="About" data-vs-index="1">
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `role` | `group` | Identifies each section as a grouped unit of content. |
| `aria-label` | Value of `data-vs-label` | Describes the section to screen readers. Falls back to `"Section N"`. |
| `tabindex` | `-1` | Added when `focusOnSection` is `true`. Makes sections programmatically focusable without adding them to the tab order. |

### Pagination Navigation

```html
<nav class="vs-pagination" role="navigation" aria-label="Section navigation">
  <ul class="vs-pagination-list">
    <li class="vs-pagination-item">
      <button class="vs-pagination-button vs-pagination-active"
              aria-label="Go to About"
              aria-current="true">
        <span class="vs-pagination-dot"></span>
        <span class="vs-pagination-tooltip">About</span>
      </button>
    </li>
  </ul>
</nav>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `role` | `navigation` | Marks the pagination as a navigation landmark. |
| `aria-label` | `Section navigation` | Describes the navigation purpose. |
| `aria-label` (button) | `Go to {label}` | Describes each dot button's action. |
| `aria-current` | `true` | Indicates the currently active section's dot. |

---

## Keyboard Navigation

The plugin provides full keyboard support when `keyboard: true` (the default).

| Key | Action |
|-----|--------|
| Arrow Down | Navigate to the next section |
| Arrow Up | Navigate to the previous section |
| Page Down | Navigate to the next section |
| Page Up | Navigate to the previous section |
| Home | Navigate to the first section |
| End | Navigate to the last section |
| Tab | Move focus to interactive elements within the current section |

### Focus Handling

Keyboard events are handled when:

- The `body` element has focus (no specific element is focused), OR
- The container element itself has focus, OR
- An element inside the container has focus.

This prevents the plugin from intercepting keyboard events when the user is interacting with elements outside the scrollable container (e.g., a modal dialog, a separate form).

---

## Focus Management

When `focusOnSection: true` (the default), the plugin moves focus to the target section after navigation:

1. The section is made focusable with `tabindex="-1"` (if it is not already focusable).
2. The section receives focus via `.focus()`.
3. Screen readers announce the section's `aria-label`.

This ensures that screen reader users know which section they are on after navigation, and that subsequent Tab presses move through the content of the current section.

### Disabling Focus Management

If you manage focus yourself or if focus management interferes with your page, disable it:

```javascript
$('#page').verticalScroll({
  focusOnSection: false
});
```

---

## Screen Reader Support

With the ARIA attributes in place, screen readers will:

1. Announce the container as a **region** named "Vertical scrolling content".
2. Announce the **pagination** as a **navigation** landmark named "Section navigation".
3. Announce each pagination dot as a **button** with a label like "Go to About".
4. Announce the **active section** when focus moves to it after navigation.
5. Indicate the **currently active** dot with `aria-current="true"`.

### Section Labels

Always provide meaningful labels using the `data-vs-label` attribute:

```html
<!-- Good: descriptive labels -->
<section data-vs-label="Company Overview">...</section>
<section data-vs-label="Our Services">...</section>
<section data-vs-label="Contact Information">...</section>

<!-- Avoid: no labels (falls back to "Section 1", "Section 2", etc.) -->
<section>...</section>
<section>...</section>
```

---

## Prefers-Reduced-Motion Support

The plugin CSS respects the `prefers-reduced-motion` media query. When the user has requested reduced motion in their operating system settings:

- All CSS transitions on dots, buttons, and tooltips are **disabled**.
- The pulse animation on the active dot is **removed**.
- Scroll animations still use the configured `animationDuration`. To also reduce JavaScript animation, set a shorter duration:

```javascript
// Detect reduced motion preference
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#page').verticalScroll({
  animationDuration: prefersReducedMotion ? 0 : 800
});
```

The built-in CSS rules that handle this:

```css
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

---

## Prefers-Contrast Support

When the user has requested high contrast:

- Pagination dot **borders are thickened** to 3px for better visibility.
- The active dot uses **solid black with a white border** for maximum contrast.

```css
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

---

## Focus-Visible Styles

The plugin uses `:focus-visible` to show focus indicators only for keyboard navigation, not for mouse clicks:

```css
/* Section focus indicator */
.vs-section:focus-visible {
  outline: 2px solid var(--vs-dot-active-color);
  outline-offset: -2px;
}

/* Pagination button focus indicator */
.vs-pagination-button:focus-visible {
  outline: 2px solid var(--vs-dot-border-color);
  outline-offset: 4px;
  border-radius: 50%;
}
```

When a pagination button receives focus via keyboard, its tooltip is also shown.

---

## Print Styles

When the page is printed, the plugin CSS hides the pagination and makes all sections visible:

```css
@media print {
  .vs-pagination {
    display: none !important;
  }

  .vs-container {
    overflow: visible !important;
    height: auto !important;
  }

  .vs-section {
    min-height: auto !important;
    page-break-inside: avoid;
  }
}
```

---

## Checklist

Use this checklist to ensure your implementation is accessible:

- [ ] All sections have `data-vs-label` with descriptive text.
- [ ] `ariaLabels` is `true` (default).
- [ ] `focusOnSection` is `true` (default).
- [ ] `keyboard` is `true` (default).
- [ ] Section content is readable without JavaScript enabled (graceful degradation).
- [ ] Interactive elements within sections are reachable via Tab.
- [ ] Color contrast between text and background meets WCAG 2.1 AA requirements.
- [ ] Tested with at least one screen reader (VoiceOver, NVDA, or JAWS).
- [ ] Tested with keyboard-only navigation.
