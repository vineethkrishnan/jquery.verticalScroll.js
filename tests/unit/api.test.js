/**
 * API tests for jQuery Vertical Scroll Plugin
 *
 * Covers getCurrentIndex, getCurrentSection, getSections, getSectionCount,
 * enable, disable, refresh.
 */

describe('VerticalScroll - Public API', function () {
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
    // getCurrentIndex
    // ------------------------------------------------------------------

    test('getCurrentIndex() should return 0 initially', function () {
        $container.verticalScroll({ responsive: false });
        var idx = $container.verticalScroll('getCurrentIndex');
        expect(idx).toBe(0);
    });

    test('getCurrentIndex() should return updated index after navigation', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);
    });

    // ------------------------------------------------------------------
    // getCurrentSection
    // ------------------------------------------------------------------

    test('getCurrentSection() should return a jQuery object', function () {
        $container.verticalScroll({ responsive: false });
        var $section = $container.verticalScroll('getCurrentSection');
        expect($section).toBeDefined();
        expect($section instanceof $).toBe(true);
    });

    test('getCurrentSection() should return the active section element', function () {
        $container.verticalScroll({ responsive: false });
        var $section = $container.verticalScroll('getCurrentSection');
        expect($section.attr('id')).toBe('s1');

        $container.verticalScroll('next');
        $section = $container.verticalScroll('getCurrentSection');
        expect($section.attr('id')).toBe('s2');
    });

    // ------------------------------------------------------------------
    // getSections
    // ------------------------------------------------------------------

    test('getSections() should return all section elements', function () {
        $container.verticalScroll({ responsive: false });
        var $sections = $container.verticalScroll('getSections');
        expect($sections.length).toBe(3);
    });

    test('getSections() should return a jQuery collection', function () {
        $container.verticalScroll({ responsive: false });
        var $sections = $container.verticalScroll('getSections');
        expect($sections instanceof $).toBe(true);
    });

    // ------------------------------------------------------------------
    // getSectionCount
    // ------------------------------------------------------------------

    test('getSectionCount() should return the number of sections', function () {
        $container.verticalScroll({ responsive: false });
        var count = $container.verticalScroll('getSectionCount');
        expect(count).toBe(3);
    });

    test('getSectionCount() should return 0 when no sections exist', function () {
        document.body.innerHTML = '<div id="container" style="height:500px;overflow:hidden;"></div>';
        $container = $('#container');
        jest.spyOn(console, 'warn').mockImplementation(function () {});

        $container.verticalScroll({ responsive: false });
        var count = $container.verticalScroll('getSectionCount');
        expect(count).toBe(0);

        console.warn.mockRestore();
    });

    // ------------------------------------------------------------------
    // enable / disable
    // ------------------------------------------------------------------

    test('disable() should set isEnabled to false', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('disable');

        var instance = $container.data('plugin_verticalScroll');
        expect(instance.isEnabled).toBe(false);
    });

    test('disable() should add vs-disabled class', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('disable');
        expect($container.hasClass('vs-disabled')).toBe(true);
    });

    test('enable() should set isEnabled to true', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('disable');
        $container.verticalScroll('enable');

        var instance = $container.data('plugin_verticalScroll');
        expect(instance.isEnabled).toBe(true);
    });

    test('enable() should remove vs-disabled class', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('disable');
        $container.verticalScroll('enable');
        expect($container.hasClass('vs-disabled')).toBe(false);
    });

    test('keyboard should not navigate when disabled', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('disable');

        var keyDown = $.Event('keydown');
        keyDown.keyCode = 40;
        $(document).trigger(keyDown);

        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    test('disable() should stop autoScroll timer', function () {
        jest.useFakeTimers();

        $container.verticalScroll({
            responsive: false,
            autoScroll: true,
            autoScrollInterval: 1000,
            loop: true
        });
        $container.verticalScroll('disable');

        var instance = $container.data('plugin_verticalScroll');
        expect(instance.autoScrollTimer).toBeNull();

        jest.advanceTimersByTime(3000);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);

        jest.useRealTimers();
    });

    test('enable() should restart autoScroll if autoScroll option is true', function () {
        jest.useFakeTimers();

        $container.verticalScroll({
            responsive: false,
            autoScroll: true,
            autoScrollInterval: 1000,
            loop: true
        });
        $container.verticalScroll('disable');
        $container.verticalScroll('enable');

        var instance = $container.data('plugin_verticalScroll');
        expect(instance.autoScrollTimer).not.toBeNull();

        jest.advanceTimersByTime(1000);
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);

        jest.useRealTimers();
    });

    // ------------------------------------------------------------------
    // refresh
    // ------------------------------------------------------------------

    test('refresh() should recalculate positions', function () {
        $container.verticalScroll({ responsive: false });
        var instance = $container.data('plugin_verticalScroll');
        var originalPositions = instance.positions.slice();

        $container.verticalScroll('refresh');

        expect(instance.positions.length).toBe(originalPositions.length);
    });

    test('refresh() should not throw on an initialised instance', function () {
        $container.verticalScroll({ responsive: false });
        expect(function () {
            $container.verticalScroll('refresh');
        }).not.toThrow();
    });

    // ------------------------------------------------------------------
    // Chaining
    // ------------------------------------------------------------------

    test('plugin methods that return void should allow jQuery chaining', function () {
        $container.verticalScroll({ responsive: false });
        var result = $container.verticalScroll('enable');
        expect(result instanceof $).toBe(true);
    });

    test('getter methods should return their value, not the jQuery set', function () {
        $container.verticalScroll({ responsive: false });
        var idx = $container.verticalScroll('getCurrentIndex');
        expect(typeof idx).toBe('number');
    });
});
