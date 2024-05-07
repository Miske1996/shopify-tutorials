class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.cart_drawer_section_container = this.querySelector(".cart_drawer_section_container");
    this.drawer_menu_inner = this.querySelector(".drawer_menu_inner");
    this.drawer_menu_overlay = this.querySelector(".drawer_menu_overlay");
    this.close_icon_container = this.querySelector(".close_icon_container img");
    this.close();
  }

  open() {

    document.querySelector("body").style.overflowY = "hidden";
    this.cart_drawer_section_container.style.display = "flex";
    this.cart_drawer_section_container.style.opacity = "1";

    setTimeout(() => {
      this.drawer_menu_inner.style.transform = "translateX(0%)";
    }, 150);
  }
  closeEvent() {
    document.querySelector("body").style.overflowY = "scroll"
      this.drawer_menu_inner.style.transform = "translateX(100%)";
      this.cart_drawer_section_container.style.opacity = "0";
      setTimeout(() => {
        this.cart_drawer_section_container.style.display = "none";
      }, 500);
  }
  close() {
    this.close_icon_container.addEventListener('click', () => {

      document.querySelector("body").style.overflowY = "scroll"
      this.drawer_menu_inner.style.transform = "translateX(100%)";
      this.cart_drawer_section_container.style.opacity = "0";
      setTimeout(() => {
        this.cart_drawer_section_container.style.display = "none";
      }, 500);

    })
    this.drawer_menu_overlay.addEventListener('click', () => {
      document.querySelector("body").style.overflowY = "scroll"
      this.drawer_menu_inner.style.transform = "translateX(100%)";
      this.cart_drawer_section_container.style.opacity = "0";
      setTimeout(() => {
        this.cart_drawer_section_container.style.display = "none";
      }, 500);
    })
  }


}
customElements.define('cart-drawer', CartDrawer);