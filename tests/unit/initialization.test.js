/**
 * Initialization tests for jQuery Vertical Scroll Plugin
 */

describe('VerticalScroll - Initialization', function () {
    var $container;

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
    });

    afterEach(function () {
        try {
            var inst = $container.data('plugin_verticalScroll');
            if (inst && inst.$sections) {
                $container.verticalScroll('destroy');
            }
        } catch (e) { /* already cleaned up */ }
        document.body.innerHTML = '';
    });

    // ------------------------------------------------------------------
    // Basic initialisation
    // ------------------------------------------------------------------

    test('should initialise when called with no options (responsive disabled)', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.data('plugin_verticalScroll')).toBeDefined();
    });

    test('should add vs-initialized class to the container', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.hasClass('vs-initialized')).toBe(true);
    });

    test('should add vs-container class to the container', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.hasClass('vs-container')).toBe(true);
    });

    test('should add the default theme class vs-theme-default', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.hasClass('vs-theme-default')).toBe(true);
    });

    test('should add vs-section class to each section', function () {
        $container.verticalScroll({ responsive: false });
        $container.children('section').each(function () {
            expect($(this).hasClass('vs-section')).toBe(true);
        });
    });

    test('should set data-vs-index on each section', function () {
        $container.verticalScroll({ responsive: false });
        $container.children('section').each(function (i) {
            expect($(this).attr('data-vs-index')).toBe(String(i));
        });
    });

    test('should mark the first section as active', function () {
        $container.verticalScroll({ responsive: false });
        var $sections = $container.children('section');
        expect($sections.eq(0).hasClass('vs-section-active')).toBe(true);
        expect($sections.eq(1).hasClass('vs-section-active')).toBe(false);
        expect($sections.eq(2).hasClass('vs-section-active')).toBe(false);
    });

    // ------------------------------------------------------------------
    // Custom options
    // ------------------------------------------------------------------

    test('should accept custom options', function () {
        $container.verticalScroll({ responsive: false, animationDuration: 400 });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.options.animationDuration).toBe(400);
    });

    test('should merge custom options with defaults', function () {
        $container.verticalScroll({ responsive: false, loop: true });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.options.loop).toBe(true);
        expect(instance.options.pagination).toBe(true);
        expect(instance.options.keyboard).toBe(true);
    });

    test('should apply custom theme class', function () {
        $container.verticalScroll({ responsive: false, theme: 'dark' });
        expect($container.hasClass('vs-theme-dark')).toBe(true);
        expect($container.hasClass('vs-theme-default')).toBe(false);
    });

    // ------------------------------------------------------------------
    // Custom selector
    // ------------------------------------------------------------------

    test('should find sections using custom selector', function () {
        document.body.innerHTML = [
            '<div id="container" style="height:500px;overflow:hidden;">',
            '  <div class="page" style="height:500px;">Page 1</div>',
            '  <div class="page" style="height:500px;">Page 2</div>',
            '</div>'
        ].join('\n');
        $container = $('#container');

        $container.verticalScroll({ responsive: false, selector: '.page' });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.sections.length).toBe(2);
    });

    // ------------------------------------------------------------------
    // No sections warning
    // ------------------------------------------------------------------

    test('should warn when no sections are found', function () {
        document.body.innerHTML = '<div id="container" style="height:500px;overflow:hidden;"></div>';
        $container = $('#container');
        var warnSpy = jest.spyOn(console, 'warn').mockImplementation(function () {});

        $container.verticalScroll({ responsive: false });

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('No sections found')
        );
        warnSpy.mockRestore();
    });

    test('should not create pagination when no sections are found', function () {
        document.body.innerHTML = '<div id="container" style="height:500px;overflow:hidden;"></div>';
        $container = $('#container');
        jest.spyOn(console, 'warn').mockImplementation(function () {});

        $container.verticalScroll({ responsive: false });

        expect($('.vs-pagination').length).toBe(0);
        console.warn.mockRestore();
    });

    // ------------------------------------------------------------------
    // onInit callback
    // ------------------------------------------------------------------

    test('should call onInit callback after initialisation', function () {
        var onInitSpy = jest.fn();
        $container.verticalScroll({ responsive: false, onInit: onInitSpy });

        expect(onInitSpy).toHaveBeenCalledTimes(1);
        expect(onInitSpy).toHaveBeenCalledWith(
            0,
            expect.anything()
        );
    });

    test('should trigger verticalScroll:init event', function () {
        var handler = jest.fn();
        $container.on('verticalScroll:init', handler);
        $container.verticalScroll({ responsive: false });
        expect(handler).toHaveBeenCalledTimes(1);
    });

    // ------------------------------------------------------------------
    // Prevent double initialisation
    // ------------------------------------------------------------------

    test('should not re-initialise if already initialised', function () {
        var onInitSpy = jest.fn();
        $container.verticalScroll({ responsive: false, onInit: onInitSpy });
        var firstInstance = $container.data('plugin_verticalScroll');

        $container.verticalScroll({ responsive: false, onInit: onInitSpy });
        var secondInstance = $container.data('plugin_verticalScroll');

        expect(firstInstance).toBe(secondInstance);
        expect(onInitSpy).toHaveBeenCalledTimes(1);
    });

    // ------------------------------------------------------------------
    // Container styles
    // ------------------------------------------------------------------

    test('should set position relative on the container', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.css('position')).toBe('relative');
    });

    test('should set overflow hidden on the container', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.css('overflow')).toBe('hidden');
    });

    // ------------------------------------------------------------------
    // Default option values
    // ------------------------------------------------------------------

    test('should expose defaults on $.fn.verticalScroll.defaults', function () {
        var defaults = $.fn.verticalScroll.defaults;
        expect(defaults).toBeDefined();
        expect(defaults.selector).toBe('section');
        expect(defaults.pagination).toBe(true);
        expect(defaults.animationDuration).toBe(800);
        expect(defaults.easing).toBe('swing');
        expect(defaults.mouseWheel).toBe(true);
        expect(defaults.keyboard).toBe(true);
        expect(defaults.touch).toBe(true);
        expect(defaults.loop).toBe(false);
        expect(defaults.autoScroll).toBe(false);
        expect(defaults.autoScrollInterval).toBe(5000);
        expect(defaults.theme).toBe('default');
        expect(defaults.mobileBreakpoint).toBe(768);
    });

    test('should expose the Constructor', function () {
        expect($.fn.verticalScroll.Constructor).toBeDefined();
        expect(typeof $.fn.verticalScroll.Constructor).toBe('function');
    });
});
