# Events & Callbacks

jQuery Vertical Scroll supports two ways to react to plugin events: **callback options** passed during initialization, and **jQuery custom events** that you can bind at any time.

Both mechanisms fire for the same events. Use whichever pattern fits your workflow best.

---

## Callback vs jQuery Event

| Feature | Callback Option | jQuery Event |
|---------|----------------|--------------|
| Set during | Initialization | Any time |
| Syntax | `onAfterScroll: function() {}` | `.on('verticalscroll:afterscroll', fn)` |
| Cancel scroll | `return false` | `e.preventDefault()` |
| Multiple handlers | One per option | Unlimited |
| Context (`this`) | The container DOM element | Standard jQuery event target |

---

## Event Reference

### onInit

Fired once after the plugin has fully initialized (sections cached, pagination created, event listeners bound).

**Callback signature:**

```javascript
onInit: function(index, $section) { }
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `index` | `number` | Index of the initially active section (usually `0`). |
| `$section` | `jQuery` | jQuery element of the initially active section. |

**jQuery event:** `verticalscroll:init`

```javascript
$('#page').on('verticalscroll:init', function(e, index, $section) {
  console.log('Plugin initialized at section', index);
});
```

---

### onDestroy

Fired when the `destroy()` method is called, before cleanup begins.

**Callback signature:**

```javascript
onDestroy: function() { }
```

No parameters.

**jQuery event:** `verticalscroll:destroy`

```javascript
$('#page').on('verticalscroll:destroy', function() {
  console.log('Plugin is being destroyed');
});
```

---

### onBeforeScroll

Fired before a scroll animation begins. This is the only event that can **cancel** the scroll.

**Callback signature:**

```javascript
onBeforeScroll: function(targetIndex, $targetSection, currentIndex) { }
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `targetIndex` | `number` | Index of the section being scrolled to. |
| `$targetSection` | `jQuery` | jQuery element of the target section. |
| `currentIndex` | `number` | Index of the currently active section. |

**Return value:** Return `false` to cancel the scroll.

**jQuery event:** `verticalscroll:beforescroll`

**Examples:**

```javascript
// Callback: block navigation to a locked section
$('#page').verticalScroll({
  onBeforeScroll: function(targetIndex, $targetSection, currentIndex) {
    if ($targetSection.hasClass('locked')) {
      alert('This section is locked.');
      return false; // Cancel the scroll
    }
  }
});
```

```javascript
// jQuery event: same behavior
$('#page').on('verticalscroll:beforescroll', function(e, targetIndex, $targetSection, currentIndex) {
  if ($targetSection.hasClass('locked')) {
    e.preventDefault(); // Cancel the scroll
  }
});
```

---

### onAfterScroll

Fired after the scroll animation has completed and the new section is in view.

**Callback signature:**

```javascript
onAfterScroll: function(index, $section, previousIndex) { }
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `index` | `number` | Index of the section that was scrolled to. |
| `$section` | `jQuery` | jQuery element of the new active section. |
| `previousIndex` | `number` | Index of the section that was previously active. |

**jQuery event:** `verticalscroll:afterscroll`

```javascript
$('#page').on('verticalscroll:afterscroll', function(e, index, $section, previousIndex) {
  console.log('Scrolled from section', previousIndex, 'to section', index);
});
```

---

### onSectionChange

Fired whenever the active section changes, whether triggered by user interaction (scroll, keyboard, touch), the API, or native scrolling.

**Callback signature:**

```javascript
onSectionChange: function(index, $section, previousIndex) { }
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `index` | `number` | Index of the new active section. |
| `$section` | `jQuery` | jQuery element of the new active section. |
| `previousIndex` | `number` | Index of the previously active section. |

**jQuery event:** `verticalscroll:sectionchange`

```javascript
$('#page').on('verticalscroll:sectionchange', function(e, index, $section, previousIndex) {
  // Update a progress indicator
  var progress = ((index + 1) / total) * 100;
  $('#progress-bar').css('width', progress + '%');
});
```

> **Note:** `onSectionChange` fires when the active section changes during scroll tracking, while `onAfterScroll` fires only after an animated scroll completes. When using programmatic navigation, both events fire. During native scrolling (when the plugin is disabled or adjusting), only `onSectionChange` fires.

---

### onResize

Fired when the window is resized (debounced at 250ms). Useful for updating custom UI that depends on viewport dimensions.

**Callback signature:**

```javascript
onResize: function(isEnabled) { }
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `isEnabled` | `boolean` | Whether the plugin is currently enabled (based on responsive breakpoint). |

**jQuery event:** `verticalscroll:resize`

```javascript
$('#page').on('verticalscroll:resize', function(e, isEnabled) {
  if (!isEnabled) {
    console.log('Plugin disabled (mobile viewport)');
  }
});
```

---

## Cancelling a Scroll

Only the `onBeforeScroll` event can cancel a scroll. There are two approaches:

### Using the callback option

```javascript
$('#page').verticalScroll({
  onBeforeScroll: function(targetIndex, $targetSection, currentIndex) {
    // Prevent backward navigation
    if (targetIndex < currentIndex) {
      return false;
    }
  }
});
```

### Using a jQuery event handler

```javascript
$('#page').on('verticalscroll:beforescroll', function(e, targetIndex, $targetSection, currentIndex) {
  // Require form completion before advancing
  if (currentIndex === 1 && !isFormValid()) {
    e.preventDefault();
  }
});
```

---

## Multiple Event Handlers

jQuery events support multiple handlers, making it easy to separate concerns:

```javascript
// Analytics tracking
$('#page').on('verticalscroll:sectionchange', function(e, index, $section) {
  trackSectionView(index, $section.attr('id'));
});

// UI updates
$('#page').on('verticalscroll:sectionchange', function(e, index, $section) {
  updateNavigationHighlight(index);
});

// Background changes
$('#page').on('verticalscroll:sectionchange', function(e, index) {
  $('body').attr('data-active-section', index);
});
```

---

## Removing Event Handlers

Use jQuery's standard `.off()` method with the event namespace:

```javascript
// Remove a specific handler
$('#page').off('verticalscroll:sectionchange', myHandler);

// Remove all handlers for one event
$('#page').off('verticalscroll:sectionchange');

// Remove all verticalscroll event handlers
$('#page').off('.verticalScroll');
```

---

## Complete Example

```javascript
$('#page').verticalScroll({
  onInit: function(index, $section) {
    console.log('[Init] Started at section', index);
    updateCounter(index);
  },

  onBeforeScroll: function(targetIndex, $targetSection, currentIndex) {
    console.log('[Before] Scrolling from', currentIndex, 'to', targetIndex);

    // Prevent scrolling past a paywall section
    if (targetIndex > 2 && !isPremiumUser) {
      showPaywall();
      return false;
    }
  },

  onAfterScroll: function(index, $section, previousIndex) {
    console.log('[After] Arrived at section', index);

    // Trigger entrance animations
    $section.find('.animate-in').addClass('visible');
  },

  onSectionChange: function(index, $section, previousIndex) {
    console.log('[Change] Active section:', index);
    updateCounter(index);

    // Update URL hash
    var id = $section.attr('id');
    if (id) {
      history.replaceState(null, null, '#' + id);
    }
  },

  onResize: function(isEnabled) {
    console.log('[Resize] Plugin is', isEnabled ? 'enabled' : 'disabled');
  },

  onDestroy: function() {
    console.log('[Destroy] Cleaning up');
  }
});

function updateCounter(index) {
  var total = $('#page').verticalScroll('getSectionCount');
  $('#counter').text((index + 1) + ' / ' + total);
}
```
