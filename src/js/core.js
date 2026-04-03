/**
 * VerticalScroll constructor, initialization, and lifecycle methods
 */

import { DEFAULTS, DATA_KEY, EVENT_NAMESPACE, PLUGIN_NAME } from './constants.js';

// WeakMap for instance storage (in addition to $.data for backward compat)
var instances = new WeakMap();

/**
 * Get plugin instance for a DOM element
 * @param {HTMLElement} element
 * @returns {VerticalScroll|undefined}
 */
export function getInstance(element) {
    return instances.get(element);
}

/**
 * VerticalScroll Constructor
 * @param {HTMLElement} element - The container element
 * @param {Object} options - Configuration options
 * @param {Function} $ - jQuery reference
 */
export function VerticalScroll(element, options, $) {
    // Prevent double-initialization
    if (instances.has(element)) {
        console.warn('[VerticalScroll] Element is already initialized. Call destroy() first.');
        return instances.get(element);
    }

    this.$ = $;
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, DEFAULTS, options);
    this._defaults = DEFAULTS;
    this._name = PLUGIN_NAME;

    // Resolve window/document references
    this._window = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : window;
    this._document = this._window.document;

    // State
    this.sections = [];
    this.positions = [];
    this.currentIndex = 0;
    this.isScrolling = false;
    this.isEnabled = true;
    this.autoScrollTimer = null;
    this.touchStartY = 0;
    this.touchEndY = 0;

    // Cached elements
    this.$pagination = null;
    this.$sections = null;

    // Store instance
    instances.set(element, this);
    this.$element.data(DATA_KEY, this);

    this._init();
}

