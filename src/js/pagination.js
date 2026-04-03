/**
 * Pagination rendering and UI update methods
 */

export var paginationMethods = {
    /**
     * Create pagination navigation
     * @private
     */
    _createPagination: function() {
        if (!this.options.pagination) {
            return;
        }

        var $ = this.$;
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
