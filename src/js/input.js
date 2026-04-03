/**
 * Input handlers: wheel, keyboard, and touch
 */

export var inputMethods = {
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
