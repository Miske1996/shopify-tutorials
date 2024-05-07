if (!customElements.get('review-list-scroll')) {
    customElements.define(
        'review-list-scroll',
        class ReviewList extends HTMLElement {
            constructor() {
                super();
                let tabs = this.querySelectorAll(".tab");
                let reviews = this.querySelectorAll(".review");
                document.addEventListener("DOMContentLoaded", () => {
                    tabs.forEach((tab,index) => {
                        tab.addEventListener('click',() => {
                            reviews.forEach((review) => {
                                review.style.opacity = "0";
                            })
                            reviews[index].style.opacity = "1";
                        })
                    });
                });
            }

        }

    )
}