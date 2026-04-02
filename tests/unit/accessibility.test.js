/**
 * Accessibility tests for jQuery Vertical Scroll Plugin
 *
 * Covers ARIA attributes on container/sections, focus management,
 * and ariaLabels option.
 */

describe('VerticalScroll - Accessibility', function () {
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
    // Container ARIA
    // ------------------------------------------------------------------

    test('container should have role="region"', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.attr('role')).toBe('region');
    });

    test('container should have aria-label', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.attr('aria-label')).toBe('Vertical scrolling content');
    });

    // ------------------------------------------------------------------
    // Section ARIA
    // ------------------------------------------------------------------

    test('sections should have role="group"', function () {
        $container.verticalScroll({ responsive: false });
        $container.children('section').each(function () {
            expect($(this).attr('role')).toBe('group');
        });
    });

    test('sections should have aria-label from data-vs-label', function () {
        $container.verticalScroll({ responsive: false });
        var $sections = $container.children('section');
        expect($sections.eq(0).attr('aria-label')).toBe('First');
        expect($sections.eq(1).attr('aria-label')).toBe('Second');
        expect($sections.eq(2).attr('aria-label')).toBe('Third');
    });

    test('sections without data-vs-label should get fallback aria-label', function () {
        document.body.innerHTML = [
            '<div id="container" style="height:500px;overflow:hidden;">',
            '  <section style="height:500px;">A</section>',
            '  <section style="height:500px;">B</section>',
            '</div>'
        ].join('\n');
        $container = $('#container');

        $container.verticalScroll({ responsive: false });
        var $sections = $container.children('section');
        expect($sections.eq(0).attr('aria-label')).toBe('Section 1');
        expect($sections.eq(1).attr('aria-label')).toBe('Section 2');
    });

    // ------------------------------------------------------------------
    // ariaLabels option disabled
    // ------------------------------------------------------------------

    test('ariaLabels:false should skip ARIA attributes on container', function () {
        $container.verticalScroll({ responsive: false, ariaLabels: false });
        expect($container.attr('role')).toBeUndefined();
        expect($container.attr('aria-label')).toBeUndefined();
    });

    test('ariaLabels:false should skip ARIA role on sections', function () {
        $container.verticalScroll({ responsive: false, ariaLabels: false });
        $container.children('section').each(function () {
            expect($(this).attr('role')).toBeUndefined();
        });
    });

    // ------------------------------------------------------------------
    // Focus management
    // ------------------------------------------------------------------

    test('navigating should set tabindex=-1 on target section', function () {
        $container.verticalScroll({ responsive: false, focusOnSection: true });
        $container.verticalScroll('next');

        var $section = $container.children('section').eq(1);
        expect($section.attr('tabindex')).toBe('-1');
    });

    test('navigating should call focus on target section', function () {
        $container.verticalScroll({ responsive: false, focusOnSection: true });

        // Get the actual section element that the plugin will focus
        var instance = $container.data('plugin_verticalScroll');
        var sectionEl = instance.$sections.eq(1)[0];
        var focusSpy = jest.spyOn(sectionEl, 'focus').mockImplementation(function () {});

        $container.verticalScroll('next');

        expect(focusSpy).toHaveBeenCalled();
        focusSpy.mockRestore();
    });

    test('focusOnSection:false should not set tabindex on section', function () {
        $container.verticalScroll({ responsive: false, focusOnSection: false });
        $container.verticalScroll('next');

        var $section = $container.children('section').eq(1);
        // tabindex should not be set when focusOnSection is false
        expect($section.attr('tabindex')).toBeUndefined();
    });

    // ------------------------------------------------------------------
    // Pagination ARIA
    // ------------------------------------------------------------------

    test('pagination buttons should have aria-label with section name', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');
        expect($buttons.eq(0).attr('aria-label')).toBe('Go to First');
        expect($buttons.eq(1).attr('aria-label')).toBe('Go to Second');
        expect($buttons.eq(2).attr('aria-label')).toBe('Go to Third');
    });

    test('active pagination button should have aria-current="true"', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');
        expect($buttons.eq(0).attr('aria-current')).toBe('true');
        expect($buttons.eq(1).attr('aria-current')).toBeUndefined();
    });

    test('aria-current should move when section changes', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');

        var $buttons = $('.vs-pagination-button');
        expect($buttons.eq(0).attr('aria-current')).toBeUndefined();
        expect($buttons.eq(1).attr('aria-current')).toBe('true');
    });

    // ------------------------------------------------------------------
    // Pagination nav element accessibility
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

    // ------------------------------------------------------------------
    // Pagination buttons are actual buttons
    // ------------------------------------------------------------------

    test('pagination dots should be <button> elements for keyboard access', function () {
        $container.verticalScroll({ responsive: false });
        var $buttons = $('.vs-pagination-button');
        $buttons.each(function () {
            expect(this.tagName.toLowerCase()).toBe('button');
            expect($(this).attr('type')).toBe('button');
        });
    });

    // ------------------------------------------------------------------
    // Destroy removes accessibility attributes
    // ------------------------------------------------------------------

    test('destroy should remove ARIA attributes from container and sections', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        expect($container.attr('role')).toBeUndefined();
        expect($container.attr('aria-label')).toBeUndefined();

        $container.children('section').each(function () {
            expect($(this).attr('role')).toBeUndefined();
            expect($(this).attr('aria-label')).toBeUndefined();
            expect($(this).attr('tabindex')).toBeUndefined();
        });
    });
});
