# Quick Start

Get a smooth full-page scrolling experience running in minutes.

---

## Minimal HTML Structure

The plugin works with a container element that holds child section elements. By default, the plugin looks for `<section>` elements, but this is configurable via the `selector` option.

```html
<div id="page">
  <section>Section 1</section>
  <section>Section 2</section>
  <section>Section 3</section>
</div>
```

**Key requirements:**

- The container (`#page`) must have a defined height (typically `100vh`).
- Each section should also have a height of `100vh` to fill the viewport.
- The container should have no margin or padding interference from `html` or `body`.

---

## Basic Initialization

```javascript
$(document).ready(function() {
  $('#page').verticalScroll();
});
```

That is all you need. The plugin will automatically:

- Enable mouse wheel navigation
- Enable keyboard navigation (arrow keys, Page Up/Down, Home/End)
- Enable touch/swipe navigation on mobile
- Show pagination dots on the right side
- Apply the default theme
- Add ARIA labels for accessibility

---

## Adding Section Labels

Use the `data-vs-label` attribute to give each section a meaningful name. These labels appear in the pagination tooltips and are used for ARIA labels:

```html
<div id="page">
  <section data-vs-label="Home">
    <h1>Welcome</h1>
  </section>
  <section data-vs-label="About">
    <h1>About Us</h1>
  </section>
  <section data-vs-label="Services">
    <h1>Our Services</h1>
  </section>
  <section data-vs-label="Contact">
    <h1>Contact Us</h1>
  </section>
</div>
```

> If `data-vs-label` is not set, the plugin falls back to `data-title`, then to a generic "Section N" label.

---

## Full Working Example

Here is a complete, self-contained HTML file you can save and open in a browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vertical Scroll - Quick Start</title>

  <!-- Plugin CSS -->
  <link rel="stylesheet" href="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/css/jquery.verticalscroll.min.css">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #page {
      height: 100vh;
    }

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

    section h1 {
      font-size: 3em;
      margin-bottom: 0.3em;
    }

    section p {
      font-size: 1.2em;
      max-width: 600px;
      opacity: 0.9;
    }

    section:nth-child(1) { background: #0d6efd; }
    section:nth-child(2) { background: #6610f2; }
    section:nth-child(3) { background: #198754; }
    section:nth-child(4) { background: #dc3545; }
  </style>
</head>
<body>

  <div id="page">
    <section data-vs-label="Home">
      <h1>Welcome</h1>
      <p>Scroll down or use keyboard arrows to navigate between sections.</p>
    </section>

    <section data-vs-label="About">
      <h1>About Us</h1>
      <p>We build delightful web experiences with smooth, accessible interactions.</p>
    </section>

    <section data-vs-label="Services">
      <h1>Our Services</h1>
      <p>Full-page scrolling, touch navigation, keyboard support, and more.</p>
    </section>

    <section data-vs-label="Contact">
      <h1>Contact Us</h1>
      <p>Get in touch to start your next project.</p>
    </section>
  </div>

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

  <!-- Plugin JS -->
  <script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>

  <script>
    $(document).ready(function() {
      $('#page').verticalScroll({
        theme: 'light',
        pagination: true,
        paginationPosition: 'right',
        animationDuration: 800,
        keyboard: true,
        touch: true,
        ariaLabels: true,
        onSectionChange: function(index, $section) {
          console.log('Now viewing: ' + $section.attr('data-vs-label'));
        }
      });
    });
  </script>

</body>
</html>
```

---

## What is Happening

When you call `$('#page').verticalScroll()`:

1. The plugin finds all `<section>` children of `#page`.
2. It sets up the container with `overflow: hidden` and `position: relative`.
3. It creates pagination dot navigation and appends it to the container.
4. It binds mouse wheel, keyboard, and touch event listeners.
5. It adds ARIA roles and labels for accessibility.
6. It marks the first section as active.

---

## Next Steps

- **[Options Reference](configuration/options.md)** -- Customize every aspect of the plugin behavior.
- **[Themes](configuration/themes.md)** -- Switch between built-in themes or create your own.
- **[Methods](api/methods.md)** -- Programmatically navigate and control the plugin.
- **[Examples](examples/basic.md)** -- More working code examples.
