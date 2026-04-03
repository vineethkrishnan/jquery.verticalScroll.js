# Auto Scroll

This example creates a carousel-style auto-scrolling experience that loops through sections at a fixed interval, pausing when the user hovers.

---

## Full Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auto Scroll Example</title>

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

    section:nth-child(1) { background: linear-gradient(135deg, #11998e, #38ef7d); }
    section:nth-child(2) { background: linear-gradient(135deg, #fc5c7d, #6a82fb); }
    section:nth-child(3) { background: linear-gradient(135deg, #f7971e, #ffd200); }
    section:nth-child(4) { background: linear-gradient(135deg, #a770ef, #cf8bf3); }
    section:nth-child(5) { background: linear-gradient(135deg, #00c6ff, #0072ff); }

    /* Progress bar */
    .progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.9);
      z-index: 200;
      transition: width linear;
      width: 0%;
    }

    /* Controls */
    .controls {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .controls button {
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 10px 20px;
      border-radius: 30px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      transition: background 0.2s;
    }

    .controls button:hover {
      background: rgba(0, 0, 0, 0.7);
    }

    .controls .counter {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.5);
      padding: 10px 16px;
      border-radius: 30px;
      backdrop-filter: blur(10px);
    }
  </style>
</head>
<body>

  <div class="progress-bar" id="progress"></div>

  <div id="page">
    <section data-vs-label="Welcome">
      <h1>Welcome</h1>
      <p>This page auto-scrolls every 4 seconds. Hover to pause, or use the controls below.</p>
    </section>
    <section data-vs-label="Features">
      <h1>Features</h1>
      <p>Auto-scroll with loop creates a continuous carousel experience.</p>
    </section>
    <section data-vs-label="Performance">
      <h1>Performance</h1>
      <p>Lightweight animations that respect prefers-reduced-motion preferences.</p>
    </section>
    <section data-vs-label="Accessibility">
      <h1>Accessibility</h1>
      <p>Full ARIA support with keyboard navigation always available.</p>
    </section>
    <section data-vs-label="Get Started">
      <h1>Get Started</h1>
      <p>Install via npm and start building in minutes.</p>
    </section>
  </div>

  <div class="controls">
    <button id="btn-prev">Prev</button>
    <span class="counter" id="counter">1 / 5</span>
    <button id="btn-next">Next</button>
    <button id="btn-toggle">Pause</button>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>

  <script>
    $(document).ready(function() {
      var $page = $('#page');
      var autoScrollActive = true;
      var interval = 4000;
      var progressTimer = null;

      $page.verticalScroll({
        theme: 'light',
        pagination: true,
        loop: true,
        autoScroll: true,
        autoScrollInterval: interval,
        pauseOnHover: true,
        animationDuration: 800,

        onInit: function(index) {
          updateCounter(index);
          startProgress();
        },

        onAfterScroll: function(index) {
          updateCounter(index);
          if (autoScrollActive) {
            startProgress();
          }
        },

        onSectionChange: function(index) {
          updateCounter(index);
        }
      });

      // Counter display
      function updateCounter(index) {
        var total = $page.verticalScroll('getSectionCount');
        $('#counter').text((index + 1) + ' / ' + total);
      }

      // Animated progress bar
      function startProgress() {
        var $bar = $('#progress');
        $bar.stop().css('width', '0%');
        clearTimeout(progressTimer);

        $bar.animate({ width: '100%' }, {
          duration: interval,
          easing: 'linear',
          complete: function() {
            $bar.css('width', '0%');
          }
        });
      }

      function stopProgress() {
        $('#progress').stop().css('width', '0%');
        clearTimeout(progressTimer);
      }

      // Pause/resume on hover
      $page.on('mouseenter', function() {
        if (autoScrollActive) {
          $('#progress').stop();
        }
      });

      $page.on('mouseleave', function() {
        if (autoScrollActive) {
          startProgress();
        }
      });

      // Manual controls
      $('#btn-prev').on('click', function() {
        $page.verticalScroll('prev');
      });

      $('#btn-next').on('click', function() {
        $page.verticalScroll('next');
      });

      $('#btn-toggle').on('click', function() {
        autoScrollActive = !autoScrollActive;

        if (autoScrollActive) {
          $page.verticalScroll('setOptions', { autoScroll: true });
          $(this).text('Pause');
          startProgress();
        } else {
          $page.verticalScroll('setOptions', { autoScroll: false });
          $(this).text('Play');
          stopProgress();
        }
      });
    });
  </script>

</body>
</html>
```

---

## Key Concepts

### Enabling Auto-Scroll

Set `autoScroll: true` and `loop: true` to create a continuous carousel:

```javascript
$('#page').verticalScroll({
  autoScroll: true,
  autoScrollInterval: 4000,
  loop: true,
  pauseOnHover: true
});
```

### Toggling at Runtime

Use `setOptions` to enable or disable auto-scroll dynamically:

```javascript
// Start auto-scrolling
$('#page').verticalScroll('setOptions', { autoScroll: true });

// Stop auto-scrolling
$('#page').verticalScroll('setOptions', { autoScroll: false });
```

### Behavior Without Loop

When `loop` is `false` and auto-scroll reaches the last section, auto-scrolling stops automatically. The user can still navigate manually.

### Pause on Hover

When `pauseOnHover: true` (the default), the auto-scroll timer pauses when the cursor enters the container and resumes when it leaves. This prevents the page from scrolling away while the user is reading.
