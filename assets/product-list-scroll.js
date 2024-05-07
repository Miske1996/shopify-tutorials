if (!customElements.get('product-list-scroll')) {
    customElements.define(
        'product-list-scroll',
        class ProductListScroll extends HTMLElement {
            constructor() {
                super();
                this.initScrollButtons();
            }
            initScrollButtons() {
                document.addEventListener("DOMContentLoaded", function () {
                    const buttonPrevious = this.querySelector(".button_previous");
                    const buttonNext = this.querySelector(".button_next");
                    const productsContainer = this.querySelector(".products_container");


                    // Function to update arrow visibility based on scroll position
                    const updateArrowVisibility = () => {
                        const isAtStart = productsContainer.scrollLeft === 0;
                        const isAtEnd = productsContainer.scrollLeft + productsContainer.clientWidth >= productsContainer.scrollWidth;

                        buttonPrevious.style.opacity = isAtStart ? 0 : 1;
                        buttonNext.style.opacity = isAtEnd ? 0 : 1;

                    };

                    // Event listener for scroll changes
                    productsContainer.addEventListener("scroll", updateArrowVisibility);

                    // Event listeners for arrow clicks
                    buttonPrevious.addEventListener("click", () => {
                        const scrollAmount = -productsContainer.offsetWidth;
                        productsContainer.scrollTo({
                            left: productsContainer.scrollLeft + scrollAmount,
                            behavior: "smooth"
                        });
                    });

                    buttonNext.addEventListener("click", () => {
                        const scrollAmount = productsContainer.offsetWidth;
                        productsContainer.scrollTo({
                            left: productsContainer.scrollLeft + scrollAmount,
                            behavior: "smooth"
                        });
                    });

                    // Initial check for arrow visibility
                    updateArrowVisibility();
                    document.addEventListener("DOMContentLoaded", function () {
                        if (productsContainer.scrollWidth > productsContainer.clientWidth) {
                            buttonNext.style.opacity = 1;
                        }
                    });
                });


            }
        }

    )
}