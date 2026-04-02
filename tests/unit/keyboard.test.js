/**
 * Keyboard navigation tests for jQuery Vertical Scroll Plugin
 *
 * Covers arrow keys, Page Up/Down, Home/End, and disabled keyboard option.
 */

describe('VerticalScroll - Keyboard Navigation', function () {
    var $container;
    var originalAnimate;

    var HTML_FIXTURE = [
        '<div id="container" style="height:500px;overflow:hidden;">',
        '  <section id="s1" data-vs-label="First" style="height:500px;">Section 1</section>',
        '  <section id="s2" data-vs-label="Second" style="height:500px;">Section 2</section>',
        '  <section id="s3" data-vs-label="Third" style="height:500px;">Section 3</section>',
        '</div>'
    ].join('\n');

    function triggerKey(keyCode) {
        var event = $.Event('keydown');
        event.keyCode = keyCode;
        $(document).trigger(event);
    }

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
    // Down arrow (keyCode 40)
    // ------------------------------------------------------------------

    test('Down arrow should navigate to next section', function () {
        $container.verticalScroll({ responsive: false });
        triggerKey(40);
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);
    });

    // ------------------------------------------------------------------
    // Up arrow (keyCode 38)
    // ------------------------------------------------------------------

    test('Up arrow should navigate to previous section', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        triggerKey(38);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    test('Up arrow at first section should stay at first section', function () {
        $container.verticalScroll({ responsive: false });
        triggerKey(38);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // Page Down (keyCode 34)
    // ------------------------------------------------------------------

    test('Page Down should navigate to next section', function () {
        $container.verticalScroll({ responsive: false });
        triggerKey(34);
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);
    });

    // ------------------------------------------------------------------
    // Page Up (keyCode 33)
    // ------------------------------------------------------------------

    test('Page Up should navigate to previous section', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('next');
        triggerKey(33);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // Home (keyCode 36)
    // ------------------------------------------------------------------

    test('Home key should navigate to first section', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('scrollToSection', 2);
        triggerKey(36);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // End (keyCode 35)
    // ------------------------------------------------------------------

    test('End key should navigate to last section', function () {
        $container.verticalScroll({ responsive: false });
        triggerKey(35);
        expect($container.verticalScroll('getCurrentIndex')).toBe(2);
    });

    // ------------------------------------------------------------------
    // Keyboard disabled
    // ------------------------------------------------------------------

    test('keyboard navigation should not work when keyboard option is false', function () {
        $container.verticalScroll({ responsive: false, keyboard: false });
        triggerKey(40);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // Disabled state
    // ------------------------------------------------------------------

    test('keyboard navigation should not work when plugin is disabled', function () {
        $container.verticalScroll({ responsive: false });
        $container.verticalScroll('disable');
        triggerKey(40);
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // Unrelated keys
    // ------------------------------------------------------------------

    test('unrelated keys should not affect navigation', function () {
        $container.verticalScroll({ responsive: false });
        triggerKey(65); // 'A'
        triggerKey(13); // Enter
        triggerKey(27); // Escape
        expect($container.verticalScroll('getCurrentIndex')).toBe(0);
    });

    // ------------------------------------------------------------------
    // Focus guard
    // ------------------------------------------------------------------

    test('keyboard should work when body is focused', function () {
        $container.verticalScroll({ responsive: false });
        document.body.focus();
        triggerKey(40);
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);
    });

    test('keyboard should work when container element is focused', function () {
        $container.verticalScroll({ responsive: false });
        $container.attr('tabindex', '0');
        $container[0].focus();
        triggerKey(40);
        expect($container.verticalScroll('getCurrentIndex')).toBe(1);
    });
});
