/**
 * Utility methods mixed into VerticalScroll.prototype
 */

import { PLUGIN_NAME } from './constants.js';

export var utilsMethods = {
    /**
     * Trigger a callback
     * @private
     * @param {string} name - Callback name
     * @param {Array} args - Arguments to pass
     * @returns {*} Callback return value
     */
    _trigger: function(name, args) {
        var $ = this.$;
        var callback = this.options[name];

        if (typeof callback === 'function') {
            return callback.apply(this.element, args || []);
        }

        // Also trigger as jQuery event
        var eventName = name.replace(/^on/, '').toLowerCase();
        var event = $.Event(PLUGIN_NAME + ':' + eventName);
        this.$element.trigger(event, args);

        return !event.isDefaultPrevented();
    },

    /**
     * Get unique instance ID
     * @private
     * @returns {string}
     */
    _getInstanceId: function() {
        if (!this._instanceId) {
            this._instanceId = PLUGIN_NAME + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this._instanceId;
    },

    /**
     * Debounce helper
     * @private
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function}
     */
    _debounce: function(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    },

    /**
     * Check if plugin should be enabled based on viewport
     * @private
     * @returns {boolean}
     */
    _checkResponsive: function() {
        if (!this.options.responsive) {
            return true;
        }

        return this.$(this._window).width() >= this.options.mobileBreakpoint;
    }
};
