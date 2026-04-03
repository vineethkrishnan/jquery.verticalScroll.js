# Basic Setup

A complete, minimal example of jQuery Vertical Scroll with pagination, keyboard navigation, and touch support.

---

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Basic Setup</title>

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
      font-weight: 700;
    }

    section p {
      font-size: 1.2em;
      max-width: 600px;
      opacity: 0.85;
      line-height: 1.6;
    }

    /* Section backgrounds */
    .section-hero    { background: linear-gradient(135deg, #667eea, #764ba2); }
    .section-about   { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .section-work    { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .section-contact { background: linear-gradient(135deg, #43e97b, #38f9d7); }
  </style>
</head>
<body>

  <div id="page">
    <section class="section-hero" data-vs-label="Home">
      <h1>Welcome</h1>
      <p>This is a basic setup using jQuery Vertical Scroll. Scroll down, press the arrow keys, or swipe to navigate.</p>
    </section>

    <section class="section-about" data-vs-label="About">
      <h1>About</h1>
      <p>Each section takes up the full viewport height. Pagination dots on the right let you jump to any section.</p>
    </section>

    <section class="section-work" data-vs-label="Work">
      <h1>Our Work</h1>
      <p>The plugin handles mouse wheel, keyboard, and touch input automatically. No extra configuration needed.</p>
    </section>

    <section class="section-contact" data-vs-label="Contact">
      <h1>Contact</h1>
      <p>Hover over the pagination dots to see section labels. Try pressing Home or End to jump to the first or last section.</p>
    </section>
  </div>

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

  <!-- Plugin JS -->
  <script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>

  <script>
    $(document).ready(function() {
      $('#page').verticalScroll({
        selector: 'section',
        theme: 'light',
        pagination: true,
        paginationPosition: 'right',
        paginationOffset: 20,
        animationDuration: 800,
        easing: 'swing',
        keyboard: true,
        touch: true,
        mouseWheel: true,
        ariaLabels: true,
        focusOnSection: true
      });
    });
  </script>

</body>
</html>
```

---

## What This Example Demonstrates

- **Pagination dots** on the right side with section label tooltips on hover.
- **Mouse wheel** scrolling between sections with smooth animation.
- **Keyboard navigation** using Arrow Up/Down, Page Up/Down, Home, and End.
- **Touch/swipe** navigation on mobile devices.
- **ARIA labels** and focus management for screen readers.
- **Gradient backgrounds** that fill the viewport for each section.
- **Section labels** via `data-vs-label` for tooltips and accessibility.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow Down / Page Down | Next section |
| Arrow Up / Page Up | Previous section |
| Home | First section |
| End | Last section |
