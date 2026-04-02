# Methods

jQuery Vertical Scroll provides a full public API for programmatic navigation and control. Methods are called using the standard jQuery plugin pattern.

```javascript
$('#page').verticalScroll('methodName', arg1, arg2);
```

> Private methods (those starting with `_`) cannot be called externally. Attempting to call a private method will log a warning to the console.

---

## Navigation Methods

### scrollToSection

Navigate to a section by its zero-based index.

**Signature:**

```javascript
$('#page').verticalScroll('scrollToSection', index [, animate]);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | `number` | (required) | Zero-based index of the target section. |
| `animate` | `boolean` | `true` | Whether to animate the transition. Pass `false` for instant scroll. |

**Returns:** `jQuery.Deferred` promise.

**Example:**

```javascript
// Animate to the third section (index 2)
$('#page').verticalScroll('scrollToSection', 2);

// Jump instantly without animation
$('#page').verticalScroll('scrollToSection', 0, false);

// Use the returned promise
$('#page').verticalScroll('scrollToSection', 3)
  .done(function() {
    console.log('Arrived at section 3');
  })
  .fail(function(reason) {
    console.log('Navigation failed:', reason);
  });
```

**Failure reasons:**

- `'Invalid section index'` -- The index is out of range.
- `'Scroll cancelled'` -- The `onBeforeScroll` callback returned `false`.

---

### scrollToId

Navigate to a section by its `id` attribute.

**Signature:**

```javascript
$('#page').verticalScroll('scrollToId', id);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The section's `id` attribute value, with or without a leading `#`. |

**Returns:** `jQuery.Deferred` promise.

**Example:**

```javascript
// Both forms work
$('#page').verticalScroll('scrollToId', 'contact');
$('#page').verticalScroll('scrollToId', '#contact');
```

**Failure reasons:**

- `'Section not found: {id}'` -- No section has the specified `id`.

---

### next

Navigate to the next section. If already at the last section and `loop` is `false`, the promise is rejected.

**Signature:**

```javascript
$('#page').verticalScroll('next');
```

**Returns:** `jQuery.Deferred` promise.

**Example:**

```javascript
$('#page').verticalScroll('next')
  .fail(function(reason) {
    console.log(reason); // "Already at last section"
  });
```

---

### prev

Navigate to the previous section. If already at the first section and `loop` is `false`, the promise is rejected.

**Signature:**

```javascript
$('#page').verticalScroll('prev');
```

**Returns:** `jQuery.Deferred` promise.

**Example:**

```javascript
$('#page').verticalScroll('prev')
  .fail(function(reason) {
    console.log(reason); // "Already at first section"
  });
```

---

## Query Methods

### getCurrentIndex

Get the zero-based index of the currently active section.

**Signature:**

```javascript
var index = $('#page').verticalScroll('getCurrentIndex');
```

**Returns:** `number`

**Example:**

```javascript
var current = $('#page').verticalScroll('getCurrentIndex');
console.log('Currently viewing section', current); // e.g. 0, 1, 2...
```

---

### getCurrentSection

Get the jQuery element of the currently active section.

**Signature:**

```javascript
var $section = $('#page').verticalScroll('getCurrentSection');
```

**Returns:** `jQuery` object

**Example:**

```javascript
var $section = $('#page').verticalScroll('getCurrentSection');
var label = $section.attr('data-vs-label');
console.log('Current section:', label);
```

---

### getSections

Get a jQuery collection of all section elements.

**Signature:**

```javascript
var $sections = $('#page').verticalScroll('getSections');
```

**Returns:** `jQuery` object (collection)

**Example:**

```javascript
var $sections = $('#page').verticalScroll('getSections');
$sections.each(function(index) {
  console.log('Section', index, ':', $(this).attr('data-vs-label'));
});
```

---

### getSectionCount

Get the total number of sections.

**Signature:**

```javascript
var count = $('#page').verticalScroll('getSectionCount');
```

**Returns:** `number`

**Example:**

```javascript
var total = $('#page').verticalScroll('getSectionCount');
console.log('Total sections:', total);
```

---

## Control Methods

### enable

Enable the plugin (re-enables event listeners, auto-scroll, etc.). Removes the `vs-disabled` class from the container.

**Signature:**

```javascript
$('#page').verticalScroll('enable');
```

**Example:**

```javascript
// Re-enable after disabling
$('#page').verticalScroll('enable');
```

---

### disable

Disable the plugin (stops event handling, auto-scroll, and user navigation). Adds the `vs-disabled` class to the container, which sets `overflow: auto` for normal scrolling.

**Signature:**

```javascript
$('#page').verticalScroll('disable');
```

**Example:**

```javascript
// Temporarily disable during a modal
$('#modal').on('show', function() {
  $('#page').verticalScroll('disable');
});

$('#modal').on('hide', function() {
  $('#page').verticalScroll('enable');
});
```

---

### refresh

Recalculate section positions and update the active section. Call this after dynamically adding, removing, or resizing sections.

**Signature:**

```javascript
$('#page').verticalScroll('refresh');
```

**Example:**

```javascript
// After dynamically changing section content
$('#page section').eq(1).html('<h1>Updated Content</h1>');
$('#page').verticalScroll('refresh');
```

---

### setOptions

Update one or more options at runtime. This method merges the provided options with the existing configuration.

**Signature:**

```javascript
$('#page').verticalScroll('setOptions', options);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `object` | An object containing the options to update. |

**Example:**

```javascript
// Speed up animation
$('#page').verticalScroll('setOptions', {
  animationDuration: 400
});

// Enable auto-scroll at runtime
$('#page').verticalScroll('setOptions', {
  autoScroll: true,
  autoScrollInterval: 3000
});

// Disable auto-scroll
$('#page').verticalScroll('setOptions', {
  autoScroll: false
});
```

> When `autoScroll` is toggled via `setOptions`, the auto-scroll timer is automatically started or stopped.

---

### destroy

Remove the plugin instance completely. This method:

- Fires the `onDestroy` callback
- Stops auto-scroll
- Unbinds all event listeners
- Removes pagination DOM elements
- Removes all plugin-related classes and attributes
- Removes the plugin data from the element

**Signature:**

```javascript
$('#page').verticalScroll('destroy');
```

**Example:**

```javascript
// Clean up before removing the element
$('#page').verticalScroll('destroy');
$('#page').remove();
```

After calling `destroy`, you can re-initialize the plugin on the same element:

```javascript
$('#page').verticalScroll('destroy');

// Re-initialize with different options
$('#page').verticalScroll({
  theme: 'dark',
  loop: true
});
```

---

## Accessing Default Options

You can read (or modify) the default options that apply to all new instances:

```javascript
// Read defaults
console.log($.fn.verticalScroll.defaults);

// Change a default for all future instances
$.fn.verticalScroll.defaults.animationDuration = 600;
$.fn.verticalScroll.defaults.theme = 'dark';
```

---

## Accessing the Constructor

The plugin constructor is exposed for advanced use cases (e.g., extending the prototype):

```javascript
var VerticalScroll = $.fn.verticalScroll.Constructor;

// Add a custom method
VerticalScroll.prototype.goToMiddle = function() {
  var middleIndex = Math.floor(this.sections.length / 2);
  return this.scrollToSection(middleIndex);
};

// Now available on all instances
$('#page').verticalScroll('goToMiddle');
```