export var coreMethods = {
    /**
     * Initialize the plugin
     * @private
     */
    _init: function() {
        if (!this._checkResponsive()) {
            return;
        }

        this.$sections = this.$element.children(this.options.selector);

        if (this.$sections.length === 0) {
            console.warn('[VerticalScroll] No sections found with selector: ' + this.options.selector);
            return;
        }

        this._setupContainer();
        this._cacheSections();
        this._cachePositions();
        this._createPagination();
        this._bindEvents();
        this._setupAccessibility();

        this._updateActiveSection(false);

        if (this.options.autoScroll) {
            this._startAutoScroll();
        }

        this.$element.addClass('vs-initialized');

        this._trigger('onInit', [this.currentIndex, this.$sections.eq(this.currentIndex)]);
    },

    /**
     * Setup container styles
     * @private
     */
    _setupContainer: function() {
        this.$element.css({
            'position': 'relative',
            'overflow': 'hidden',
            'scroll-behavior': 'auto'
        });

        this.$element.addClass('vs-container vs-theme-' + this.options.theme);
        if (this.options.paginationAnimation && this.options.paginationAnimation !== 'none') {
            this.$element.addClass('vs-anim-' + this.options.paginationAnimation);
        }
    },

    /**
     * Cache section elements and data
     * @private
     */
    _cacheSections: function() {
        var $ = this.$;
        var self = this;

        this.sections = [];
        this.$sections.each(function(index) {
            var $section = $(this);

            $section
                .addClass('vs-section')
                .attr('data-vs-index', index);

            if (index === 0) {
                $section.addClass('vs-section-active');
            }

            self.sections.push({
                $el: $section,
                index: index,
                id: $section.attr('id') || null
            });
        });
    },

    /**
     * Cache section positions
     * @private
     */
    _cachePositions: function() {
        var $ = this.$;
        var self = this;
        this.positions = [];

        this.$sections.each(function() {
            var $section = $(this);
            var position = $section.position().top + self.$element.scrollTop();
            self.positions.push(Math.round(position));
        });
    },

    /**
     * Bind event handlers
     * @private
     */
    _bindEvents: function() {
        var $ = this.$;
        var self = this;

        if (this.$pagination) {
            this.$pagination.on('click' + EVENT_NAMESPACE, '.vs-pagination-button', function(e) {
                e.preventDefault();
                var index = parseInt($(this).attr('data-vs-target'), 10);
                self.scrollToSection(index);
            });
        }

        if (this.options.mouseWheel) {
            this.$element.on('wheel' + EVENT_NAMESPACE, $.proxy(this._onWheel, this));
            this.$element.on('mousewheel' + EVENT_NAMESPACE + ' DOMMouseScroll' + EVENT_NAMESPACE,
                $.proxy(this._onMouseWheel, this));
        }

        if (this.options.keyboard) {
            $(this._document).on('keydown' + EVENT_NAMESPACE + '.' + this._getInstanceId(),
                $.proxy(this._onKeydown, this));
        }

        if (this.options.touch) {
            this.$element.on('touchstart' + EVENT_NAMESPACE, $.proxy(this._onTouchStart, this));
            this.$element.on('touchmove' + EVENT_NAMESPACE, $.proxy(this._onTouchMove, this));
            this.$element.on('touchend' + EVENT_NAMESPACE, $.proxy(this._onTouchEnd, this));
        }

        $(this._window).on('resize' + EVENT_NAMESPACE + '.' + this._getInstanceId(),
            $.proxy(this._debounce(this._onResize, 250), this));

        if (this.options.autoScroll && this.options.pauseOnHover) {
            this.$element.on('mouseenter' + EVENT_NAMESPACE, $.proxy(this._pauseAutoScroll, this));
            this.$element.on('mouseleave' + EVENT_NAMESPACE, $.proxy(this._resumeAutoScroll, this));
        }

        this.$element.on('scroll' + EVENT_NAMESPACE,
            $.proxy(this._debounce(this._onScroll, 100), this));
    },

    /**
     * Handle scroll event
     * @private
     */
    _onScroll: function() {
        if (this.isScrolling) {
            return;
        }

        this._updateActiveSection(true);
    },

    /**
     * Handle window resize
     * @private
     */
    _onResize: function() {
        this._cachePositions();

        var wasEnabled = this.isEnabled;
        this.isEnabled = this._checkResponsive();

        if (wasEnabled !== this.isEnabled) {
            this.$element.toggleClass('vs-disabled', !this.isEnabled);
        }

        this._trigger('onResize', [this.isEnabled]);
    },

    /**
     * Update active section based on scroll position
     * @private
     * @param {boolean} triggerCallback
     */
    _updateActiveSection: function(triggerCallback) {
        var scrollTop = this.$element.scrollTop();
        var containerHeight = this.$element.height();
        var newIndex = this.currentIndex;

        for (var i = 0; i < this.positions.length; i++) {
            var sectionTop = this.positions[i];
            var sectionBottom = this.positions[i + 1] || (sectionTop + containerHeight);
            var sectionMid = sectionTop + (sectionBottom - sectionTop) / 2;

            if (scrollTop < sectionMid) {
                newIndex = i;
                break;
            }

            if (i === this.positions.length - 1) {
                newIndex = i;
            }
        }

        if (newIndex !== this.currentIndex) {
            var oldIndex = this.currentIndex;
            this.currentIndex = newIndex;
            this._updateUI(oldIndex, newIndex);

            if (triggerCallback) {
                this._trigger('onSectionChange', [newIndex, this.$sections.eq(newIndex), oldIndex]);
            }
        }
    },

    /**
     * Update options
     * @public
     * @param {Object} options - New options
     */
    setOptions: function(options) {
        var $ = this.$;
        var oldAnimation = this.options.paginationAnimation;
        var oldTheme = this.options.theme;

        $.extend(this.options, options);

        if (options.hasOwnProperty('autoScroll')) {
            if (options.autoScroll) {
                this._startAutoScroll();
            } else {
                this._stopAutoScroll();
            }
        }

        if (options.hasOwnProperty('paginationAnimation')) {
            this.$element.removeClass('vs-anim-' + oldAnimation);
            if (this.$pagination) {
                this.$pagination.removeClass('vs-anim-' + oldAnimation);
            }
            if (options.paginationAnimation && options.paginationAnimation !== 'none') {
                this.$element.addClass('vs-anim-' + options.paginationAnimation);
                if (this.$pagination) {
                    this.$pagination.addClass('vs-anim-' + options.paginationAnimation);
                }
            }
        }

        if (options.hasOwnProperty('theme')) {
            this.$element.removeClass('vs-theme-' + oldTheme);
            this.$element.addClass('vs-theme-' + options.theme);
            if (this.$pagination) {
                this.$pagination.removeClass('vs-theme-' + oldTheme);
                this.$pagination.addClass('vs-theme-' + options.theme);
            }
        }
    },

    /**
     * Refresh the plugin
     * @public
     */
    refresh: function() {
        this._cachePositions();
        this._updateActiveSection(false);
    },

    /**
     * Enable the plugin
     * @public
     */
    enable: function() {
        this.isEnabled = true;
        this.$element.removeClass('vs-disabled');

        if (this.options.autoScroll) {
            this._startAutoScroll();
        }
    },

    /**
     * Disable the plugin
     * @public
     */
    disable: function() {
        this.isEnabled = false;
        this.$element.addClass('vs-disabled');
        this._stopAutoScroll();
    },

    /**
     * Destroy the plugin instance
     * @public
     */
    destroy: function() {
        var $ = this.$;

        this._trigger('onDestroy');
        this._stopAutoScroll();

        this.$element.off(EVENT_NAMESPACE);
        $(this._document).off(EVENT_NAMESPACE + '.' + this._getInstanceId());
        $(this._window).off(EVENT_NAMESPACE + '.' + this._getInstanceId());

        if (this.$pagination) {
            this.$pagination.remove();
        }

        this.$element
            .removeClass('vs-container vs-initialized vs-disabled vs-theme-' + this.options.theme + ' vs-anim-' + this.options.paginationAnimation)
            .removeAttr('role aria-label')
            .css({
                'position': '',
                'overflow': '',
                'scroll-behavior': ''
            });

        if (this.$sections) {
            this.$sections
                .removeClass('vs-section vs-section-active')
                .removeAttr('data-vs-index role aria-label tabindex');
        }

        this.$element.removeData(DATA_KEY);
        instances.delete(this.element);
    }
};
