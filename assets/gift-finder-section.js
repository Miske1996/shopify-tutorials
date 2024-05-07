if (!customElements.get('gift-finder-section')) {
    customElements.define(
        'gift-finder-section',
        class GiftFinderSection extends HTMLElement {
            constructor() {
                super();
                this.current_step = 0;
                this.stepsHandler();
                this.collections_list = ["/collections/friends", "/collections/mentor", "/collections/family"]
                this.prices_list = ["?filter.v.price.lte=69", "?filter.v.price.gte=69", ""];
                this.chosen_collection = "";
                this.price = "";
            }
            stepsHandler() {
                let progress_tabs = this.querySelectorAll(".progress_tab");
                let render_begin = this.querySelector(".render_begin");
                let render_steps = this.querySelectorAll(".render_step");
                render_steps = [render_begin, ...render_steps]
                let gift_finder_btns = this.querySelectorAll(".gift_finder_btn");
                let back_btn = this.querySelector(".back_btn");
                gift_finder_btns.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        if (this.current_step < 3) {
                            //Update the current Step
                            this.current_step += 1;
                            if (this.current_step == 1) {
                                back_btn.style.opacity = 1;
                                back_btn.style.display = "flex";
                            }
                            //Update Progress Bar
                            progress_tabs[this.current_step].classList.add("current_step");

                            //Show The next Step
                            render_steps[this.current_step].style.opacity = 1;
                            render_steps[this.current_step].style.display = "flex";
                            //Hide The previous Step
                            render_steps[this.current_step - 1].style.opacity = 0;
                            render_steps[this.current_step - 1].style.display = "none";

                            //Find the choices 
                            if (this.current_step == 3) {
                                switch (btn.classList[1]) {
                                    case "block-2-answer-1":
                                        this.chosen_collection = this.collections_list[0]
                                        break;
                                    case "block-2-answer-2":
                                        this.chosen_collection = this.collections_list[1]
                                        break;
                                    case "block-2-answer-3":
                                        this.chosen_collection = this.collections_list[2]
                                        break;
                                    default:
                                        break;
                                }
                            }
                             

                        } else {
                             //Find the price choice 
                            switch (btn.classList[1]) {
                                case "block-3-answer-1":
                                    this.price = this.prices_list[0]
                                    break;
                                case "block-3-answer-2":
                                    this.price = this.prices_list[1]
                                    break;
                                case "block-3-answer-3":
                                    this.price = this.prices_list[2]
                                    break;
                                default:
                                    break;
                            }
                            
                            let final_animation_container = this.querySelector(".final_animation_container");
                            final_animation_container.style.opacity = 1
                            final_animation_container.style.visibility = "visible"
                            setTimeout(() => {
                                var baseURL = window.location.origin;

                                // Desired path to add
                                var pathToAdd = this.chosen_collection + this.price;

                                // Redirect to the base URL with the desired path added
                                window.location.href = baseURL + pathToAdd;
                            }, 5000);
                        }

                    });
                })
                back_btn.addEventListener("click", () => {
                    if (this.current_step > 0) {
                        this.current_step -= 1;
                        if (this.current_step == 0) {
                            back_btn.style.opacity = 0;
                            back_btn.style.display = "none";
                        }
                        //Update Progress Bar
                        progress_tabs[this.current_step].classList.add("current_step");
                        progress_tabs[this.current_step + 1].classList.remove("current_step");

                        //Show The Previous Step
                        render_steps[this.current_step].style.opacity = 1;
                        render_steps[this.current_step].style.display = "flex";
                        //Hide The Next Step
                        render_steps[this.current_step + 1].style.opacity = 0;
                        render_steps[this.current_step + 1].style.display = "none";
                    }
                })
            }
        })
}