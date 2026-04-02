/**
 * Options tests for jQuery Vertical Scroll Plugin
 *
 * Covers setOptions(), theme classes, responsive breakpoint handling,
 * and dynamic option changes.
 */

describe('VerticalScroll - Options', function () {
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
    // setOptions()
    // ------------------------------------------------------------------

    test('setOptions() should update options on the instance', function () {
        $container.verticalScroll({ responsive: false, animationDuration: 800 });
        $container.verticalScroll('setOptions', { animationDuration: 200 });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.options.animationDuration).toBe(200);
    });

    test('setOptions() should merge with existing options', function () {
        $container.verticalScroll({ responsive: false, animationDuration: 800, loop: false });
        $container.verticalScroll('setOptions', { loop: true });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.options.loop).toBe(true);
        expect(instance.options.animationDuration).toBe(800);
    });

    test('setOptions({ autoScroll: true }) should start auto-scrolling', function () {
        jest.useFakeTimers();

        $container.verticalScroll({ responsive: false, loop: true });
        $container.verticalScroll('setOptions', {
            autoScroll: true,
            autoScrollInterval: 1000
        });

        var instance = $container.data('plugin_verticalScroll');
        expect(instance.autoScrollTimer).not.toBeNull();

        jest.advanceTimersByTime(1000);
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);

        jest.useRealTimers();
    });

    test('setOptions({ autoScroll: false }) should stop auto-scrolling', function () {
        jest.useFakeTimers();

        $container.verticalScroll({
            responsive: false,
            autoScroll: true,
            autoScrollInterval: 1000,
            loop: true
        });
        $container.verticalScroll('setOptions', { autoScroll: false });

        var instance = $container.data('plugin_verticalScroll');
        expect(instance.autoScrollTimer).toBeNull();

        jest.advanceTimersByTime(5000);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);

        jest.useRealTimers();
    });

    // ------------------------------------------------------------------
    // Theme classes
    // ------------------------------------------------------------------

    test('should apply vs-theme-default by default', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.hasClass('vs-theme-default')).toBe(true);
    });

    test('should apply vs-theme-dark when theme is dark', function () {
        $container.verticalScroll({ responsive: false, theme: 'dark' });
        expect($container.hasClass('vs-theme-dark')).toBe(true);
        expect($container.hasClass('vs-theme-default')).toBe(false);
    });

    test('should apply vs-theme-light when theme is light', function () {
        $container.verticalScroll({ responsive: false, theme: 'light' });
        expect($container.hasClass('vs-theme-light')).toBe(true);
    });

    test('should apply vs-theme-minimal when theme is minimal', function () {
        $container.verticalScroll({ responsive: false, theme: 'minimal' });
        expect($container.hasClass('vs-theme-minimal')).toBe(true);
    });

    // ------------------------------------------------------------------
    // Responsive breakpoint
    // ------------------------------------------------------------------

    test('plugin should be enabled when window width >= mobileBreakpoint', function () {
        // Mock $(window).width() to return a wide value by setting clientWidth
        Object.defineProperty(document.documentElement, 'clientWidth', {
            value: 1024, writable: true, configurable: true
        });

        $container.verticalScroll({ responsive: true, mobileBreakpoint: 768 });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.isEnabled).toBe(true);

        Object.defineProperty(document.documentElement, 'clientWidth', {
            value: 0, writable: true, configurable: true
        });
    });

    test('plugin should not initialise sections when viewport is below breakpoint', function () {
        // Simulate narrow viewport
        Object.defineProperty(document.documentElement, 'clientWidth', {
            value: 400, writable: true, configurable: true
        });

        $container.verticalScroll({ responsive: true, mobileBreakpoint: 768 });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.sections.length).toBe(0);

        Object.defineProperty(document.documentElement, 'clientWidth', {
            value: 0, writable: true, configurable: true
        });
    });

    test('responsive:false should keep plugin enabled regardless of viewport', function () {
        $container.verticalScroll({ responsive: false });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.sections.length).toBe(3);
    });

    // ------------------------------------------------------------------
    // Easing option
    // ------------------------------------------------------------------

    test('easing option should be stored in instance options', function () {
        $container.verticalScroll({ responsive: false, easing: 'linear' });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.options.easing).toBe('linear');
    });

    // ------------------------------------------------------------------
    // Scroll threshold
    // ------------------------------------------------------------------

    test('scrollThreshold option should be stored in instance options', function () {
        $container.verticalScroll({ responsive: false, scrollThreshold: 100 });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.options.scrollThreshold).toBe(100);
    });

    // ------------------------------------------------------------------
    // touchThreshold option
    // ------------------------------------------------------------------

    test('touchThreshold option should be stored in instance options', function () {
        $container.verticalScroll({ responsive: false, touchThreshold: 75 });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.options.touchThreshold).toBe(75);
    });

    // ------------------------------------------------------------------
    // Private methods inaccessible
    // ------------------------------------------------------------------

    test('calling a private method via plugin bridge should warn and not execute', function () {
        $container.verticalScroll({ responsive: false });
        var warnSpy = jest.spyOn(console, 'warn').mockImplementation(function () {});

        $container.verticalScroll('_init');
        $container.verticalScroll('_bindEvents');
        $container.verticalScroll('_onKeydown');

        expect(warnSpy).toHaveBeenCalledTimes(3);
        warnSpy.mock.calls.forEach(function (call) {
            expect(call[0]).toContain('Cannot call private method');
        });

        warnSpy.mockRestore();
    });

    // ------------------------------------------------------------------
    // Non-existent method
    // ------------------------------------------------------------------

    test('calling a non-existent method should warn', function () {
        $container.verticalScroll({ responsive: false });
        var warnSpy = jest.spyOn(console, 'warn').mockImplementation(function () {});

        $container.verticalScroll('nonExistentMethod');

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Method not found')
        );

        warnSpy.mockRestore();
    });

    // ------------------------------------------------------------------
    // Calling methods before init
    // ------------------------------------------------------------------

    test('calling a method on uninitialised element should not throw', function () {
        expect(function () {
            $container.verticalScroll('next');
        }).not.toThrow();
    });
});
