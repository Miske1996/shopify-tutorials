// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        //Scroll Behaviors
        this.initScrollToBehaviors();
        //Init ProductSelectionInput
        this.initProductSelectionInput();

        //Accordeon Drop down
        this.initAccordeonDropDown();

        //Grid Image Inside Description Part
        this.removeImageToProductDescInMobile();
        window.addEventListener('resize', () => {
          this.removeImageToProductDescInMobile();
        });

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth',
            });
          });
        });

        //initScrollCardsImagesInMobile
        this.initScrollImagesCardsMainImage = this.initScrollImagesCardsMainImage.bind(this);
        this.smoothScroll = this.smoothScroll.bind(this);
        this.ease = this.ease.bind(this);
        this.debouncedTouchEnd = this.debouncedTouchEnd.bind(this);
        this.scrollInProgress = false;  
        this.startX = null; // Define startX as a property of the class instance
        this.startScrollLeft = null; //
        this.initScrollImagesCardsMainImage();

        // Retrieve product data and metafields from the embedded script tag
        const scriptTag = document.getElementById('product-data');
        const { product, metafields, text_primary_color, currency } = JSON.parse(scriptTag.textContent);
        this.product = product;
        this.metafields = metafields;
        this.primaryTextColor = text_primary_color;
        this.currency = currency[0];
        this.allProducts = [];
        let index_variant = 0;
        this.product.options.forEach((o, i) => {
          if (o === 'Color') {
            index_variant = i;
          }
        });
        this.variant = this.product.variants[0].options[index_variant].split('|')[1];

        this.colorWithVariantsUrl = [
          {
            color: this.product.variants[0].options[index_variant].split('|')[0],
            url: '/products/' + this.product.handle,
          },
        ];
        this.selected_variant = this.product.variants[0].id;
        //Size Option
        this.initSizeOptions();

        //Show Buy button
        this.showBuyButtonFixed();

        //Preview images
        this.initImagesPreview();

        //OpenDrawerCart
        this.initOpenDrawer();

        //QTE init
        this.initQteButtons();
        this.currentMin = 1;
        this.currentMax = null;

 
        var lastScrollPosition = 0;

        let product_section_container = document.querySelector(".product_section_container").clientHeight;
        var windowHeight = product_section_container;

        var target = this.querySelector(".main_product_section");
        var startIncreasingScroll = 4.8 * parseFloat(getComputedStyle(document.documentElement).fontSize);

        window.addEventListener('scroll', function() {
          var scrollY = window.scrollY;

          if (scrollY >= startIncreasingScroll && lastScrollPosition < startIncreasingScroll) {
            target.style.position = 'sticky';
            target.style.top = '0';
          } else if (scrollY < startIncreasingScroll && lastScrollPosition >= startIncreasingScroll) {
            target.style.position = 'relative';
            target.style.top = 'auto';
          } else if (scrollY >= windowHeight && scrollY <= 2 * windowHeight) {
            target.style.position = 'sticky';
            // target.style.top = (windowHeight - startIncreasingScroll) + 'px';
          } else if (scrollY > 2 * windowHeight && lastScrollPosition <= 2 * windowHeight) {
            target.style.position = 'sticky';
            // target.style.top = (3 * windowHeight - scrollY + startIncreasingScroll) + 'px';
          }

          lastScrollPosition = scrollY;
        });
      
      }
      /////////////////////////////////////////////////////
      ////////////////////////////////////////////////////
      /////////////////                //////////////////
      ////////////////  CART API PART //////////////////
      ///////////////                //////////////////
      ////////////////////////////////////////////////
      //Open Drawer CART
      initOpenDrawer() {
          let buy_button_container = this.querySelector('.buy_button_container');
          let qte_text_amount = this.querySelector('.qte_text_amount');
          
          buy_button_container.addEventListener('click', () => {
              this.loading(true);
          let cart = document.querySelector('cart-drawer');
          console.log(qte_text_amount.innerHTML)
          let formData = {
              items: [
              {
                  id: this.selected_variant,
                  quantity: parseInt(qte_text_amount.innerHTML),
              },
              ],
          };

          fetch(window.shopUrl + 'cart/add.js?sections=cart-drawer-section,header-section', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
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
                  cart.open();
                  cart.querySelector('.close_icon_container').addEventListener('click', cart.closeEvent.bind(cart));
              }
              })
              .catch((error) => {
              console.error('Error:', error);
              }).finally(() => {
                  this.loading(false);
              });;

    
          });

          // let add_cart = this.querySelector('.add_cart');
          // add_cart.addEventListener('click', () => {
          // this.loading(true);
          // let cart = document.querySelector('cart-drawer');

          // let formData = {
          //     items: [
          //     {
          //         id: this.selected_variant,
          //         quantity: parseInt(qte_text_amount.innerHTML),
          //     },
          //     ],
          // };

          // fetch(window.shopUrl + 'cart/add.js?sections=cart-drawer-section', {
          //     method: 'POST',
          //     headers: {
          //     'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify(formData),
          // })
          //     .then((response) => {
          //     return response.json();
          //     })
          //     .then((res) => {
          //     if (res.status) {
          //         this.querySelector('.error_quantity').classList.remove('hide_error');
          //         return;
          //     } else {
          //         document.querySelector('#shopify-section-cart-drawer-section .drawer_menu_inner').innerHTML =
          //         new DOMParser()
          //             .parseFromString(res.sections['cart-drawer-section'], 'text/html')
          //             .querySelector('#shopify-section-cart-drawer-section .drawer_menu_inner').innerHTML;
          //         cart.open();
          //         cart.querySelector('.close_icon_container').addEventListener('click', cart.closeEvent.bind(cart));
          //     }
          //     })
          //     .catch((error) => {
          //     console.error('Error:', error);
          //     }).finally(() => {
          //         this.loading(false);
          //     });

        
          // });
      
      }
      loading(isLoading){
          let size_container = this.querySelector(".size_container");
          let qtes_wraper = this.querySelector(".qtes_wraper");
          let buy_button_container = this.querySelector(".buy_button_container");
          let add_cart = this.querySelector(".add_cart");
          let img_bag = document.querySelector(".img_bag");
          if(isLoading){    
              if(size_container){size_container.classList.add("isLoading");}
              if(qtes_wraper){qtes_wraper.classList.add("isLoading");}
              if(buy_button_container){buy_button_container.classList.remove("buy_active_button");}
              if(add_cart){add_cart.classList.add("isLoading");}
              if(img_bag){img_bag.classList.add("isLoading");}
          }else{
              if(size_container){size_container.classList.remove("isLoading");}
              if(qtes_wraper){qtes_wraper.classList.remove("isLoading");}
              if(buy_button_container){buy_button_container.classList.add("buy_active_button");}
              if(add_cart){add_cart.classList.remove("isLoading");}
              if(img_bag){img_bag.classList.remove("isLoading");}
          }
      }
      ///////////////////////////////////////////////
      //////////////////////////////////////////////
      /////////////////           /////////////////
      ////////////////  UI PART  /////////////////
      ///////////////           /////////////////
      //////////////////////////////////////////
      //Qte Init
      initQteButtons() {
        let qte_plus = this.querySelector('.qte_plus');
        let qte_minus = this.querySelector('.qte_minus');
        let qte_text_amount = this.querySelector('.qte_text_amount');
        qte_plus.addEventListener('click', () => {
          this.querySelector('.error_quantity').classList.add('hide_error');

          if (this.currentMax) {
            if (parseInt(qte_text_amount.innerHTML) + 1 <= this.currentMax) {
              qte_text_amount.innerHTML = parseInt(qte_text_amount.innerHTML) + 1;
            }
          } else {
            qte_text_amount.innerHTML = parseInt(qte_text_amount.innerHTML) + 1;
          }
        });
        qte_minus.addEventListener('click', () => {
          this.querySelector('.error_quantity').classList.add('hide_error');

          if (parseInt(qte_text_amount.innerHTML) > this.currentMin) {
            qte_text_amount.innerHTML = parseInt(qte_text_amount.innerHTML) - 1;
          }
        });
      }
      setColorListVariants(products) { 
        products.forEach((product) => {
          if (product.id != this.product.id) {
            let index_variant = 0;
            product.options.forEach((o, i) => {
              if (o.name === 'Color') {
                index_variant = i;
              }
            });

            if (product.options.length > 1) {
              
              if (product.options[index_variant].values[0].split('|')[1] == this.variant) {
                this.colorWithVariantsUrl.push({
                  color: product.options[index_variant].values[0].split('|')[0],
                  url: '/products/' + product.handle,
                  colorName:product.options[index_variant].values[0].split("|").slice(-1)[0]
                });
              }
            }
          }
        });

        let colors_selection = this.querySelector('.colors_selection');
        if (this.colorWithVariantsUrl.length == 1) {
          // Find the element with the class "sizes_wraper"
          const colors_contianer = document.querySelector('.color_selector_container');

          // Check if the element exists before attempting to remove it
          if (colors_contianer) {
            // Remove the element
            colors_contianer.parentNode.removeChild(colors_contianer);
          }
        } else {
          let specific_current_color = this.querySelector('.specific_current_color');
          const productColors = this.metafields.product_color_type.split(',');
          const productColor = productColors[0].toUpperCase(); 

          specific_current_color.innerHTML = productColor;
          this.colorWithVariantsUrl.forEach((c,index) => {

            const colorCircle = document.createElement('div');
            colorCircle.classList.add('color_option_container');
            colorCircle.innerHTML = `<a class="color_option" href="${c.url}" style="background-color: ${c.color};"></a>`;

            if(index == 0){
              colorCircle.style.border = `2px solid ${c.color}`;
            }
            // Add hover effect using event listeners
            colorCircle.addEventListener('mouseover', () => {
              // colorCircle.style.border = `2px solid ${c.color}`;

                      // Create and position the span element
              const span = document.createElement('h1');
              span.classList.add('product_color_span');
              span.innerHTML = c.colorName;
              if(index == 0){
                const productColors = this.metafields.product_color_type.split(',');
                const productColor = productColors[0].toUpperCase(); 
                span.textContent = productColor;
              }
              span.style.position = 'absolute';
              span.style.top = '-38%'; // Adjust the distance from the colorCircle
              span.style.left = '50%'; // Center the span horizontally
              span.style.transform = 'translateX(-60%)'; // Adjust to center the span
              span.style.fontSize = "1rem";
              span.style.fontWeight = "bold";
              span.style.color = "inherit";
              span.style.width = "fit-content";
              span.style.whiteSpace = "nowrap";
              span.style.textAlign = "center";
              colorCircle.appendChild(span);
            });

            colorCircle.addEventListener('mouseout', () => {
              if(index != 0){
                colorCircle.style.border = 'none';
              }
              const span = colorCircle.querySelector('.product_color_span');
              if (span) {
                  span.remove(); // Remove the span element when mouse leaves
              }
            });

            colors_selection.appendChild(colorCircle);
          });
        }
      }
      setProductColor() {
        const productColorElement = this.querySelector('.product_txt');

        // Check if the product color metafield exists
        if (this.metafields.product_color_type) {
          const productColors = this.metafields.product_color_type.split(',');
          const productColor = productColors[0].toUpperCase(); // Assuming the first color is the primary color

          // Update the product color element
          productColorElement.textContent = `${productColor} PRODUCTS`;

         
        }
        
      }
      async connectedCallback() {
        let currentPage = 1;

        let that = this;
        async function fetchProducts() {
          const response = await fetch(`/products.json?page=${currentPage}`);
          const { products } = await response.json();

          if (products.length > 0) {
            that.allProducts = that.allProducts.concat(products);
            currentPage++;
            // Fetch the next page
            await fetchProducts();
          }
        }

        // Start fetching products
        await fetchProducts();
        this.setColorListVariants(this.allProducts);
      }
  
      initScrollImagesCardsMainImage() {
        const dots = document.querySelectorAll('.dot');
        const images = document.querySelectorAll('.scroll_images_container img');
        const container = document.querySelector('.scroll_images_container');
        

        dots.forEach((dot, index) => {
            if (index === 0) {
                dot.style.opacity = '1';
            }
            dot.addEventListener('click', () => {
                const imageOffsetLeft = images[index].offsetLeft;
                const targetScroll = imageOffsetLeft;

                this.smoothScroll(container, container.scrollLeft, targetScroll, 500);

                dots.forEach(dot => dot.style.opacity = '0.5');
                dot.style.opacity = '1';
            });
        });

        container.addEventListener('touchstart', event => {
            if (!this.scrollInProgress) { // Check if scroll animation is not in progress
                this.startX = event.touches[0].pageX;
                this.startScrollLeft = container.scrollLeft;
            }
        });

        container.addEventListener('touchend', this.debouncedTouchEnd);
    }

    debouncedTouchEnd(event) {
        if (!this.scrollInProgress) { // Check if scroll animation is not in progress
            const container = document.querySelector('.scroll_images_container');
            const dots = document.querySelectorAll('.dot');
            const images = document.querySelectorAll('.scroll_images_container img');

            const endX = event.changedTouches[0].pageX;
            const swipeDistance = this.startX - endX;
            const containerWidth = container.offsetWidth;
            const quarterWidth = containerWidth / 4;

            let targetScroll;
            if (swipeDistance >= quarterWidth) {
                targetScroll = this.startScrollLeft + containerWidth;
            } else if (swipeDistance <= -quarterWidth) {
                targetScroll = this.startScrollLeft - containerWidth;
            } else {
                targetScroll = this.startScrollLeft;
            }

            this.scrollInProgress = true; // Set scroll in progress

            this.smoothScroll(container, this.startScrollLeft, targetScroll, 500, () => {
                // Callback function to reset scrollInProgress flag after animation completes
                this.scrollInProgress = false;
            });

            // Update dots
            const index = Math.round(targetScroll / containerWidth);
            dots.forEach(dot => dot.style.opacity = '0.5');
            dots[index].style.opacity = '1';
        }
    }

    smoothScroll(container, currentScroll, targetScroll, duration, callback) {
        const startTime = performance.now();
        const endTime = startTime + duration;

        function step() {
            const currentTime = performance.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = this.ease(progress);

            container.scrollLeft = currentScroll + (targetScroll - currentScroll) * easeProgress;

            if (currentTime < endTime) {
                requestAnimationFrame(step);
            } else {
                if (callback && typeof callback === 'function') {
                    callback(); // Call the callback function after animation completes
                }
            }
        }

        step = step.bind(this);
        requestAnimationFrame(step);
    }

    ease(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
      initAccordeonDropDown() {
        // This is for adding brake lines
        let p_s = this.querySelectorAll('p');
        p_s.forEach((p) => {
          if (p.clientHeight == '0') {
            p.innerHTML = '<br>';
          }
        });
        let dropdown_items = this.querySelectorAll('.dropdown_item');
        dropdown_items.forEach((item) => {
          let dropdown_title = item.querySelector('.dropdown_title');

          dropdown_title.addEventListener('click', () => {
            let textual_desc = item.querySelector('.text_dropdown_desc');
            if (textual_desc.classList.contains('active_dropdown')) {
              textual_desc.classList.remove('active_dropdown');
              dropdown_title.classList.remove('active_title');
            } else {
              textual_desc.classList.add('active_dropdown');
              dropdown_title.classList.add('active_title');
            }
          });
        });
      }
      initProductSelectionInput() {
        let input_selection = this.querySelector('.selected_value_container');
        let selection_list = this.querySelector('.values_container');
        if (input_selection) {
          input_selection.addEventListener('click', () => {
            selection_list.classList.toggle('active_selection');
          });
          document.addEventListener('click', (event) => {
            const isClickInsideSelectionList = selection_list.contains(event.target);
            const isClickInsideInput = input_selection.contains(event.target);
            
            if (!isClickInsideSelectionList && !isClickInsideInput) {
                selection_list.classList.remove('active_selection');
            }
        });
        }
      }
      initSizeOptions() {
        let buy_button_container = this.querySelector('.buy_button_container');

        let size_id = 0;
        this.product.options.forEach((o, i) => {
          if (o === 'Size') {
            size_id = i;
          }
        });
        let sizes = [];

        this.product.variants.forEach((v) => {
          if (v.available) {
            sizes.push(v.options[size_id]);
          } else {
            sizes.push(v.options[size_id] + '-not-available');
          }
        });
        console.log(sizes)
        if (sizes[0] == undefined) {
          // Find the element with the class "sizes_wraper"
          const sizesWrapper = document.querySelector('.sizes_wraper');

          // Check if the element exists before attempting to remove it
          if (sizesWrapper) {
            // Remove the element
            sizesWrapper.parentNode.removeChild(sizesWrapper);
          }
          buy_button_container.classList.add('buy_active_button');
          this.querySelector('.qtes_wraper').classList.remove('disabled');
          // this.querySelector('.add_cart').classList.remove('disabled');
        } else {
          let size_container = this.querySelector('.size_container');
          sizes.forEach((s, k) => {
            const sizeDiv = document.createElement('div');
            sizeDiv.classList.add('size_option');
            if (s.includes('not-available')) {
              sizeDiv.classList.add('not-available');
            }
            sizeDiv.innerHTML = `<span class="size_txt">${s.replace('-not-available', '')}</span>`;
            size_container.appendChild(sizeDiv);
          });

          let size_options = this.querySelectorAll('.size_option');
          if (size_options.length > 0) {
            size_options.forEach((size_option, i) => {
              size_option.querySelector('.size_txt').style.color = this.primaryTextColor;
              size_option.style.border = '2px solid ' + this.primaryTextColor;
              this.querySelector('.buy_button_container').innerHTML =
                  'CHOOSE SIZE - ' + this.currency + (this.product.variants[i].price / 100).toFixed(2);
              size_option.addEventListener('click', () => {
                this.querySelector('.error_quantity').classList.add('hide_error');
                this.querySelector('.qtes_wraper').classList.remove('disabled');
                // this.querySelector('.add_cart').classList.remove('disabled');

                if (!buy_button_container.classList.contains('buy_active_button')) {
                  buy_button_container.classList.add('buy_active_button');
                }
                this.selected_variant = this.product.variants[i].id;
                this.querySelector('.buy_button_container').innerHTML =
                  'ADD TO CART - ' + this.currency + (this.product.variants[i].price / 100).toFixed(2);
                this.querySelector('.buy_button_fixed_version .price_p').innerHTML =
                  this.currency + (this.product.variants[i].price / 100).toFixed(2);
                  this.querySelector('.buy_button_fixed_version .price_p_compare').innerHTML =
                  this.currency + (this.product.variants[i].compare_at_price / 100).toFixed(2);
                this.currentMin = this.product.variants[i].quantity_rule.min;
                this.currentMax = this.product.variants[i].quantity_rule.max;
                this.querySelector('.qte_text_amount').innerHTML = this.currentMin;
                this.querySelector('.price_product').innerHTML =
                  this.currency + (this.product.variants[i].price / 100).toFixed(2);
                this.querySelector('.compared_at_price').innerHTML =
                  this.currency + (this.product.variants[i].compare_at_price / 100).toFixed(2);
                size_option.style.backgroundColor = this.primaryTextColor;
                size_option.querySelector('.size_txt').style.color = 'white';
                size_options.forEach((s) => {
                  if (s != size_option) {
                    s.style.backgroundColor = 'transparent';
                    s.querySelector('.size_txt').style.color = this.primaryTextColor;
                  }
                });
              });
            });
            if(size_options.length == 1){
              size_options[0].click();
            }
          }
        }
      }
      removeImageToProductDescInMobile() {
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const gridImagesContainer = this.querySelector('.grid_images_container');
        const descriptionContainer = this.querySelector(".description_container");
        if (screenWidth < 770) {
            // Check if gridImagesContainer and descriptionContainer exist
            if (gridImagesContainer && descriptionContainer) {
                // Move grid images before descriptionContainer
                descriptionContainer.parentNode.insertBefore(gridImagesContainer, descriptionContainer);
            }
        } else {
            // If screen width is greater than or equal to 770, move grid images back to their original position
            // Assuming the original position is inside productImagesContainer
            const productImagesContainer = this.querySelector('.product_images_container');
            if (gridImagesContainer && productImagesContainer) {
                productImagesContainer.appendChild(gridImagesContainer);
            }
        }
    }
    
      showBuyButtonFixed() {
        const buyButton = this.querySelector('.buy_button_container');
        const buyButtonFixedVersion = this.querySelector('.buy_button_fixed_version');
        let isBuyButtonVisible = true;

        // Check if buyButton and buyButtonFixedVersion exist
        if (buyButton) {
          // Add scroll event listener
          let lastScrollTop = 0;
          window.addEventListener('scroll', () => {
            // Check if buyButton is visible
            isBuyButtonVisible = this.isElementInViewport(buyButton);

            if (!isBuyButtonVisible && buyButton.getBoundingClientRect().bottom <= 0) {
              // BuyButton is not visible and the top of the viewport has surpassed the bottom of buyButton
              buyButtonFixedVersion.classList.add('translateY_0');
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
              // Check the scroll direction
              const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
              
              // Update the last scroll position
              lastScrollTop = scrollTop;
          
              // Check if the user has reached the bottom of the page
              const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight;
              if (scrollDirection === 'down' && isAtBottom) {
                  // Scrolling down and reached the bottom of the page
                  buyButtonFixedVersion.classList.remove('translateY_0');
              } else if (scrollDirection === 'up') {
                  // Scrolling up
                  buyButtonFixedVersion.classList.add('translateY_0');
              }
            } else {
              // BuyButton is visible or not surpassed yet
              buyButtonFixedVersion.classList.remove('translateY_0');
              
            }
          
          });
        }
      }
      isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }
      initImagesPreview() {
        //***************************************************//
        //***************************************************//
        //****************** SCROLL LOGIC *******************//
        //***************************************************//
        //***************************************************//
        let preview_images_container = this.querySelector('.preview_images_container');
        //Close Preview
        let close = this.querySelector('.close');
        close.addEventListener('click', () => {
          preview_images_container.style.display = 'none';
        });

        //Open Preview
        let images_cards_product = this.querySelectorAll('.grid_img');
        let display_img_desktop = this.querySelector(".display_img_desktop");
        images_cards_product.forEach((grid_image,index) => {
          grid_image.addEventListener('click', () => {
            preview_images_container.style.display = 'flex';
             // Calculate the scroll position based on the index of the clicked grid image
             const cardWidth = imagesContainer.querySelector('.image_preview_card').offsetWidth;
             const scrollPosition = (index+1) * cardWidth;
             
             // Scroll the imagesContainer to the calculated position with animation
             imagesContainer.scrollTo({
                 left: scrollPosition,
             });
             
             // Update the current image text
             updateCurrentImageText();
          });
        });
        display_img_desktop.addEventListener('click',()=>{
          preview_images_container.style.display = 'flex';
             // Calculate the scroll position based on the index of the clicked grid image
             const cardWidth = imagesContainer.querySelector('.image_preview_card').offsetWidth;
             const scrollPosition = (index+1) * cardWidth;
             
             // Scroll the imagesContainer to the calculated position with animation
             imagesContainer.scrollTo({
                 left: scrollPosition,
             });
             
             // Update the current image text
             updateCurrentImageText();
        })
      

        //Counting images
        let currentImageText = this.querySelector('.current_image');

        const leftArrow = this.querySelector('.left_arrow');
        const rightArrow = this.querySelector('.right_arrow');
        const imagesContainer = this.querySelector('.images_container');

        const updateCurrentImageText = () => {
          const containerWidth = imagesContainer.clientWidth;
          const scrollPosition = imagesContainer.scrollLeft;
          const cardWidth = imagesContainer.querySelector('.image_preview_card').offsetWidth;
          const currentIndex = Math.ceil(scrollPosition / cardWidth) + 1;
          currentImageText.innerText = currentIndex.toString();
        };

        let isDragging = false;
        let touchStartX = 0;
        let scrollStartX = 0;

        // Function to scroll left
        const scrollLeft = debounce(() => {
          // Scroll to the previous image_preview_card with animation
          imagesContainer.scrollTo({
            left: imagesContainer.scrollLeft - imagesContainer.clientWidth,
            behavior: 'smooth',
          });
          setTimeout(updateCurrentImageText, 300);
        }, 1000); // Adjust the debounce delay as needed

        // Function to scroll right
        const scrollRight = debounce(() => {
          // Scroll to the next image_preview_card with animation
          imagesContainer.scrollTo({
            left: imagesContainer.scrollLeft + imagesContainer.clientWidth,
            behavior: 'smooth',
          });
          setTimeout(updateCurrentImageText, 300);
        }, 400); // Adjust the debounce delay as needed

        // Function to handle touch start event
        const handleTouchStart = (event) => {
          touchStartX = event.touches[0].clientX;
          scrollStartX = imagesContainer.scrollLeft;
          isDragging = true;
        };

        let isScrolling = false; // Flag to track scrolling state

        // Function to handle touch move event
        const handleTouchMove = (event) => {
          if (!isDragging) return;
          const touchMoveX = event.touches[0].clientX;
          const dragDistance = touchMoveX - touchStartX;
          const containerWidth = imagesContainer.clientWidth;
          const threshold = containerWidth * 0.1; // Threshold set to 30% of container width

          if (Math.abs(dragDistance) > threshold && !isScrolling) {
            const scrollAmount = Math.sign(dragDistance) * containerWidth;
            isScrolling = true; // Set scrolling flag
            imagesContainer.scrollTo({
              left: scrollStartX - scrollAmount,
              behavior: 'smooth',
            });
            setTimeout(() => {
              isScrolling = false; // Reset scrolling flag after a delay
              updateCurrentImageText();
            }, 300); // Adjust delay time as needed
          }
        };

        // Function to handle touch end event
        const handleTouchEnd = () => {
          isDragging = false;
        };

        // Function to handle mouse down event
        const handleMouseDown = (event) => {
          isDragging = true;
          touchStartX = event.clientX;
          scrollStartX = imagesContainer.scrollLeft;
          imagesContainer.style.cursor = 'grabbing';
        };

        // Function to handle mouse move event
        const handleMouseMove = (event) => {
          if (!isDragging) return;
          const currentX = event.clientX;
          const dragDistance = currentX - touchStartX;
          const containerWidth = imagesContainer.clientWidth;
          const threshold = containerWidth * 0.1; // Threshold set to 30% of container width

          if (Math.abs(dragDistance) > threshold) {
            const scrollAmount = Math.sign(dragDistance) * containerWidth;
            imagesContainer.scrollTo({
              left: scrollStartX - scrollAmount,
              behavior: 'smooth',
            });
            updateCurrentImageText();
          }
        };

        // Function to handle mouse up event
        const handleMouseUp = () => {
          isDragging = false;
          imagesContainer.style.cursor = 'grab';
        };

        // Add event listeners to arrows
        leftArrow.addEventListener('click', () => {
          scrollLeft();
          // setTimeout(updateCurrentImageText, 300); // Update current image number after scrolling
        });
        rightArrow.addEventListener('click', () => {
          scrollRight();
          // setTimeout(updateCurrentImageText, 300); // Update current image number after scrolling
        });

        // Add scroll event listener to update current image number
        // imagesContainer.addEventListener('scroll', updateCurrentImageText);

        // Add touch event listeners to images container
        // imagesContainer.addEventListener('touchstart', handleTouchStart);
        // imagesContainer.addEventListener('touchmove', handleTouchMove);
        // imagesContainer.addEventListener('touchend', handleTouchEnd);

        // Add mouse event listeners to images container
        // imagesContainer.addEventListener('mousedown', handleMouseDown);
        // imagesContainer.addEventListener('mousemove', handleMouseMove);
        // imagesContainer.addEventListener('mouseup', handleMouseUp);

        //***************************************************//
        //***************************************************//
        //****************** ZOOM LOGIC *********************//
        //***************************************************//
        //***************************************************//
      }
      initScrollToBehaviors(){
        let add_cart_scroll_to_button = this.querySelector(".add_cart_scroll_to_button");
        let see_description = this.querySelector(".see_description");
        add_cart_scroll_to_button.addEventListener('click',() => {

          let qtes_wraper = this.querySelector(".qtes_wraper");
          const offset = qtes_wraper.offsetTop;
          const scrollOffset = 50;
          window.scrollTo({
            top: offset - scrollOffset,
            behavior: 'smooth'
        });
        });

        see_description.addEventListener('click',() => {

          let target = this.querySelector(".description_container");
          const offset = target.offsetTop;
          const scrollOffset = 50;
          window.scrollTo({
            top: offset - scrollOffset,
            behavior: 'smooth'
        });
        });
      }
    }
  );
}
