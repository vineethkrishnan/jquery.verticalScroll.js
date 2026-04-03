/*!
 * jQuery Vertical Scroll Plugin
 * https://github.com/vineethkrishnan/jquery.verticalScroll.js
 *
 * @version 3.0.0-alpha.1
 * @author Vineeth Krishnan
 * @license MIT - http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2016-2026 Vineeth Krishnan
 */

import $ from 'jquery';
import { PLUGIN_NAME, DATA_KEY, DEFAULTS } from './constants.js';
import { VerticalScroll, coreMethods, getInstance } from './core.js';
import { utilsMethods } from './utils.js';
import { navigationMethods } from './navigation.js';
import { paginationMethods } from './pagination.js';
import { accessibilityMethods } from './accessibility.js';
import { inputMethods } from './input.js';
import { autoScrollMethods } from './auto-scroll.js';

// Assemble prototype from modules
VerticalScroll.prototype = Object.assign(
    { constructor: VerticalScroll },
    coreMethods,
    utilsMethods,
    navigationMethods,
    paginationMethods,
    accessibilityMethods,
    inputMethods,
    autoScrollMethods
);

/**
 * Register jQuery plugin
 * @param {Function} $ - jQuery
 */
function registerPlugin($) {
    $.fn[PLUGIN_NAME] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        var returnValue = this;

        this.each(function() {
            var $this = $(this);
            var instance = $this.data(DATA_KEY);

            // Initialize
            if (!instance) {
                if (typeof options === 'object' || !options) {
                    instance = new VerticalScroll(this, options, $);
                    $this.data(DATA_KEY, instance);
                }
            }

            // Method call
            if (typeof options === 'string' && instance) {
                if (options.charAt(0) === '_') {
                    console.warn('[VerticalScroll] Cannot call private method: ' + options);
                    return;
                }

                if (typeof instance[options] === 'function') {
                    var result = instance[options].apply(instance, args);

                    if (result !== undefined && result !== instance) {
                        returnValue = result;
                        return false;
                    }
                } else {
                    console.warn('[VerticalScroll] Method not found: ' + options);
                }
            }
        });

        return returnValue;
    };

    // Backward-compatible public API
    $.fn[PLUGIN_NAME].defaults = DEFAULTS;
    $.fn[PLUGIN_NAME].Constructor = VerticalScroll;
    $.fn[PLUGIN_NAME].getInstance = getInstance;
}

// Auto-register on the imported jQuery
registerPlugin($);

export { VerticalScroll, DEFAULTS, getInstance, registerPlugin };
