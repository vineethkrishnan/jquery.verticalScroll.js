/*! @vineethnkrishnan/jquery.verticalscroll | Vineeth N Krishnan | MIT Licensed */
import $ from 'jquery';

/**
 * Plugin constants and default configuration
 */

var PLUGIN_NAME = 'verticalScroll';
var DATA_KEY = 'plugin_' + PLUGIN_NAME;
var EVENT_NAMESPACE = '.' + PLUGIN_NAME;

var DEFAULTS = {
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

/**
 * VerticalScroll constructor, initialization, and lifecycle methods
 */


// WeakMap for instance storage (in addition to $.data for backward compat)
var instances = new WeakMap();

/**
 * Get plugin instance for a DOM element
 * @param {HTMLElement} element
 * @returns {VerticalScroll|undefined}
 */
function getInstance(element) {
    return instances.get(element);
}

/**
 * VerticalScroll Constructor
 * @param {HTMLElement} element - The container element
 * @param {Object} options - Configuration options
 * @param {Function} $ - jQuery reference
 */
function VerticalScroll(element, options, $) {
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

var coreMethods = {
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

/**
 * Utility methods mixed into VerticalScroll.prototype
 */


var utilsMethods = {
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

/**
 * Navigation methods: scroll to section, next, prev, etc.
 */

var navigationMethods = {
    /**
     * Scroll to a specific section
     * @public
     * @param {number} index - Section index
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {jQuery.Deferred}
     */
    scrollToSection: function(index, animate) {
        var $ = this.$;
        var self = this;
        var deferred = $.Deferred();

        if (index < 0 || index >= this.sections.length) {
            return deferred.reject('Invalid section index').promise();
        }

        if (index === this.currentIndex && !this.isScrolling) {
            return deferred.resolve().promise();
        }

        var shouldScroll = this._trigger('onBeforeScroll', [index, this.$sections.eq(index), this.currentIndex]);
        if (shouldScroll === false) {
            return deferred.reject('Scroll cancelled').promise();
        }

        var oldIndex = this.currentIndex;
        this.currentIndex = index;
        this.isScrolling = true;

        this._updateUI(oldIndex, index);

        var targetPosition = this.positions[index];
        var shouldAnimate = animate !== false && this.options.animationDuration > 0;

        if (shouldAnimate) {
            this.$element.stop().animate(
                { scrollTop: targetPosition },
                {
                    duration: this.options.animationDuration,
                    easing: this.options.easing,
                    complete: function() {
                        self.isScrolling = false;
                        self._focusSection(index);
                        self._trigger('onAfterScroll', [index, self.$sections.eq(index), oldIndex]);
                        deferred.resolve();
                    }
                }
            );
        } else {
            this.$element.scrollTop(targetPosition);
            this.isScrolling = false;
            this._focusSection(index);
            this._trigger('onAfterScroll', [index, this.$sections.eq(index), oldIndex]);
            deferred.resolve();
        }

        return deferred.promise();
    },

    /**
     * Navigate to next section
     * @public
     * @returns {jQuery.Deferred}
     */
    next: function() {
        var $ = this.$;
        var nextIndex = this.currentIndex + 1;

        if (nextIndex >= this.sections.length) {
            if (this.options.loop) {
                return this._loopTo(0);
            } else {
                return $.Deferred().reject('Already at last section').promise();
            }
        }

        return this.scrollToSection(nextIndex);
    },

    /**
     * Navigate to previous section
     * @public
     * @returns {jQuery.Deferred}
     */
    prev: function() {
        var $ = this.$;
        var prevIndex = this.currentIndex - 1;

        if (prevIndex < 0) {
            if (this.options.loop) {
                return this._loopTo(this.sections.length - 1);
            } else {
                return $.Deferred().reject('Already at first section').promise();
            }
        }

        return this.scrollToSection(prevIndex);
    },

    /**
     * Loop transition — fade out, jump, fade in
     * @private
     * @param {number} index - Target section index
     * @returns {jQuery.Deferred}
     */
    _loopTo: function(index) {
        var $ = this.$;
        var self = this;
        var deferred = $.Deferred();

        var shouldScroll = this._trigger('onBeforeScroll', [index, this.$sections.eq(index), this.currentIndex]);
        if (shouldScroll === false) {
            return deferred.reject('Scroll cancelled').promise();
        }

        var oldIndex = this.currentIndex;
        this.currentIndex = index;
        this.isScrolling = true;

        this._updateUI(oldIndex, index);

        var duration = Math.min(this.options.animationDuration, 500);

        this.$element.animate({ opacity: 0 }, {
            duration: duration / 2,
            easing: this.options.easing,
            complete: function() {
                self.$element.scrollTop(self.positions[index]);
                self.$element.animate({ opacity: 1 }, {
                    duration: duration / 2,
                    easing: self.options.easing,
                    complete: function() {
                        self.isScrolling = false;
                        self._focusSection(index);
                        self._trigger('onAfterScroll', [index, self.$sections.eq(index), oldIndex]);
                        deferred.resolve();
                    }
                });
            }
        });

        return deferred.promise();
    },

    /**
     * Scroll to section by ID
     * @public
     * @param {string} id - Section ID (with or without #)
     * @returns {jQuery.Deferred}
     */
    scrollToId: function(id) {
        var $ = this.$;
        id = id.replace(/^#/, '');
        var $target = this.$sections.filter('#' + id);

        if ($target.length === 0) {
            return $.Deferred().reject('Section not found: ' + id).promise();
        }

        return this.scrollToSection(this.$sections.index($target));
    },

    /**
     * Get current section index
     * @public
     * @returns {number}
     */
    getCurrentIndex: function() {
        return this.currentIndex;
    },

    /**
     * Get current section element
     * @public
     * @returns {jQuery}
     */
    getCurrentSection: function() {
        return this.$sections.eq(this.currentIndex);
    },

    /**
     * Get all sections
     * @public
     * @returns {jQuery}
     */
    getSections: function() {
        return this.$sections;
    },

    /**
     * Get total number of sections
     * @public
     * @returns {number}
     */
    getSectionCount: function() {
        return this.sections.length;
    }
};

/**
 * Pagination rendering and UI update methods
 */

var paginationMethods = {
    /**
     * Create pagination navigation
     * @private
     */
    _createPagination: function() {
        if (!this.options.pagination) {
            return;
        }

        var $ = this.$;
        var html = '<nav class="vs-pagination" role="navigation" aria-label="Section navigation">';
        html += '<ul class="vs-pagination-list">';

        this.$sections.each(function(index) {
            var $section = $(this);
            var label = $section.attr('data-vs-label') ||
                       $section.attr('data-title') ||
                       'Section ' + (index + 1);
            var activeClass = index === 0 ? ' vs-pagination-active' : '';

            html += '<li class="vs-pagination-item">';
            html += '<button type="button" class="vs-pagination-button' + activeClass + '" ';
            html += 'data-vs-target="' + index + '" ';
            html += 'aria-label="Go to ' + label + '"';
            if (index === 0) {
                html += ' aria-current="true"';
            }
            html += '>';
            html += '<span class="vs-pagination-dot"></span>';
            html += '<span class="vs-pagination-tooltip">' + label + '</span>';
            html += '</button>';
            html += '</li>';
        });

        html += '</ul>';
        html += '</nav>';

        this.$pagination = $(html);

        // Position pagination — fixed to viewport
        this.$pagination.css(this.options.paginationPosition, this.options.paginationOffset + 'px');

        // Apply theme and animation classes to pagination
        this.$pagination.addClass('vs-theme-' + this.options.theme);
        if (this.options.paginationAnimation && this.options.paginationAnimation !== 'none') {
            this.$pagination.addClass('vs-anim-' + this.options.paginationAnimation);
        }

        $(this._document.body).append(this.$pagination);
    },

    /**
     * Update UI elements (pagination, section classes)
     * @private
     * @param {number} oldIndex - Previous section index
     * @param {number} newIndex - New section index
     */
    _updateUI: function(oldIndex, newIndex) {
        // Update sections
        this.$sections.eq(oldIndex).removeClass('vs-section-active');
        this.$sections.eq(newIndex).addClass('vs-section-active');

        // Update pagination
        if (this.$pagination) {
            var $buttons = this.$pagination.find('.vs-pagination-button');
            $buttons.removeClass('vs-pagination-active').removeAttr('aria-current');
            $buttons.eq(newIndex).addClass('vs-pagination-active').attr('aria-current', 'true');
        }
    }
};

/**
 * Accessibility setup and focus management
 */

var accessibilityMethods = {
    /**
     * Setup accessibility attributes
     * @private
     */
    _setupAccessibility: function() {
        var $ = this.$;

        if (!this.options.ariaLabels) {
            return;
        }

        this.$element.attr({
            'role': 'region',
            'aria-label': 'Vertical scrolling content'
        });

        this.$sections.each(function(index) {
            $(this).attr({
                'role': 'group',
                'aria-label': $(this).attr('data-vs-label') || 'Section ' + (index + 1)
            });
        });
    },

    /**
     * Focus section for accessibility
     * @private
     * @param {number} index - Section index
     */
    _focusSection: function(index) {
        if (!this.options.focusOnSection) {
            return;
        }

        var $section = this.$sections.eq(index);

        if (!$section.attr('tabindex')) {
            $section.attr('tabindex', '-1');
        }

        $section.focus();
    }
};

/**
 * Input handlers: wheel, keyboard, and touch
 */

var inputMethods = {
    /**
     * Handle wheel event (modern browsers)
     * @private
     * @param {Event} e - Wheel event
     */
    _onWheel: function(e) {
        if (!this.isEnabled || this.isScrolling) {
            e.preventDefault();
            return;
        }

        var delta = e.originalEvent.deltaY;

        if (Math.abs(delta) < this.options.scrollThreshold) {
            return;
        }

        e.preventDefault();

        if (delta > 0) {
            this.next();
        } else {
            this.prev();
        }
    },

    /**
     * Handle legacy mouse wheel event
     * @private
     * @param {Event} e - Mouse wheel event
     */
    _onMouseWheel: function(e) {
        if (!this.isEnabled || this.isScrolling) {
            e.preventDefault();
            return;
        }

        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;

        if (Math.abs(delta) < this.options.scrollThreshold) {
            return;
        }

        e.preventDefault();

        if (delta < 0) {
            this.next();
        } else {
            this.prev();
        }
    },

    /**
     * Handle keydown event
     * @private
     * @param {Event} e - Keydown event
     */
    _onKeydown: function(e) {
        var $ = this.$;

        if (!this.isEnabled || this.isScrolling) {
            return;
        }

        var $focused = $(this._document.activeElement);
        var shouldHandle = $focused.is('body') ||
                          this.$element.is($focused) ||
                          this.$element.find($focused).length > 0;

        if (!shouldHandle) {
            return;
        }

        switch (e.keyCode) {
            case 38: // Up arrow
            case 33: // Page Up
                e.preventDefault();
                this.prev();
                break;
            case 40: // Down arrow
            case 34: // Page Down
                e.preventDefault();
                this.next();
                break;
            case 36: // Home
                e.preventDefault();
                this.scrollToSection(0);
                break;
            case 35: // End
                e.preventDefault();
                this.scrollToSection(this.sections.length - 1);
                break;
        }
    },

    /**
     * Handle touch start
     * @private
     * @param {Event} e - Touch event
     */
    _onTouchStart: function(e) {
        if (!this.isEnabled) {
            return;
        }

        this.touchStartY = e.originalEvent.touches[0].clientY;
        this.touchEndY = this.touchStartY;
    },

    /**
     * Handle touch move
     * @private
     * @param {Event} e - Touch event
     */
    _onTouchMove: function(e) {
        if (!this.isEnabled) {
            return;
        }

        this.touchEndY = e.originalEvent.touches[0].clientY;

        if (this.isScrolling) {
            e.preventDefault();
        }
    },

    /**
     * Handle touch end
     * @private
     * @param {Event} e - Touch event
     */
    _onTouchEnd: function(e) {
        if (!this.isEnabled || this.isScrolling) {
            return;
        }

        var delta = this.touchStartY - this.touchEndY;

        if (Math.abs(delta) < this.options.touchThreshold) {
            return;
        }

        if (delta > 0) {
            this.next();
        } else {
            this.prev();
        }
    }
};

/**
 * Auto-scroll timer management
 */

var autoScrollMethods = {
    /**
     * Start auto-scrolling
     * @private
     */
    _startAutoScroll: function() {
        var self = this;

        this._stopAutoScroll();

        this.autoScrollTimer = setInterval(function() {
            if (self.isEnabled && !self.isScrolling) {
                if (self.currentIndex >= self.sections.length - 1) {
                    if (self.options.loop) {
                        self.scrollToSection(0);
                    } else {
                        self._stopAutoScroll();
                    }
                } else {
                    self.next();
                }
            }
        }, this.options.autoScrollInterval);
    },

    /**
     * Stop auto-scrolling
     * @private
     */
    _stopAutoScroll: function() {
        if (this.autoScrollTimer) {
            clearInterval(this.autoScrollTimer);
            this.autoScrollTimer = null;
        }
    },

    /**
     * Pause auto-scrolling (temporarily)
     * @private
     */
    _pauseAutoScroll: function() {
        this._stopAutoScroll();
    },

    /**
     * Resume auto-scrolling
     * @private
     */
    _resumeAutoScroll: function() {
        if (this.options.autoScroll && this.isEnabled) {
            this._startAutoScroll();
        }
    }
};

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

export { DEFAULTS, VerticalScroll, getInstance, registerPlugin };
//# sourceMappingURL=jquery.verticalscroll.esm.js.map
