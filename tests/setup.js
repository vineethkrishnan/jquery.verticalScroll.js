/**
 * Jest test setup for jQuery Vertical Scroll Plugin
 *
 * Loads jQuery into the jsdom global scope and then loads the built plugin
 * so that $.fn.verticalScroll is available in every test file.
 */

const $ = require('jquery');

// Expose jQuery and $ globally so the plugin UMD wrapper picks them up
global.jQuery = $;
global.$ = $;

// jsdom reports 0 for all viewport dimensions by default.
// jQuery's $(window).width() reads document.documentElement.clientWidth,
// so we need to stub that for the responsive check to pass.
Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 });
Object.defineProperty(document.documentElement, 'clientWidth', { writable: true, configurable: true, value: 1024 });
Object.defineProperty(document.documentElement, 'clientHeight', { writable: true, configurable: true, value: 768 });

// Load the built plugin (UMD format auto-registers on global jQuery)
require('../dist/js/jquery.verticalscroll.js');
