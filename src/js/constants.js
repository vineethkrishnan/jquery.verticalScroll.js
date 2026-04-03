/**
 * Plugin constants and default configuration
 */

export var PLUGIN_NAME = 'verticalScroll';
export var DATA_KEY = 'plugin_' + PLUGIN_NAME;
export var EVENT_NAMESPACE = '.' + PLUGIN_NAME;

export var DEFAULTS = {
    // Selectors
    selector: 'section',

    // Navigation
    pagination: true,
    paginationPosition: 'right',
    paginationOffset: 20,

    // Scrolling behavior
    animationDuration: 800,
    easing: 'swing',
    scrollThreshold: 50,
    touchThreshold: 50,

    // Input methods
    mouseWheel: true,
    keyboard: true,
    touch: true,

    // Behavior
    loop: false,
    autoScroll: false,
    autoScrollInterval: 5000,
    pauseOnHover: true,

    // Accessibility
    ariaLabels: true,
    focusOnSection: true,

    // Responsive
    responsive: true,
    mobileBreakpoint: 768,

    // Theming
    theme: 'default',
    paginationAnimation: 'pulse',

    // Callbacks
    onInit: null,
    onDestroy: null,
    onBeforeScroll: null,
    onAfterScroll: null,
    onSectionChange: null,
    onResize: null
};
