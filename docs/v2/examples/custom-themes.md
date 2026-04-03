# Custom Themes

This example shows how to create a fully custom theme using CSS variables and a custom pulse animation.

---

## Custom "Sunset" Theme

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Theme Example</title>

  <link rel="stylesheet" href="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/css/jquery.verticalscroll.min.css">

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; font-family: 'Segoe UI', Roboto, sans-serif; }
    #page { height: 100vh; }

    section {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      text-align: center;
      padding: 40px;
    }

    section h1 { font-size: 3em; margin-bottom: 0.3em; }
    section p  { font-size: 1.1em; max-width: 550px; opacity: 0.9; }

    section:nth-child(1) { background: linear-gradient(135deg, #ff9a56, #ff6b35); }
    section:nth-child(2) { background: linear-gradient(135deg, #ff6b35, #ee4a1b); }
    section:nth-child(3) { background: linear-gradient(135deg, #ee4a1b, #c0392b); }
    section:nth-child(4) { background: linear-gradient(135deg, #c0392b, #8e1a0e); }

    /* ========================================
       Custom "Sunset" Theme
       ======================================== */
    .vs-theme-sunset {
      --vs-dot-color: rgba(255, 255, 255, 0.4);
      --vs-dot-active-color: #ff6b35;
      --vs-dot-border-color: rgba(255, 255, 255, 0.7);
      --vs-dot-hover-color: rgba(255, 255, 255, 0.7);
      --vs-tooltip-bg: #ff6b35;
      --vs-tooltip-color: #ffffff;
      --vs-dot-size: 14px;
      --vs-dot-spacing: 16px;
      --vs-dot-border-width: 2px;
      --vs-transition-duration: 0.4s;
    }

    /* Custom pulse animation color */
    .vs-theme-sunset .vs-pagination-button.vs-pagination-active .vs-pagination-dot {
      animation-name: vs-pulse-sunset;
    }

    /* Tooltip arrow color */
    .vs-theme-sunset .vs-pagination-tooltip::before {
      border-left-color: #ff6b35;
    }

    @keyframes vs-pulse-sunset {
      0%   { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.5); }
      70%  { box-shadow: 0 0 0 10px rgba(255, 107, 53, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
    }
  </style>
</head>
<body>

  <div id="page">
    <section data-vs-label="Sunrise">
      <h1>Sunrise</h1>
      <p>The day begins with warm, golden hues.</p>
    </section>
    <section data-vs-label="Afternoon">
      <h1>Afternoon</h1>
      <p>The sun climbs high and the colors intensify.</p>
    </section>
    <section data-vs-label="Dusk">
      <h1>Dusk</h1>
      <p>Deep reds and oranges paint the sky.</p>
    </section>
    <section data-vs-label="Night">
      <h1>Night</h1>
      <p>The sun sets and the world grows quiet.</p>
    </section>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>

  <script>
    $(document).ready(function() {
      $('#page').verticalScroll({
        theme: 'sunset',
        pagination: true,
        paginationPosition: 'right',
        paginationOffset: 24
      });
    });
  </script>

</body>
</html>
```

---

## How It Works

1. **Set a custom theme name** in the options: `theme: 'sunset'`. The plugin adds the class `vs-theme-sunset` to the container.

2. **Define CSS variables** inside `.vs-theme-sunset` to control dot colors, sizes, and timing.

3. **Override the pulse animation** name on the active dot to use a custom keyframe with your accent color.

4. **Set the tooltip arrow color** to match the tooltip background. The tooltip arrow is a CSS border trick on the `::before` pseudo-element.

---

## Switching Themes Dynamically

You can add a theme switcher by swapping the CSS class:

```javascript
var themes = ['default', 'light', 'dark', 'minimal', 'sunset'];
var currentTheme = 0;

$('#theme-btn').on('click', function() {
  var $page = $('#page');

  // Remove current theme class
  $page.removeClass('vs-theme-' + themes[currentTheme]);

  // Advance to next theme
  currentTheme = (currentTheme + 1) % themes.length;

  // Apply new theme class
  $page.addClass('vs-theme-' + themes[currentTheme]);

  $(this).text('Theme: ' + themes[currentTheme]);
});
```

---

## More Theme Ideas

### Glass Morphism

```css
.vs-theme-glass {
  --vs-dot-color: rgba(255, 255, 255, 0.15);
  --vs-dot-active-color: rgba(255, 255, 255, 0.95);
  --vs-dot-border-color: rgba(255, 255, 255, 0.3);
  --vs-dot-hover-color: rgba(255, 255, 255, 0.4);
  --vs-tooltip-bg: rgba(255, 255, 255, 0.15);
  --vs-tooltip-color: #ffffff;
  --vs-dot-size: 10px;
  --vs-dot-border-width: 1px;
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
  box-shadow: 0 0 8px #39ff14, 0 0 20px rgba(57, 255, 20, 0.3);
  animation: none;
}
```

### Corporate Blue

```css
.vs-theme-corporate {
  --vs-dot-color: #b0bec5;
  --vs-dot-active-color: #1565c0;
  --vs-dot-border-color: #90a4ae;
  --vs-dot-hover-color: #78909c;
  --vs-tooltip-bg: #1565c0;
  --vs-tooltip-color: #ffffff;
  --vs-dot-size: 12px;
  --vs-dot-border-width: 2px;
}
```
