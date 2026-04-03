/**
 * Auto-scroll timer management
 */

export var autoScrollMethods = {
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
