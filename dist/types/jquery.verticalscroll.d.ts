/**
 * jQuery Vertical Scroll Plugin - TypeScript Declarations
 *
 * @version 3.0.0-alpha.1
 * @author Vineeth Krishnan
 * @license MIT
 */

export interface VerticalScrollOptions {
    /** Selector for scrollable sections. Default: 'section' */
    selector?: string;

    /** Show pagination dots. Default: true */
    pagination?: boolean;
    /** Position: 'left' or 'right'. Default: 'right' */
    paginationPosition?: 'left' | 'right';
    /** Offset from the edge in pixels. Default: 20 */
    paginationOffset?: number;

    /** Animation duration in ms. Default: 800 */
    animationDuration?: number;
    /** jQuery easing function. Default: 'swing' */
    easing?: string;
    /** Minimum scroll delta to trigger section change. Default: 50 */
    scrollThreshold?: number;
    /** Minimum touch delta to trigger section change. Default: 50 */
    touchThreshold?: number;

    /** Enable mouse wheel navigation. Default: true */
    mouseWheel?: boolean;
    /** Enable keyboard navigation. Default: true */
    keyboard?: boolean;
    /** Enable touch/swipe navigation. Default: true */
    touch?: boolean;

    /** Loop back to first/last section. Default: false */
    loop?: boolean;
    /** Enable auto-scrolling. Default: false */
    autoScroll?: boolean;
    /** Auto-scroll interval in ms. Default: 5000 */
    autoScrollInterval?: number;
    /** Pause auto-scroll on hover. Default: true */
    pauseOnHover?: boolean;

    /** Add ARIA labels. Default: true */
    ariaLabels?: boolean;
    /** Focus section after navigation. Default: true */
    focusOnSection?: boolean;

    /** Enable responsive behavior. Default: true */
    responsive?: boolean;
    /** Disable plugin below this width. Default: 768 */
    mobileBreakpoint?: number;

    /** Theme name. Default: 'default' */
    theme?: 'default' | 'light' | 'dark' | 'minimal' | 'neon' | 'git-graph' | 'sound-wave' | 'diamond' | 'arrow' | 'pill' | 'electric' | 'line-connect' | 'chain' | string;
    /** Pagination dot animation. Default: 'pulse' */
    paginationAnimation?: 'none' | 'pulse' | 'glow' | 'bounce' | 'ripple' | 'scale' | 'fade-ring' | 'rotate' | 'morph' | 'heartbeat' | 'radar' | 'neon-flicker' | 'wave' | 'diamond-spin' | 'electric-zap' | 'slide-in' | 'chain-pop' | string;

    /** Called after initialization */
    onInit?: (index: number, section: JQuery) => void;
    /** Called after destruction */
    onDestroy?: () => void;
    /** Called before scrolling. Return false to cancel. */
    onBeforeScroll?: (index: number, section: JQuery, oldIndex: number) => boolean | void;
    /** Called after scroll animation completes */
    onAfterScroll?: (index: number, section: JQuery, oldIndex: number) => void;
    /** Called when active section changes */
    onSectionChange?: (index: number, section: JQuery, oldIndex: number) => void;
    /** Called on window resize */
    onResize?: (isEnabled: boolean) => void;
}

export declare class VerticalScroll {
    constructor(element: HTMLElement, options?: VerticalScrollOptions, $?: JQueryStatic);

    /** Scroll to a specific section by index */
    scrollToSection(index: number, animate?: boolean): JQuery.Promise<void>;
    /** Scroll to a section by its ID */
    scrollToId(id: string): JQuery.Promise<void>;
    /** Navigate to next section */
    next(): JQuery.Promise<void>;
    /** Navigate to previous section */
    prev(): JQuery.Promise<void>;

    /** Get current section index */
    getCurrentIndex(): number;
    /** Get current section element */
    getCurrentSection(): JQuery;
    /** Get all sections */
    getSections(): JQuery;
    /** Get total number of sections */
    getSectionCount(): number;

    /** Enable the plugin */
    enable(): void;
    /** Disable the plugin */
    disable(): void;
    /** Recalculate positions */
    refresh(): void;
    /** Update options at runtime */
    setOptions(options: Partial<VerticalScrollOptions>): void;
    /** Destroy the plugin instance and clean up */
    destroy(): void;
}

/** Get the VerticalScroll instance for a DOM element */
export declare function getInstance(element: HTMLElement): VerticalScroll | undefined;

/** Register the plugin on a jQuery instance */
export declare function registerPlugin($: JQueryStatic): void;

/** Default options */
export { DEFAULTS } from './constants';

declare global {
    interface JQuery {
        verticalScroll(options?: VerticalScrollOptions): JQuery;
        verticalScroll(method: 'scrollToSection', index: number, animate?: boolean): JQuery.Promise<void>;
        verticalScroll(method: 'scrollToId', id: string): JQuery.Promise<void>;
        verticalScroll(method: 'next'): JQuery.Promise<void>;
        verticalScroll(method: 'prev'): JQuery.Promise<void>;
        verticalScroll(method: 'getCurrentIndex'): number;
        verticalScroll(method: 'getCurrentSection'): JQuery;
        verticalScroll(method: 'getSections'): JQuery;
        verticalScroll(method: 'getSectionCount'): number;
        verticalScroll(method: 'enable'): void;
        verticalScroll(method: 'disable'): void;
        verticalScroll(method: 'refresh'): void;
        verticalScroll(method: 'setOptions', options: Partial<VerticalScrollOptions>): void;
        verticalScroll(method: 'destroy'): void;
    }
}
