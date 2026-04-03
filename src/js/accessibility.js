/**
 * Accessibility setup and focus management
 */

export var accessibilityMethods = {
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
