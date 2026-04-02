/**
 * Events / callbacks tests for jQuery Vertical Scroll Plugin
 *
 * Covers onInit, onDestroy, onBeforeScroll, onAfterScroll,
 * onSectionChange, onResize, and the corresponding jQuery custom events.
 */

describe('VerticalScroll - Events & Callbacks', function () {
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
    // onInit
    // ------------------------------------------------------------------

    test('onInit callback should be called with currentIndex and $section', function () {
        var spy = jest.fn();
        $container.verticalScroll({ responsive: false, onInit: spy });

        expect(spy).toHaveBeenCalledTimes(1);
        var args = spy.mock.calls[0];
        expect(args[0]).toBe(0);
        expect(args[1] instanceof $).toBe(true);
    });

    test('verticalScroll:init jQuery event should fire', function () {
        var handler = jest.fn();
        $container.on('verticalScroll:init', handler);
        $container.verticalScroll({ responsive: false });
        expect(handler).toHaveBeenCalledTimes(1);
    });

    // ------------------------------------------------------------------
    // onBeforeScroll
    // ------------------------------------------------------------------

    test('onBeforeScroll should receive (targetIndex, $targetSection, currentIndex)', function () {
        var spy = jest.fn();
        $container.verticalScroll({ responsive: false, onBeforeScroll: spy });
        $container.verticalScroll('next');

        expect(spy).toHaveBeenCalledTimes(1);
        var args = spy.mock.calls[0];
        expect(args[0]).toBe(1);
        expect(args[1] instanceof $).toBe(true);
        expect(args[2]).toBe(0);
    });

    test('onBeforeScroll returning false should prevent scroll', function () {
        var afterSpy = jest.fn();
        $container.verticalScroll({
            responsive: false,
            onBeforeScroll: function () { return false; },
            onAfterScroll: afterSpy
        });

        $container.verticalScroll('next');

        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
        expect(afterSpy).not.toHaveBeenCalled();
    });

    test('verticalScroll:beforescroll jQuery event should fire', function () {
        var handler = jest.fn();
        $container.on('verticalScroll:beforescroll', handler);
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        expect(handler).toHaveBeenCalledTimes(1);
    });

    // ------------------------------------------------------------------
    // onAfterScroll
    // ------------------------------------------------------------------

    test('onAfterScroll should receive (newIndex, $newSection, oldIndex)', function () {
        var spy = jest.fn();
        $container.verticalScroll({ responsive: false, onAfterScroll: spy });
        $container.verticalScroll('next');

        expect(spy).toHaveBeenCalledTimes(1);
        var args = spy.mock.calls[0];
        expect(args[0]).toBe(1);
        expect(args[1] instanceof $).toBe(true);
        expect(args[2]).toBe(0);
    });

    test('verticalScroll:afterscroll jQuery event should fire', function () {
        var handler = jest.fn();
        $container.on('verticalScroll:afterscroll', handler);
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        expect(handler).toHaveBeenCalledTimes(1);
    });

    // ------------------------------------------------------------------
    // onSectionChange
    // ------------------------------------------------------------------

    test('onSectionChange should not fire during initial setup when section does not change', function () {
        var spy = jest.fn();
        $container.verticalScroll({ responsive: false, onSectionChange: spy });
        expect(spy).not.toHaveBeenCalled();
    });

    // ------------------------------------------------------------------
    // onDestroy
    // ------------------------------------------------------------------

    test('onDestroy callback should fire when destroy is called', function () {
        var spy = jest.fn();
        $container.verticalScroll({ responsive: false, onDestroy: spy });
        $container.verticalScroll('destroy');

        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('verticalScroll:destroy jQuery event should fire', function () {
        var handler = jest.fn();
        $container.verticalScroll({ responsive: false });
        $container.on('verticalScroll:destroy', handler);
        $container.verticalScroll('destroy');
        expect(handler).toHaveBeenCalledTimes(1);
    });

    // ------------------------------------------------------------------
    // onResize
    // ------------------------------------------------------------------

    test('onResize callback should fire on window resize (debounced)', function () {
        jest.useFakeTimers();

        var spy = jest.fn();
        $container.verticalScroll({ responsive: false, onResize: spy });

        $(window).trigger('resize');

        // The handler is debounced with 250ms
        jest.advanceTimersByTime(300);

        expect(spy).toHaveBeenCalled();

        jest.useRealTimers();
    });

    // ------------------------------------------------------------------
    // Callback context
    // ------------------------------------------------------------------

    test('callbacks should be called with the container DOM element as this', function () {
        var thisValue = null;
        $container.verticalScroll({
            responsive: false,
            onAfterScroll: function () {
                thisValue = this;
            }
        });

        $container.verticalScroll('next');
        expect(thisValue).toBe($container[0]);
    });

    // ------------------------------------------------------------------
    // Multiple sequential events
    // ------------------------------------------------------------------

    test('navigating multiple times should fire onAfterScroll each time', function () {
        var spy = jest.fn();
        $container.verticalScroll({ responsive: false, onAfterScroll: spy });

        $container.verticalScroll('next');
        $container.verticalScroll('next');

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls[0][0]).toBe(1);
        expect(spy.mock.calls[1][0]).toBe(2);
    });
});
