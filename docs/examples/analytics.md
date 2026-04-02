# Analytics Integration

Track section views and user navigation with Google Analytics (GA4), Google Tag Manager, or any analytics service.

---

## Google Analytics 4 (gtag.js)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics Integration</title>

  <link rel="stylesheet" href="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/css/jquery.verticalscroll.min.css">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>

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

    section:nth-child(1) { background: #1a1a2e; }
    section:nth-child(2) { background: #16213e; }
    section:nth-child(3) { background: #0f3460; }
    section:nth-child(4) { background: #533483; }
    section:nth-child(5) { background: #e94560; }
  </style>
</head>
<body>

  <div id="page">
    <section id="hero" data-vs-label="Hero">
      <h1>Hero</h1>
      <p>Section views are tracked in Google Analytics.</p>
    </section>
    <section id="features" data-vs-label="Features">
      <h1>Features</h1>
      <p>Each section change fires a custom GA4 event.</p>
    </section>
    <section id="pricing" data-vs-label="Pricing">
      <h1>Pricing</h1>
      <p>Track which sections users engage with most.</p>
    </section>
    <section id="testimonials" data-vs-label="Testimonials">
      <h1>Testimonials</h1>
      <p>Measure scroll depth across your landing page.</p>
    </section>
    <section id="cta" data-vs-label="Call to Action">
      <h1>Get Started</h1>
      <p>Conversion tracking at the final section.</p>
    </section>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>

  <script>
    $(document).ready(function() {
      var totalSections;
      var sectionViewTimes = {};
      var lastChangeTime = Date.now();

      $('#page').verticalScroll({
        theme: 'dark',
        pagination: true,

        onInit: function(index, $section) {
          totalSections = $('#page').verticalScroll('getSectionCount');
          sectionViewTimes[index] = Date.now();

          // Track initial page view with section context
          gtag('event', 'page_section_view', {
            section_id: $section.attr('id'),
            section_label: $section.attr('data-vs-label'),
            section_index: index,
            total_sections: totalSections
          });
        },

        onSectionChange: function(index, $section, previousIndex) {
          var now = Date.now();
          var timeOnPrevious = now - lastChangeTime;
          lastChangeTime = now;

          // Track section view
          gtag('event', 'page_section_view', {
            section_id: $section.attr('id'),
            section_label: $section.attr('data-vs-label'),
            section_index: index,
            total_sections: totalSections,
            scroll_direction: index > previousIndex ? 'down' : 'up'
          });

          // Track time spent on previous section
          gtag('event', 'section_engagement', {
            section_id: $('#page section').eq(previousIndex).attr('id'),
            section_index: previousIndex,
            time_on_section_ms: timeOnPrevious
          });

          // Track scroll depth as a percentage
          var scrollDepth = Math.round(((index + 1) / totalSections) * 100);
          gtag('event', 'scroll_depth', {
            percent_scrolled: scrollDepth,
            max_section_reached: index
          });
        },

        onAfterScroll: function(index, $section) {
          // Track if user reached the final CTA section
          if (index === totalSections - 1) {
            gtag('event', 'cta_section_reached', {
              section_id: $section.attr('id')
            });
          }
        }
      });
    });
  </script>

</body>
</html>
```

---

## What Gets Tracked

| Event Name | When | Key Parameters |
|------------|------|----------------|
| `page_section_view` | Each time a section becomes active | `section_id`, `section_label`, `section_index`, `scroll_direction` |
| `section_engagement` | When leaving a section | `section_id`, `section_index`, `time_on_section_ms` |
| `scroll_depth` | Each section change | `percent_scrolled`, `max_section_reached` |
| `cta_section_reached` | When the last section is reached | `section_id` |

---

## Google Tag Manager (dataLayer)

If you use Google Tag Manager instead of direct gtag calls, push events to the `dataLayer`:

```javascript
$('#page').verticalScroll({
  onSectionChange: function(index, $section, previousIndex) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'section_view',
      sectionId: $section.attr('id'),
      sectionLabel: $section.attr('data-vs-label'),
      sectionIndex: index,
      previousSectionIndex: previousIndex,
      scrollDirection: index > previousIndex ? 'down' : 'up'
    });
  }
});
```

Then create a **Custom Event** trigger in GTM that listens for the `section_view` event and map the dataLayer variables to your GA4 event parameters.

---

## Other Analytics Services

### Mixpanel

```javascript
$('#page').verticalScroll({
  onSectionChange: function(index, $section) {
    mixpanel.track('Section Viewed', {
      section_id: $section.attr('id'),
      section_label: $section.attr('data-vs-label'),
      section_index: index
    });
  }
});
```

### Segment

```javascript
$('#page').verticalScroll({
  onSectionChange: function(index, $section) {
    analytics.track('Section Viewed', {
      sectionId: $section.attr('id'),
      sectionLabel: $section.attr('data-vs-label'),
      sectionIndex: index
    });
  }
});
```

### Plausible

```javascript
$('#page').verticalScroll({
  onSectionChange: function(index, $section) {
    plausible('Section View', {
      props: {
        section: $section.attr('data-vs-label')
      }
    });
  }
});
```

---

## Tips

- Use `onSectionChange` for tracking (fires for all navigation methods) rather than `onAfterScroll` (fires only for animated scrolls).
- Track **scroll direction** (`up` vs `down`) to understand user behavior patterns.
- Track **time on section** to identify which sections engage users and which they skip.
- The **scroll depth percentage** helps you understand how far users get through your content.
- Be mindful of event volume: if you have many sections and high traffic, consider sampling or debouncing analytics calls.
