/**
 * JILGM Page Transitions
 * ─────────────────────────────────────────────────────────────────────────
 * Provides:
 *  1. Page-enter animation (fade + slide-up) on every load
 *  2. Staggered reveal for elements marked with [data-reveal]
 *  3. Smooth fade-out exit before internal navigation
 *  4. Utility: animateIn(el, delay) — programmatically animate an element in
 */

(function () {
    'use strict';

    /* ── 1. Page enter ──────────────────────────────────────────────────── */
    // Applied instantly so there's no flash of unstyled content
    document.documentElement.classList.add('page-loading');

    document.addEventListener('DOMContentLoaded', () => {
        // Tiny rAF so the browser has painted once before we remove the class
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove('page-loading');
                document.documentElement.classList.add('page-entered');
            });
        });

        /* ── 2. Staggered child reveals ─────────────────────────────────── */
        const reveals = document.querySelectorAll('[data-reveal]');
        reveals.forEach((el, i) => {
            const base = parseFloat(el.dataset.revealDelay || 0);
            const delay = base + i * 80; // 80 ms stagger between siblings
            el.style.animationDelay = `${delay}ms`;
            el.classList.add('reveal-pending');

            // Use IntersectionObserver so off-screen elements animate when scrolled to
            const io = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('reveal-active');
                    io.disconnect();
                }
            }, { threshold: 0.1 });
            io.observe(el);
        });

        /* ── 3. Exit animation before internal navigation ───────────────── */
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            // Only intercept same-origin, non-hash, non-js links
            if (!href || href.startsWith('#') || href.startsWith('javascript') ||
                href.startsWith('http') || href.startsWith('mailto')) return;

            e.preventDefault();
            document.documentElement.classList.remove('page-entered');
            document.documentElement.classList.add('page-leaving');

            setTimeout(() => {
                window.location.href = href;
            }, 320); // matches CSS exit duration
        });
    });

    /* ── 4. Public utility ──────────────────────────────────────────────── */
    window.JILGMAnimations = {
        /**
         * Animate an element in with a custom delay.
         * @param {HTMLElement} el
         * @param {number} delayMs
         */
        animateIn(el, delayMs = 0) {
            el.style.animationDelay = `${delayMs}ms`;
            el.classList.add('reveal-pending');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => el.classList.add('reveal-active'));
            });
        },

        /**
         * Stagger a NodeList / array of elements.
         * @param {NodeList|Array} els
         * @param {number} baseDelay   initial delay in ms
         * @param {number} stagger     ms between each element
         */
        stagger(els, baseDelay = 0, stagger = 80) {
            Array.from(els).forEach((el, i) => {
                this.animateIn(el, baseDelay + i * stagger);
            });
        }
    };
})();
