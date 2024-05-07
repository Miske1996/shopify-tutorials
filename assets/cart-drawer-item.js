if (!customElements.get('cart-drawer-item')) {
    customElements.define(
        'cart-drawer-item',
        class CartDrawerItem extends HTMLElement {
            constructor() {
                super();
                this.quantity = this.getAttribute("quantity");
                this.max_qte = this.getAttribute("quantity_max");
                this.min_qte = this.getAttribute("quantity_max");
                this.id = this.getAttribute("id");
                this.line = this.getAttribute("line");
                this.initQteButtons();
                this.deleteButtonInit();
               

            }
            //DeleteItemButton
            deleteButtonInit(){
                let remove_item = this.querySelector(".remove_item_x");
                remove_item.addEventListener('click',() => {
                    this.deleteItem();
                });
            }
            //Qte Init
            initQteButtons() {
                let qte_plus = this.querySelector('.qte_plus');
                let qte_minus = this.querySelector('.qte_minus');
                let qte_text_amount = this.querySelector('.qte_text_amount');
            
                qte_plus.addEventListener('click', () => {
                    this.querySelector('.error_quantity').classList.add('hide_error');
                    if (this.max_qte) {
                        if (parseInt(qte_text_amount.innerHTML) + 1 <= this.max_qte) {
                        this.quantity = parseInt(qte_text_amount.innerHTML) + 1;
                        this.updateCart(this.quantity)
                        }
                    } else {
                        this.quantity = parseInt(qte_text_amount.innerHTML) + 1;
                        this.updateCart(this.quantity)
                    }
                });
                qte_minus.addEventListener('click', () => {
                    this.querySelector('.error_quantity').classList.add('hide_error');

                    if (parseInt(qte_text_amount.innerHTML) > this.min_qte) {
                        this.quantity = parseInt(qte_text_amount.innerHTML) - 1;
                        this.updateCart(this.quantity);

                    }
                });
            }

            updateCart(qte){
                this.loading(true);
                let cart = document.querySelector('cart-drawer');
                let line = this.line.toString();
                fetch(window.shopUrl + 'cart/change.js?sections=cart-drawer-section,cart-section,header-section', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({ 
                            'line': line,
                            'quantity': qte              
                     })
                })
                    .then((response) => {
                    return response.json();
                    })
                    .then((res) => {
                    if (res.status) {
                        this.querySelector('.error_quantity').classList.remove('hide_error');
                        return;
                    } else {
                        document.querySelector('#shopify-section-header-section .red_dot').replaceWith(new DOMParser()
                  .parseFromString(res.sections['header-section'], 'text/html')
                  .querySelector('#shopify-section-header-section .red_dot'))
                        document.querySelector('#shopify-section-cart-drawer-section .drawer_menu_inner').innerHTML =
                        new DOMParser()
                            .parseFromString(res.sections['cart-drawer-section'], 'text/html')
                            .querySelector('#shopify-section-cart-drawer-section .drawer_menu_inner').innerHTML;
                    
                        cart.querySelector('.close_icon_container').addEventListener('click', cart.closeEvent.bind(cart));

                        let cart_section_container = document.querySelector(".cart_section_container");
                        if(cart_section_container){
                            let parentNode = this.closest('.shopify-section');
                            if(parentNode){
                                parentNode.querySelector(".cart_section_container").innerHTML =
                                new DOMParser()
                                    .parseFromString(res.sections['cart-section'], 'text/html')
                                    .querySelector('.shopify-section .cart_section_container').innerHTML;
                            }
                            
                        }
                    }
                    })
                    .catch((error) => {
                    console.error('Error:', error);
                    }).finally(() => {
                        this.loading(false);
                    });
            }

            deleteItem(){
                this.loading(true);
                let cart = document.querySelector('cart-drawer');
                let line = this.line;
                fetch(window.shopUrl + 'cart/change.js?sections=cart-drawer-section,cart-section,header-section', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({ 
                            'line': this.line,
                            'quantity': 0              
                     })
                    })
                    .then((response) => {
                    return response.json();
                    })
                    .then((res) => {
                    if (res.status) {
                        this.querySelector('.error_quantity').classList.remove('hide_error');
                        return;
                    } else {
                        document.querySelector('#shopify-section-header-section .red_dot').replaceWith(new DOMParser()
                        .parseFromString(res.sections['header-section'], 'text/html')
                        .querySelector('#shopify-section-header-section .red_dot'))
                        document.querySelector('#shopify-section-cart-drawer-section .drawer_menu_inner').innerHTML =
                        new DOMParser()
                            .parseFromString(res.sections['cart-drawer-section'], 'text/html')
                            .querySelector('#shopify-section-cart-drawer-section .drawer_menu_inner').innerHTML;
                        cart.querySelector('.close_icon_container').addEventListener('click', cart.closeEvent.bind(cart));

                        let cart_section_container = document.querySelector(".cart_section_container");
                        if(cart_section_container){
                            let parentNode = this.closest('.shopify-section');
                            if(parentNode){
                                parentNode.querySelector(".cart_section_container").innerHTML =
                                new DOMParser()
                                    .parseFromString(res.sections['cart-section'], 'text/html')
                                    .querySelector('.shopify-section .cart_section_container').innerHTML;
                            }
                            
                        }
                    }
                    })
                    .catch((error) => {
                    console.error('Error:', error);
                    }).finally(() =>{
                        this.loading(false);
                    });
            }

            loading(isLoading){
                let products_cart_section = document.querySelector(".products_cart_section");
                let cart_footer = document.querySelector(".cart_footer .payment_button");
                let cart_section_container = document.querySelector(".cart_section_container");
                if(isLoading){  
                    setTimeout(() => {       
                    }, 500);  
                    if(products_cart_section){products_cart_section.classList.add("isLoading");}
                    if(cart_footer){cart_footer.classList.add("isLoading");}
                    if(cart_section_container){
                        let cart_items = cart_section_container.querySelector(".cart_items").classList.add("isLoading");
                    }
                }else{
                    if(products_cart_section){products_cart_section.classList.remove("isLoading");}
                    if(cart_footer){cart_footer.classList.remove("isLoading");}
                    if(cart_section_container){
                        let cart_items = cart_section_container.querySelector(".cart_items").classList.remove("isLoading");
                    }
                }
            }
        }   
    )
} 