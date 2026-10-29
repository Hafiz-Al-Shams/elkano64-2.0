/**
 * Locks the page scroll (used while a modal is open) WITHOUT the page jumping sideways.
 *
 * Setting `overflow: hidden` on <body> removes the page scrollbar, which makes the page
 * suddenly ~15px wider and shifts everything to the right. To avoid that, we measure the
 * scrollbar's width first and add the same amount of right padding to <body> while locked.
 *
 * Returns an "unlock" function that restores the previous styles.
 */
export const lockBodyScroll = () => {
    const { body, documentElement } = document;

    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    // width of the vertical scrollbar (0 on mobile / overlay scrollbars / non-scrollable pages)
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    if (scrollbarWidth > 0) {
        const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    body.style.overflow = "hidden";

    return () => {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPaddingRight;
    };
};