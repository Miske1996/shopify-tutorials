class Collection extends HTMLElement {
    constructor() {
        super();


        //List to get all sizes
        this.available_size = [];
        this.querySelectorAll(".txt_select_line").forEach((t) => {
            this.available_size.push(t.innerHTML);
        })
        this.filtered_sizes = [];
        this.querySelectorAll(".tag_title").forEach((tag) => {
            if(this.available_size.includes(tag.innerHTML)){
                this.filtered_sizes.push(tag.innerHTML)
            }
        })
        this.productColorPrimary = this.getAttribute('productCardPrimaryColor');
      
        // Selecting elements
        const scrollLeftContainer = this.querySelector('.scroll_left_container');
        const scrollRightContainer = this.querySelector('.scroll_right_container');
        const collectionBtnsContainer = this.querySelector('.collection_btns_container');

        // Handling initial visibility
        scrollLeftContainer.style.visibility = 'hidden'; // Initially hide left scroll container

        // Handling click events
        scrollLeftContainer.addEventListener('click', () => {
            collectionBtnsContainer.scroll({
                left: collectionBtnsContainer.scrollLeft - 200, // Adjust the scroll distance as needed
                behavior: 'smooth'
            });
        });

        scrollRightContainer.addEventListener('click', () => {
            collectionBtnsContainer.scroll({
                left: collectionBtnsContainer.scrollLeft + 200, // Adjust the scroll distance as needed
                behavior: 'smooth'
            });
        });

        // Handling scroll event to toggle visibility of scroll containers
        collectionBtnsContainer.addEventListener('scroll', () => {
            if (collectionBtnsContainer.scrollLeft === 0) {
                scrollLeftContainer.style.visibility = 'hidden'; // Hide left scroll container if at the beginning
            } else {
                scrollLeftContainer.style.visibility = 'visible'; // Show left scroll container if scrolled to the left
            }

            if (collectionBtnsContainer.scrollLeft + collectionBtnsContainer.clientWidth >= collectionBtnsContainer.scrollWidth) {
                scrollRightContainer.style.visibility = 'hidden'; // Hide right scroll container if at the end
            } else {
                scrollRightContainer.style.visibility = 'visible'; // Show right scroll container if not at the end
            }
        });

        // Check if scroll bars are visible initially
        if (collectionBtnsContainer.scrollWidth > collectionBtnsContainer.clientWidth) {
            scrollRightContainer.style.visibility = 'visible';
        }else{
            scrollRightContainer.style.visibility = 'hidden';

        }
        // PRODUCT TAGS CODE  
        this.products = JSON.parse(this.querySelector('script[type="application/json"]').innerHTML);
        console.log(JSON.parse(this.querySelector('script[type="application/json"]').innerHTML))
        this.products.forEach(function (product) {

            if (Array.isArray(product.tags) && product.tags.length > 0 && Array.isArray(product.tags) && product.tags.length < 3) {
                // Assuming product.tags is an array with a single element
                var tagsData = product.tags[0];

                product.tags = tagsData
                    .filter(function (tag) {
                        return typeof tag === 'string' && tag.includes(',');
                    })
                    .map(function (tag) {
                        var tagParts = tag.split(',');
                        return {
                            label: tagParts[0],
                            color: tagParts[1]
                        };
                    });
            }
        });
        // Group products by variant ID and replace with variants when show_all_variants is 'all_variants'
        const updatedProducts = [];
        this.products.forEach(product => {
            if (product.variants && Array.isArray(product.variants) && this.filtered_sizes.length == 0) {
                product.variants.forEach(variant => {
                    updatedProducts.push({ 
                        ...product,
                        title: product.title + " - " + variant.title.split("/")[0] ,
                        price: this.getAttribute("curreny") + " " + (variant.price / 100).toFixed(2), // Use Shopify.formatMoney for formatting
                        url: product.url,
                        variant_id: variant.id,
                        front_image: product.front_image,
                        back_image: product.back_image
                    });
                });
            }else if(product.variants && Array.isArray(product.variants) && this.filtered_sizes.length > 0){
                
                product.variants.forEach(variant => {
                    if(this.filtered_sizes.includes(variant.option1)){
                        updatedProducts.push({ 
                            ...product,
                            title: product.title + " - " + variant.title.split("/")[0] ,
                            price: this.getAttribute("curreny") + " " + (variant.price / 100).toFixed(2), // Use Shopify.formatMoney for formatting
                            url: product.url,
                            variant_id: variant.id,
                            front_image: product.front_image,
                            back_image: product.back_image
                        });
                    }
                   
                });
            }
             else {
                updatedProducts.push(product);
            }
        });
        this.products = updatedProducts;
        // Extract unique colors from products
        this.uniqueColorsFilter = [...new Set(this.products.map(product => product.color))];

        let sz = [];
        this.products.forEach((p) => {
            p.variants.forEach((v) => {
                if(v.option1.split("|").length > 1){
                    sz.push(v.option1.split("|")[1])
                }
            })
        })
        this.sizes_filter_options = [...new Set(sz)];
        this.initCardsProducts();

        this.filter_drawer = this.querySelector(".filter_drawer");
        this.drawer_menu_inner = this.querySelector(".drawer_menu_inner");
        this.drawer_menu_overlay = this.querySelector(".drawer_menu_overlay");
        this.close_icon_container = this.querySelector(".close_icon_container");
        this.inner_links_subtree_ = this.querySelectorAll(".inner_link_subtree");
        this.open();
        this.close();
        this.inner_link_subtree();

        this.initFilters();


        
    }

    initFilters(){
        let main_links_container = this.querySelector(".main_links_container");
        let sorting_lines = this.querySelectorAll(".sort_buy_line");
        sorting_lines.forEach((sl) => {
            sl.addEventListener('click' , () => {
                sorting_lines.forEach((s) => {
                    s.classList.remove("active")
                })
                sl.classList.add("active")
            }) 
        })
        // let submenu_container = this.querySelectorAll(".nav_drawer_main_link")[1].querySelector(".submenu_container");
        // this.sizes_filter_options.forEach((sz) => {
          
        //     let el = document.createElement("div");
        //     el.classList.add("select_buy_line");
        //     el.innerHTML = `<div class="select_container">
        //                         <div class="inner_select"></div>
        //                     </div>
        //                     <h5 class="txt_select_line">${sz}</h5>`;
        //     submenu_container.appendChild(el);
        // })
        let sizes_lines = this.querySelectorAll(".select_buy_line");
        sizes_lines.forEach((sl) => {
            let input_select_size = sl.querySelector(".input-select-size");
            if(input_select_size.checked){
                sl.classList.add('active')
            }
            sl.addEventListener('click' , () => {

                if(sl.classList.contains("active")){
                    sl.classList.remove('active');
                    input_select_size.checked = false;
                }else{
                    sl.classList.add('active')
                    input_select_size.checked = true;

                }
            })
        })
        let colors_filter = this.querySelectorAll(".color_buy_line");

        colors_filter.forEach((cl) => {
            
            let input_select_color = cl.querySelector(".input-select-color");
            if(input_select_color.checked){
                cl.classList.add('active')
            }
            cl.addEventListener('click',() => {
                if(cl.classList.contains("active")){
                    cl.classList.remove('active')
                    input_select_color.checked = false;

                }else{
                    cl.classList.add('active')
                    input_select_color.checked = true;

                }
            })
        })
    }

    initCardsProducts() {
        const productsContainer = this.querySelector('.products_container');

        // Group products by variant ID
        const productsByVariant = {};
        this.products.forEach(product => {
            let variantId = product.variant;

            // If variantId is empty, set it to product title
            if (!variantId) {
                variantId = product.title;
            }

            if (!productsByVariant[variantId]) {
                productsByVariant[variantId] = [];
            }
            productsByVariant[variantId].push(product);
        });

        // Create product cards dynamically
        for (const variantId in productsByVariant) {
            const variantProducts = productsByVariant[variantId];
            variantProducts.forEach((product, index) => {
                const productCard = document.createElement('div');
                productCard.classList.add('product_card');
                const variant_url = (c) =>{
                    for (const p of productsByVariant[variantId]) {
                        if (p.color === c) {
                            return p.url;
                        }
                    }
                    return '#';
                }

                productCard.innerHTML = `
                    <a class="product_images_container" href="${product.url}">
                        <img src="${product.front_image}" alt="" class="top">
                        <img src="${product.back_image}" alt="" class="bottom">
                    </a>
                    ${
                        product.tags && product.tags.length > 0
                            ? `<span class="product_badge">${product.tags.map((tag, index) => `<span style="color:${tag.color}; margin-left:${index === 0 ? '0' : '0.42vw'};">${tag.label}</span>`).join('')}</span>`
                            : '<span class="product_badge"></span>'
                    }
                    <a class="product_title" href="${product.url}" style="text-decoration:none;color:${this.productColorPrimary};">${product.title}</a>
                    <div
                              class="loox-rating"
                              data-id="${product.id}"
                              data-rating="${product.data_rating}"
                              data-raters="${product.data_raters}"
                              data-pattern="[count] Reviews"
                              style="font-size: 15px"
                            ></div>
                    <div class="bottom_container">
                    ${this.uniqueColorsFilter.map(color => `<a class="color_product" href="${variant_url(color)}" style="background-color: ${color}"></a>`).join('')}
                    <a class="see_more" style="color:${this.productColorPrimary}80;text-decoration:none;" href="${product.url}">See more</a>
                    <div class="prices_container"><span class="price_product_compare">${this.getAttribute('showVariants') === 'all_variants' ? product.compare_at_price : this.getAttribute('curreny')  + (product.variants[0].compare_at_price / 100).toFixed(2) }</span><span class="price_product">${product.price}</span></div>
                        
                    </div>
                    
                `;
                productsContainer.appendChild(productCard);
            });
        }
    }

    open(){
        document.addEventListener("DOMContentLoaded",  () => {
            let filter_main_btn = this.querySelector(".filter_main_btn")
            filter_main_btn.addEventListener('click', () => {
                document.querySelector("body").style.overflowY = "hidden"
                this.filter_drawer.style.display = "flex";   
                this.filter_drawer.style.opacity = "1";   
                setTimeout(() => {
                    this.drawer_menu_inner.style.transform = "translateX(0)";  
                },50);
            })
          });
       
    }
     
    close(){
        this.close_icon_container.addEventListener('click',() => {
            document.querySelector("body").style.overflowY = "scroll"

            this.drawer_menu_inner.style.transform = "translateX(-100%)";  
            this.filter_drawer.style.opacity = "0";   

            setTimeout(() => {
                this.filter_drawer.style.display = "none";   
                this.inner_links_subtree_.forEach((inner_ln) => {
                    inner_ln.closest(".nav_drawer_main_link").classList.remove("active_link_subtree");
                    inner_ln.querySelector(".arrow_img").classList.remove("rotate_arrow")
                
            })
            },500);
        })
        this.drawer_menu_overlay.addEventListener('click',() => {
            document.querySelector("body").style.overflowY = "scroll"
            this.drawer_menu_inner.style.transform = "translateX(-100%)"; 
            this.filter_drawer.style.opacity = "0";    
            setTimeout(() => {
                this.filter_drawer.style.display = "none";   
                this.inner_links_subtree_.forEach((inner_ln) => {
                        inner_ln.closest(".nav_drawer_main_link").classList.remove("active_link_subtree");
                        inner_ln.querySelector(".arrow_img").classList.remove("rotate_arrow")
                    
                })
            },500); 
        })   
    }

    inner_link_subtree(){
        this.inner_links_subtree_.forEach((inner_link) => {
            inner_link.addEventListener('click',()=> {
                inner_link.closest(".nav_drawer_main_link").classList.toggle("active_link_subtree");
                inner_link.querySelector(".arrow_img").classList.toggle("rotate_arrow")
            })
        })
    }
}

customElements.define('collection-section', Collection);
