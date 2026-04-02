/**
 * Navigation tests for jQuery Vertical Scroll Plugin
 *
 * Covers next(), prev(), scrollToSection(), scrollToId(), and loop behaviour.
 */

describe('VerticalScroll - Navigation', function () {
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

        // Mock $.fn.animate so the complete callback fires synchronously
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
    // next()
    // ------------------------------------------------------------------

    test('next() should move from section 0 to section 1', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);
    });

    test('next() should move from section 1 to section 2', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        $container.verticalScroll('next');
        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });

    test('next() at last section without loop should stay at last', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        $container.verticalScroll('next');
        $container.verticalScroll('next');
        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });

    test('next() at last section with loop should wrap to first', function () {
        $container.verticalScroll({ responsive: false, loop: true });
        $container.verticalScroll('next');
        $container.verticalScroll('next');
        $container.verticalScroll('next');
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // prev()
    // ------------------------------------------------------------------

    test('prev() should move from section 1 to section 0', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        $container.verticalScroll('prev');
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    test('prev() at first section without loop should stay at first', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('prev');
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    test('prev() at first section with loop should wrap to last', function () {
        $container.verticalScroll({ responsive: false, loop: true });
        $container.verticalScroll('prev');
        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });

    // ------------------------------------------------------------------
    // scrollToSection()
    // ------------------------------------------------------------------

    test('scrollToSection() should navigate to a specific index', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToSection', 2);
        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });

    test('scrollToSection() with invalid negative index should not change section', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToSection', -1);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    test('scrollToSection() with out-of-range index should not change section', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToSection', 99);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    test('scrollToSection() to the same index should resolve immediately', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToSection', 0);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // scrollToId()
    // ------------------------------------------------------------------

    test('scrollToId() should navigate to section by ID', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToId', 's2');
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);
    });

    test('scrollToId() should accept ID with leading hash', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToId', '#s3');
        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });

    test('scrollToId() with non-existent ID should not change section', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToId', 'nope');
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // Section active class updates
    // ------------------------------------------------------------------

    test('navigating should update vs-section-active class', function () {
        $container.verticalScroll({ responsive: false });
        var $sections = $container.children('section');

        expect($sections.eq(0).hasClass('vs-section-active')).toBe(true);

        $container.verticalScroll('next');
        expect($sections.eq(0).hasClass('vs-section-active')).toBe(false);
        expect($sections.eq(1).hasClass('vs-section-active')).toBe(true);
    });

    // ------------------------------------------------------------------
    // onBeforeScroll cancellation
    // ------------------------------------------------------------------

    test('onBeforeScroll returning false should cancel navigation', function () {
        $container.verticalScroll({
            responsive: false,
            onBeforeScroll: function () {
                return false;
            }
        });

        $container.verticalScroll('next');
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // onAfterScroll callback
    // ------------------------------------------------------------------

    test('onAfterScroll should fire after navigation', function () {
        var afterSpy = jest.fn();
        $container.verticalScroll({ responsive: false, onAfterScroll: afterSpy });

        $container.verticalScroll('next');

        expect(afterSpy).toHaveBeenCalledTimes(1);
        expect(afterSpy).toHaveBeenCalledWith(1, expect.anything(), 0);
    });

    // ------------------------------------------------------------------
    // Animate false (instant scroll)
    // ------------------------------------------------------------------

    test('scrollToSection with animate=false should still navigate', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToSection', 2, false);
        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });
});
