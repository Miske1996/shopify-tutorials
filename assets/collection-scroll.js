if (!window.customElements.get('collection-scroll')) {
class CollectionScroll extends HTMLElement {
    constructor() {
      super();
    // Get elements
    const scrollContainer = this.querySelector('.collections_list_scroll');
    const leftArrow = this.querySelector('.left_arrow');
    const rightArrow = this.querySelector('.right_arrow');

    // Calculate scroll amount (25% of container width)
    const scrollAmount = scrollContainer.clientWidth * 0.5;

    // Add click event listeners to arrows
    leftArrow.addEventListener('click', () => {
        // Scroll to the left
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
        // Scroll to the right
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Update arrow visibility based on scroll position
    scrollContainer.addEventListener('scroll', () => {
        // Check if at the start
        leftArrow.style.opacity = scrollContainer.scrollLeft === 0 ? '0' : '1';

        // Check if at the end
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        rightArrow.style.opacity = scrollContainer.scrollLeft >= maxScroll ? '0' : '1';
    });
    }
}
customElements.define('collection-scroll', CollectionScroll);}
