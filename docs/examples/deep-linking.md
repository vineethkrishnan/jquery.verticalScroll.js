# Deep Linking

This example demonstrates how to use URL hashes to link directly to specific sections. The URL updates as the user navigates, and opening a URL with a hash scrolls to the correct section on page load.

---

## Full Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deep Linking Example</title>

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

    /* Navigation bar */
    .top-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      gap: 24px;
      padding: 14px 20px;
    }

    .top-nav a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
    }

    .top-nav a:hover,
    .top-nav a.active {
      color: #ffffff;
    }

    #home    { background: linear-gradient(135deg, #0f0c29, #302b63); }
    #about   { background: linear-gradient(135deg, #302b63, #24243e); }
    #work    { background: linear-gradient(135deg, #24243e, #0f0c29); }
    #contact { background: linear-gradient(135deg, #0f0c29, #1a1a2e); }
  </style>
</head>
<body>

  <!-- Fixed navigation with hash links -->
  <nav class="top-nav">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#work">Work</a>
    <a href="#contact">Contact</a>
  </nav>

  <div id="page">
    <section id="home" data-vs-label="Home">
      <h1>Home</h1>
      <p>Share this page with #home in the URL and it will scroll here on load.</p>
    </section>

    <section id="about" data-vs-label="About">
      <h1>About</h1>
      <p>The URL hash updates automatically as you navigate between sections.</p>
    </section>

    <section id="work" data-vs-label="Work">
      <h1>Work</h1>
      <p>Try copying the current URL and opening it in a new tab.</p>
    </section>

    <section id="contact" data-vs-label="Contact">
      <h1>Contact</h1>
      <p>Each section has a unique ID that maps to a URL hash.</p>
    </section>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>

  <script>
    $(document).ready(function() {
      var $page = $('#page');

      $page.verticalScroll({
        theme: 'dark',
        pagination: true,

        // On init: scroll to hash if present
        onInit: function() {
          if (window.location.hash) {
            $page.verticalScroll('scrollToId', window.location.hash);
          }
          updateNavHighlight();
        },

        // After each scroll: update the URL hash
        onAfterScroll: function(index, $section) {
          var id = $section.attr('id');
          if (id) {
            history.replaceState(null, null, '#' + id);
          }
          updateNavHighlight();
        }
      });

      // Handle click on top nav links
      $('.top-nav a').on('click', function(e) {
        e.preventDefault();
        var hash = $(this).attr('href');
        $page.verticalScroll('scrollToId', hash);
      });

      // Handle browser back/forward
      $(window).on('hashchange', function() {
        if (window.location.hash) {
          $page.verticalScroll('scrollToId', window.location.hash);
        }
      });

      // Highlight active nav link
      function updateNavHighlight() {
        var $current = $page.verticalScroll('getCurrentSection');
        var currentId = $current.attr('id');

        $('.top-nav a').removeClass('active');
        $('.top-nav a[href="#' + currentId + '"]').addClass('active');
      }
    });
  </script>

</body>
</html>
```

---

## How It Works

1. **Each section has an `id` attribute** (`home`, `about`, `work`, `contact`).

2. **On initialization**, the `onInit` callback checks `window.location.hash`. If a hash is present (e.g., `#about`), it calls `scrollToId()` to navigate to that section.

3. **After each scroll**, the `onAfterScroll` callback uses `history.replaceState()` to update the URL hash without adding to the browser history stack. This means pressing Back will not step through every section.

4. **Top navigation links** use `scrollToId()` instead of default browser anchor behavior, ensuring the smooth scroll animation plays.

5. **Browser hashchange events** are handled so that if the user edits the hash in the address bar or uses Back/Forward, the page scrolls to the correct section.

---

## Using `pushState` Instead

If you want each section visit to create a browser history entry (so Back button returns to the previous section), replace `replaceState` with `pushState`:

```javascript
onAfterScroll: function(index, $section) {
  var id = $section.attr('id');
  if (id) {
    history.pushState(null, null, '#' + id);
  }
}
```

> Be mindful that this creates many history entries when the user scrolls through multiple sections quickly.
