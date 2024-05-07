if (!customElements.get('gift-finder')) {
    customElements.define(
        'gift-finder',
        class GiftFinder extends HTMLElement {
            constructor() {
                super();
                this.current_step = 0;
                this.collection_choice = "";
                this.price_range_choice = "";
                this.collection_choices_list = ["/collections/family","/collections/mentor","/collections/friends"]
                this.prices_ranges_list = ["?filter.v.price.lte=69","?filter.v.price.gte=69",""]
                this.stepsHandler();
                
            }
            stepsHandler(){
                let final_animation_screen = this.querySelector(".final_animation_screen");
                let back_btn_wrapper = this.querySelector(".back_btn_wrapper");
                let step_bars = this.querySelectorAll(".step_bar");
                let steps = this.querySelectorAll(".step_container");
                let buttons = this.querySelectorAll(".btn");

                buttons.forEach((btn) => {
                    btn.addEventListener("click",() => {
                        if(this.current_step < 3){
                            this.current_step += 1;
                            if(this.current_step == 1){
                                back_btn_wrapper.style.opacity = 1;
                            }
                            steps[this.current_step - 1].classList.remove("current_step");
                            steps[this.current_step].classList.add("current_step");
                            
                            step_bars[this.current_step].classList.add("current_step");

                        }else{
                            final_animation_screen.style.opacity = 1;
                            final_animation_screen.style.visibility = "visible";
                            
                            //Select The choices here, For the collection it will be random
                            this.collection_choice = this.collection_choices_list[Math.floor(Math.random() * this.collection_choices_list.length)];

                            //The price range will be selected from the last Step 3
                            switch (btn.classList[1]) {
                                case "step-3-answer-1":
                                    this.price_range_choice =  this.prices_ranges_list[0];
                                    break;
                                case "step-3-answer-2":
                                    this.price_range_choice =  this.prices_ranges_list[1];
                                    break;
                                case "step-3-answer-3":
                                    this.price_range_choice =  this.prices_ranges_list[2];
                                    break;
                                default:
                                    break;
                            }

                            //Redirect to the url
                            setTimeout(() => {
                                window.location.href = window.origin + this.collection_choice + this.price_range_choice;
                            }, 5000);
                        }
                    })
                })
                back_btn_wrapper.addEventListener('click',() =>  {
                    if(this.current_step > 0){
                        this.current_step -= 1;
                        console.log(this.current_step)
                        if(this.current_step == 0){
                            back_btn_wrapper.style.opacity = 0;
                        }
                        steps[this.current_step].classList.add("current_step");
                        steps[this.current_step + 1].classList.remove("current_step");

                        step_bars[this.current_step + 1].classList.remove("current_step");

                    }
                });
            }
        })
}