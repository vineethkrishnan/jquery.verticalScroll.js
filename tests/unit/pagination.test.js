/**
 * Pagination tests for jQuery Vertical Scroll Plugin
 *
 * Covers pagination creation, click handling, active state updates,
 * and pagination:false option.
 */

describe('VerticalScroll - Pagination', function () {
    var $container;
    var originalAnimate;

    var HTML_FIXTURE = [
        '<div id="container" style="height:500px;overflow:hidden;">',
        '  <section id="s1" data-vs-label="First" style="height:500px;">Section 1</section>',
        '  <section id="s2" data-vs-label="Second" style="height:500px;">Section 2</section>',
        '  <section id="s3" data-vs-label="Third" style="height:500px;">Section 3</section>',
        '</div>'
    ].join('\n');

    beforeEach(function () {
        document.body.innerHTML = HTML_FIXTURE;
        $container = $('#container');

        originalAnimate = $.fn.animate;
        $.fn.animate = function (props, opts) {
            if (typeof opts === 'object' && typeof opts.complete === 'function') {
                opts.complete.call(this[0]);
            }
            return this;
        };
    });

    afterEach(function () {
        try {
            var inst = $container.data('plugin_verticalScroll');
            if (inst && inst.$sections) {
                $container.verticalScroll('destroy');
            }
        } catch (e) { /* already cleaned up */ }
        $.fn.animate = originalAnimate;
        document.body.innerHTML = '';
    });

    // ------------------------------------------------------------------
    // Pagination creation
    // ------------------------------------------------------------------

    test('should create pagination nav element when pagination is true', function () {
        $container.verticalScroll({ responsive: false, pagination: true });
        var $nav = $('.vs-pagination');
        expect($nav.length).toBe(1);
        expect($nav.prop('tagName').toLowerCase()).toBe('nav');
    });

    test('should create one pagination button per section', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');
        expect($buttons.length).toBe(3);
    });

    test('pagination buttons should have data-vs-target attribute', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');
        $buttons.each(function (i) {
            expect($(this).attr('data-vs-target')).toBe(String(i));
        });
    });

    test('should not create pagination when pagination option is false', function () {
        $container.verticalScroll({ responsive: false, pagination: false });
        var $nav = $('.vs-pagination');
        expect($nav.length).toBe(0);
    });

    // ------------------------------------------------------------------
    // Labels / tooltips
    // ------------------------------------------------------------------

    test('should use data-vs-label for tooltip text', function () {
        $container.verticalScroll({ responsive: false });
        var $tooltips = $('.vs-pagination-tooltip');
        expect($tooltips.eq(0).text()).toBe('First');
        expect($tooltips.eq(1).text()).toBe('Second');
        expect($tooltips.eq(2).text()).toBe('Third');
    });

    test('should fall back to "Section N" when no label attribute exists', function () {
        document.body.innerHTML = [
            '<div id="container" style="height:500px;overflow:hidden;">',
            '  <section style="height:500px;">A</section>',
            '  <section style="height:500px;">B</section>',
            '</div>'
        ].join('\n');
        $container = $('#container');

        $container.verticalScroll({ responsive: false });
        var $tooltips = $('.vs-pagination-tooltip');
        expect($tooltips.eq(0).text()).toBe('Section 1');
        expect($tooltips.eq(1).text()).toBe('Section 2');
    });

    // ------------------------------------------------------------------
    // Active state
    // ------------------------------------------------------------------

    test('first pagination button should be active initially', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');
        expect($buttons.eq(0).hasClass('vs-pagination-active')).toBe(true);
        expect($buttons.eq(1).hasClass('vs-pagination-active')).toBe(false);
        expect($buttons.eq(2).hasClass('vs-pagination-active')).toBe(false);
    });

    test('active class should move when navigating', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');

        var $buttons = $('.vs-pagination-button');
        expect($buttons.eq(0).hasClass('vs-pagination-active')).toBe(false);
        expect($buttons.eq(1).hasClass('vs-pagination-active')).toBe(true);
    });

    test('aria-current should update when active section changes', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');

        var $buttons = $('.vs-pagination-button');
        expect($buttons.eq(0).attr('aria-current')).toBeUndefined();
        expect($buttons.eq(1).attr('aria-current')).toBe('true');
    });

    // ------------------------------------------------------------------
    // Click handling
    // ------------------------------------------------------------------

    test('clicking a pagination button should navigate to that section', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');

        $buttons.eq(2).trigger('click');

        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });

    test('clicking the already active button should not error', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');

        expect(function () {
            $buttons.eq(0).trigger('click');
        }).not.toThrow();

        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // Pagination position
    // ------------------------------------------------------------------

    test('should apply paginationPosition as CSS property', function () {
        $container.verticalScroll({
            responsive: false,
            paginationPosition: 'left',
            paginationOffset: 30
        });
        var $nav = $('.vs-pagination');
        expect($nav.css('left')).toBe('30px');
    });

    test('default paginationPosition should be right', function () {
        $container.verticalScroll({ responsive: false });
        var $nav = $('.vs-pagination');
        expect($nav.css('right')).toBe('20px');
    });

    // ------------------------------------------------------------------
    // ARIA on pagination
    // ------------------------------------------------------------------

    test('pagination nav should have role=navigation', function () {
        $container.verticalScroll({ responsive: false });
        var $nav = $('.vs-pagination');
        expect($nav.attr('role')).toBe('navigation');
    });

    test('pagination nav should have aria-label', function () {
        $container.verticalScroll({ responsive: false });
        var $nav = $('.vs-pagination');
        expect($nav.attr('aria-label')).toBe('Section navigation');
    });

    test('pagination buttons should have aria-label with section label', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');
        expect($buttons.eq(0).attr('aria-label')).toBe('Go to First');
        expect($buttons.eq(1).attr('aria-label')).toBe('Go to Second');
    });
});
