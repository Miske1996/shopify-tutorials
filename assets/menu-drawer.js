class MenuDrawer extends HTMLElement {
    constructor() {
      super();
      this.menu_drawer_section_container = this.querySelector(".menu_drawer_section_container");
      this.drawer_menu_inner = this.querySelector(".drawer_menu_inner");
      this.drawer_menu_overlay = this.querySelector(".drawer_menu_overlay");
      this.close_icon_container = this.querySelector(".close_icon_container");
      this.inner_links_subtree_ = this.querySelectorAll(".inner_link_subtree");
      this.open();
      this.close();
      this.inner_link_subtree();
    }

    open(){
        document.addEventListener("DOMContentLoaded",  () => {
            let more_button = document.querySelectorAll(".left_menu_header_container .more_button")
            
         
            more_button.forEach((more_btn) => {
                more_btn.addEventListener('click', () => {
                    document.querySelector("body").style.overflowY = "hidden"
                    this.menu_drawer_section_container.style.display = "flex";   
                    this.menu_drawer_section_container.style.opacity = "1";   
                    setTimeout(() => {
                        this.drawer_menu_inner.style.transform = "translateX(0)";  
                    },50);
                })
            })
          });
       
    }
     
    close(){
        this.close_icon_container.addEventListener('click',() => {
            document.querySelector("body").style.overflowY = "scroll"

            this.drawer_menu_inner.style.transform = "translateX(-100%)";  
            this.menu_drawer_section_container.style.opacity = "0";   

            setTimeout(() => {
                this.menu_drawer_section_container.style.display = "none";   
                this.inner_links_subtree_.forEach((inner_ln) => {
                    inner_ln.closest(".nav_drawer_main_link").classList.remove("active_link_subtree");
                    inner_ln.querySelector(".arrow_img").classList.remove("rotate_arrow")
                
            })
            },500);
        })
        this.drawer_menu_overlay.addEventListener('click',() => {
            document.querySelector("body").style.overflowY = "scroll"
            this.drawer_menu_inner.style.transform = "translateX(-100%)"; 
            this.menu_drawer_section_container.style.opacity = "0";    
            setTimeout(() => {
                this.menu_drawer_section_container.style.display = "none";   
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
customElements.define('menu-drawer', MenuDrawer); 