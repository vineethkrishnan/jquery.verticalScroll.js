/**
 * Navigation methods: scroll to section, next, prev, etc.
 */

export var navigationMethods = {
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
