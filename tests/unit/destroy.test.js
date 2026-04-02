/**
 * Destroy tests for jQuery Vertical Scroll Plugin
 *
 * Covers cleanup of classes, attributes, pagination, events,
 * data, and auto-scroll timers.
 */

describe('VerticalScroll - Destroy', function () {
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
        $.fn.animate = originalAnimate;
        document.body.innerHTML = '';
    });

    // ------------------------------------------------------------------
    // Container cleanup
    // ------------------------------------------------------------------

    test('destroy() should remove vs-container class', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');
        expect($container.hasClass('vs-container')).toBe(false);
    });

    test('destroy() should remove vs-initialized class', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');
        expect($container.hasClass('vs-initialized')).toBe(false);
    });

    test('destroy() should remove theme class', function () {
        $container.verticalScroll({ responsive: false, theme: 'dark' });
        $container.verticalScroll('destroy');
        expect($container.hasClass('vs-theme-dark')).toBe(false);
    });

    test('destroy() should remove role attribute from container', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');
        expect($container.attr('role')).toBeUndefined();
    });

    test('destroy() should remove aria-label from container', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');
        expect($container.attr('aria-label')).toBeUndefined();
    });

    test('destroy() should clear inline position style', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');
        expect($container[0].style.position).toBe('');
    });

    test('destroy() should clear inline overflow style', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');
        expect($container[0].style.overflow).toBe('');
    });

    // ------------------------------------------------------------------
    // Section cleanup
    // ------------------------------------------------------------------

    test('destroy() should remove vs-section class from sections', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        $container.children('section').each(function () {
            expect($(this).hasClass('vs-section')).toBe(false);
        });
    });

    test('destroy() should remove vs-section-active class from sections', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        $container.children('section').each(function () {
            expect($(this).hasClass('vs-section-active')).toBe(false);
        });
    });

    test('destroy() should remove data-vs-index from sections', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        $container.children('section').each(function () {
            expect($(this).attr('data-vs-index')).toBeUndefined();
        });
    });

    test('destroy() should remove role attribute from sections', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        $container.children('section').each(function () {
            expect($(this).attr('role')).toBeUndefined();
        });
    });

    test('destroy() should remove aria-label from sections', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        $container.children('section').each(function () {
            expect($(this).attr('aria-label')).toBeUndefined();
        });
    });

    test('destroy() should remove tabindex from sections', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        $container.verticalScroll('destroy');

        $container.children('section').each(function () {
            expect($(this).attr('tabindex')).toBeUndefined();
        });
    });

    // ------------------------------------------------------------------
    // Pagination cleanup
    // ------------------------------------------------------------------

    test('destroy() should remove pagination element', function () {
        $container.verticalScroll({ responsive: false });
        expect($('.vs-pagination').length).toBe(1);

        $container.verticalScroll('destroy');
        expect($('.vs-pagination').length).toBe(0);
    });

    // ------------------------------------------------------------------
    // Data cleanup
    // ------------------------------------------------------------------

    test('destroy() should remove plugin data from element', function () {
        $container.verticalScroll({ responsive: false });
        expect($container.data('plugin_verticalScroll')).toBeDefined();

        $container.verticalScroll('destroy');
        expect($container.data('plugin_verticalScroll')).toBeUndefined();
    });

    // ------------------------------------------------------------------
    // Event cleanup
    // ------------------------------------------------------------------

    test('keyboard events should not fire after destroy', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        expect(function () {
            var e = $.Event('keydown');
            e.keyCode = 40;
            $(document).trigger(e);
        }).not.toThrow();
    });

    test('destroy() should stop auto-scroll timer', function () {
        jest.useFakeTimers();

        $container.verticalScroll({
            responsive: false,
            autoScroll: true,
            autoScrollInterval: 500,
            loop: true
        });
        var instance = $container.data('plugin_verticalScroll');
        expect(instance.autoScrollTimer).not.toBeNull();

        $container.verticalScroll('destroy');
        expect(instance.autoScrollTimer).toBeNull();

        jest.useRealTimers();
    });

    // ------------------------------------------------------------------
    // Re-initialisation after destroy
    // ------------------------------------------------------------------

    test('should be possible to re-initialise after destroy', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        $container.verticalScroll({ responsive: false });
        expect($container.data('plugin_verticalScroll')).toBeDefined();
        expect($container.hasClass('vs-initialized')).toBe(true);
        expect($('.vs-pagination').length).toBe(1);

        $container.verticalScroll('destroy');
    });

    // ------------------------------------------------------------------
    // onDestroy callback
    // ------------------------------------------------------------------

    test('onDestroy callback should fire before cleanup', function () {
        var callOrder = [];

        $container.verticalScroll({
            responsive: false,
            onDestroy: function () {
                callOrder.push('callback');
            }
        });

        $container.verticalScroll('destroy');
        expect(callOrder).toEqual(['callback']);
    });

    test('destroy should be idempotent (second call should not throw)', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('destroy');

        expect(function () {
            $container.verticalScroll('destroy');
        }).not.toThrow();
    });
});
