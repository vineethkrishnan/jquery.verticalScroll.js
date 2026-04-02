/*!
 * jQuery Vertical Scroll Plugin
 * https://github.com/vineethkrishnan/jquery.verticalScroll.js
 *
 * @version 2.0.0
 * @author Vineeth Krishnan
 * @license MIT - http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2016-2025 Vineeth Krishnan
 */

;(function(factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD (RequireJS)
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS / Node
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
})(function($) {
    'use strict';

    var window = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this;
    var document = window.document;

    /**
     * Plugin name and default settings
     */
    var PLUGIN_NAME = 'verticalScroll';
    var DATA_KEY = 'plugin_' + PLUGIN_NAME;
    var EVENT_NAMESPACE = '.' + PLUGIN_NAME;

    /**
     * Default configuration options
     */
    var DEFAULTS = {
        // Selectors
        selector: 'section',              // Selector for scrollable sections
        
        // Navigation
        pagination: true,                 // Show pagination dots
        paginationPosition: 'right',      // Position: 'left' or 'right'
        paginationOffset: 20,             // Offset from the edge in pixels
        
        // Scrolling behavior
        animationDuration: 800,           // Animation duration in ms
        easing: 'swing',                  // jQuery easing function
        scrollThreshold: 50,              // Minimum scroll delta to trigger section change
        touchThreshold: 50,               // Minimum touch delta to trigger section change
        
        // Input methods
        mouseWheel: true,                 // Enable mouse wheel navigation
        keyboard: true,                   // Enable keyboard navigation (arrow keys)
        touch: true,                      // Enable touch/swipe navigation
        
        // Behavior
        loop: false,                      // Loop back to first/last section
        autoScroll: false,                // Enable auto-scrolling
        autoScrollInterval: 5000,         // Auto-scroll interval in ms
        pauseOnHover: true,               // Pause auto-scroll on hover
        
        // Accessibility
        ariaLabels: true,                 // Add ARIA labels
        focusOnSection: true,             // Focus section after navigation
        
        // Responsive
        responsive: true,                 // Enable responsive behavior
        mobileBreakpoint: 768,            // Disable plugin below this width
        
        // Theming
        theme: 'default',                 // Theme: 'default','light','dark','minimal','neon','git-graph','sound-wave','diamond','arrow','pill','electric','line-connect','chain'
        paginationAnimation: 'pulse',     // Animation: 'none','pulse','glow','bounce','ripple','scale','fade-ring','rotate','morph','heartbeat','radar','neon-flicker','wave','diamond-spin','electric-zap','slide-in','chain-pop'
        
        // Callbacks
        onInit: null,                     // Called after initialization
        onDestroy: null,                  // Called after destruction
        onBeforeScroll: null,             // Called before scrolling (return false to cancel)
        onAfterScroll: null,              // Called after scroll animation completes
        onSectionChange: null,            // Called when active section changes
        onResize: null                    // Called on window resize
    };

    /**
     * VerticalScroll Constructor
     * @param {HTMLElement} element - The container element
     * @param {Object} options - Configuration options
     */
    function VerticalScroll(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, DEFAULTS, options);
        this._defaults = DEFAULTS;
        this._name = PLUGIN_NAME;
        
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

        // Store instance on element before init so callbacks can
        // call back into the plugin (e.g. getSectionCount in onInit)
        this.$element.data(DATA_KEY, this);

        this._init();
    }

    /**
     * VerticalScroll prototype methods
     */
    VerticalScroll.prototype = {
        /**
         * Initialize the plugin
         * @private
         */
        _init: function() {
            var self = this;
            
            // Check if we should enable on this viewport
            if (!this._checkResponsive()) {
                return;
            }
            
            // Cache sections
            this.$sections = this.$element.children(this.options.selector);
            
            if (this.$sections.length === 0) {
                console.warn('[VerticalScroll] No sections found with selector: ' + this.options.selector);
                return;
            }
            
            // Setup
            this._setupContainer();
            this._cacheSections();
            this._cachePositions();
            this._createPagination();
            this._bindEvents();
            this._setupAccessibility();
            
            // Determine initial section based on scroll position
            this._updateActiveSection(false);
            
            // Start auto-scroll if enabled
            if (this.options.autoScroll) {
                this._startAutoScroll();
            }
            
            // Mark as initialized
            this.$element.addClass('vs-initialized');
            
            // Callback
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
                'scroll-behavior': 'auto' // Disable native smooth scroll
            });
            
            // Add theme and animation classes
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
            var self = this;
            
            this.sections = [];
            this.$sections.each(function(index) {
                var $section = $(this);
                
                // Add data attributes and classes
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
            var self = this;
            this.positions = [];
            
            this.$sections.each(function() {
                var $section = $(this);
                var position = $section.position().top + self.$element.scrollTop();
                self.positions.push(Math.round(position));
            });
        },

        /**
         * Create pagination navigation
         * @private
         */
        _createPagination: function() {
            if (!this.options.pagination) {
                return;
            }
            
            var self = this;
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
            // (pagination lives on body, not inside the container)
            this.$pagination.addClass('vs-theme-' + this.options.theme);
            if (this.options.paginationAnimation && this.options.paginationAnimation !== 'none') {
                this.$pagination.addClass('vs-anim-' + this.options.paginationAnimation);
            }

            $(document.body).append(this.$pagination);
        },

        /**
         * Bind event handlers
         * @private
         */
        _bindEvents: function() {
            var self = this;
            
            // Pagination click
            if (this.$pagination) {
                this.$pagination.on('click' + EVENT_NAMESPACE, '.vs-pagination-button', function(e) {
                    e.preventDefault();
                    var index = parseInt($(this).attr('data-vs-target'), 10);
                    self.scrollToSection(index);
                });
            }
            
            // Mouse wheel
            if (this.options.mouseWheel) {
                this.$element.on('wheel' + EVENT_NAMESPACE, $.proxy(this._onWheel, this));
                // Legacy support
                this.$element.on('mousewheel' + EVENT_NAMESPACE + ' DOMMouseScroll' + EVENT_NAMESPACE, 
                    $.proxy(this._onMouseWheel, this));
            }
            
            // Keyboard navigation
            if (this.options.keyboard) {
                $(document).on('keydown' + EVENT_NAMESPACE + '.' + this._getInstanceId(), 
                    $.proxy(this._onKeydown, this));
            }
            
            // Touch events
            if (this.options.touch) {
                this.$element.on('touchstart' + EVENT_NAMESPACE, $.proxy(this._onTouchStart, this));
                this.$element.on('touchmove' + EVENT_NAMESPACE, $.proxy(this._onTouchMove, this));
                this.$element.on('touchend' + EVENT_NAMESPACE, $.proxy(this._onTouchEnd, this));
            }
            
            // Window resize
            $(window).on('resize' + EVENT_NAMESPACE + '.' + this._getInstanceId(), 
                $.proxy(this._debounce(this._onResize, 250), this));
            
            // Auto-scroll pause on hover
            if (this.options.autoScroll && this.options.pauseOnHover) {
                this.$element.on('mouseenter' + EVENT_NAMESPACE, $.proxy(this._pauseAutoScroll, this));
                this.$element.on('mouseleave' + EVENT_NAMESPACE, $.proxy(this._resumeAutoScroll, this));
            }
            
            // Native scroll event for tracking
            this.$element.on('scroll' + EVENT_NAMESPACE, 
                $.proxy(this._debounce(this._onScroll, 100), this));
        },

        /**
         * Setup accessibility attributes
         * @private
         */
        _setupAccessibility: function() {
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
            if (!this.isEnabled || this.isScrolling) {
                return;
            }
            
            // Only handle if element or child is focused, or no specific element is focused
            var $focused = $(document.activeElement);
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
            
            // Prevent default scrolling during touch
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
            // Re-cache positions
            this._cachePositions();
            
            // Check responsive
            var wasEnabled = this.isEnabled;
            this.isEnabled = this._checkResponsive();
            
            if (wasEnabled !== this.isEnabled) {
                this.$element.toggleClass('vs-disabled', !this.isEnabled);
            }
            
            // Callback
            this._trigger('onResize', [this.isEnabled]);
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
            
            return $(window).width() >= this.options.mobileBreakpoint;
        },

        /**
         * Update active section based on scroll position
         * @private
         * @param {boolean} triggerCallback - Whether to trigger callback
         */
        _updateActiveSection: function(triggerCallback) {
            var scrollTop = this.$element.scrollTop();
            var containerHeight = this.$element.height();
            var newIndex = this.currentIndex;
            
            // Find the section that occupies most of the viewport
            for (var i = 0; i < this.positions.length; i++) {
                var sectionTop = this.positions[i];
                var sectionBottom = this.positions[i + 1] || (sectionTop + containerHeight);
                var sectionMid = sectionTop + (sectionBottom - sectionTop) / 2;
                
                if (scrollTop < sectionMid) {
                    newIndex = i;
                    break;
                }
                
                // Default to last section
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
        },

        /**
         * Scroll to a specific section
         * @public
         * @param {number} index - Section index
         * @param {boolean} [animate=true] - Whether to animate
         * @returns {jQuery.Deferred}
         */
        scrollToSection: function(index, animate) {
            var self = this;
            var deferred = $.Deferred();
            
            // Validate index
            if (index < 0 || index >= this.sections.length) {
                return deferred.reject('Invalid section index').promise();
            }
            
            // Check if already at target
            if (index === this.currentIndex && !this.isScrolling) {
                return deferred.resolve().promise();
            }
            
            // Before scroll callback
            var shouldScroll = this._trigger('onBeforeScroll', [index, this.$sections.eq(index), this.currentIndex]);
            if (shouldScroll === false) {
                return deferred.reject('Scroll cancelled').promise();
            }
            
            var oldIndex = this.currentIndex;
            this.currentIndex = index;
            this.isScrolling = true;
            
            // Update UI immediately
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
         * Focus section for accessibility
         * @private
         * @param {number} index - Section index
         */
        _focusSection: function(index) {
            if (!this.options.focusOnSection) {
                return;
            }
            
            var $section = this.$sections.eq(index);
            
            // Make section focusable if it isn't already
            if (!$section.attr('tabindex')) {
                $section.attr('tabindex', '-1');
            }
            
            $section.focus();
        },

        /**
         * Navigate to next section
         * @public
         * @returns {jQuery.Deferred}
         */
        next: function() {
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

            // Fade out → jump → fade in
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
        },

        /**
         * Refresh the plugin (recalculate positions, etc.)
         * @public
         */
        refresh: function() {
            this._cachePositions();
            this._updateActiveSection(false);
        },

        /**
         * Update options
         * @public
         * @param {Object} options - New options
         */
        setOptions: function(options) {
            var oldAnimation = this.options.paginationAnimation;
            var oldTheme = this.options.theme;

            $.extend(this.options, options);

            // Handle auto-scroll changes
            if (options.hasOwnProperty('autoScroll')) {
                if (options.autoScroll) {
                    this._startAutoScroll();
                } else {
                    this._stopAutoScroll();
                }
            }

            // Handle animation changes
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

            // Handle theme changes
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
         * Destroy the plugin instance
         * @public
         */
        destroy: function() {
            // Callback
            this._trigger('onDestroy');
            
            // Stop auto-scroll
            this._stopAutoScroll();
            
            // Unbind events
            this.$element.off(EVENT_NAMESPACE);
            $(document).off(EVENT_NAMESPACE + '.' + this._getInstanceId());
            $(window).off(EVENT_NAMESPACE + '.' + this._getInstanceId());
            
            // Remove pagination
            if (this.$pagination) {
                this.$pagination.remove();
            }
            
            // Remove classes and attributes
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
            
            // Remove data
            this.$element.removeData(DATA_KEY);
        },

        /**
         * Trigger a callback
         * @private
         * @param {string} name - Callback name
         * @param {Array} args - Arguments to pass
         * @returns {*} Callback return value
         */
        _trigger: function(name, args) {
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
        }
    };

    /**
     * jQuery plugin definition
     * @param {Object|string} options - Options object or method name
     * @returns {jQuery}
     */
    $.fn[PLUGIN_NAME] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        var returnValue = this;
        
        this.each(function() {
            var $this = $(this);
            var instance = $this.data(DATA_KEY);
            
            // Initialize
            if (!instance) {
                if (typeof options === 'object' || !options) {
                    instance = new VerticalScroll(this, options);
                    // Store early so callbacks during _init can call back into the plugin
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
                    
                    // Return value for getters
                    if (result !== undefined && result !== instance) {
                        returnValue = result;
                        return false; // Break the each loop
                    }
                } else {
                    console.warn('[VerticalScroll] Method not found: ' + options);
                }
            }
        });
        
        return returnValue;
    };

    /**
     * Get default options
     */
    $.fn[PLUGIN_NAME].defaults = DEFAULTS;

    /**
     * Constructor for external access
     */
    $.fn[PLUGIN_NAME].Constructor = VerticalScroll;

});
