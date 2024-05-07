if (!customElements.get('blogs-component')) {
    customElements.define(
        'blogs-component',
        class Blogs extends HTMLElement {
            constructor() {
                super();
                document.addEventListener("DOMContentLoaded",  () => {
                    this.querySelectorAll(".blog_item").forEach((blog) =>{
                        blog.querySelectorAll("span,h1,h2,h3,h4,h5,h6,p").forEach((p,key) => {
                            if(key>0){
                                p.innerHTML = "";
                            }else{
                               // Limit the content of the first span to 50 characters
                                const originalText = p.textContent;
                                p.textContent = originalText.length > 90 ? originalText.substring(0, 90) + "..." : originalText;
                            }
                        })
                    })

                    this.querySelectorAll(".main_blog").forEach((blog) =>{
                        blog.querySelectorAll("span,h1,h2,h3,h4,h5,h6,p").forEach((p,key) => {
                            if(key>0){
                                p.innerHTML = "";
                            }else{
                               // Limit the content of the first span to 50 characters
                                const originalText = p.textContent;
                                p.textContent = originalText.length > 200 ? originalText.substring(0, 200) + "..." : originalText;
                            }
                        })
                    })
                    
                })

                 //CTA BUTTON PROPERTIES
                 this.ctaHoverBg = this.getAttribute('ctaHoverBg');
                 this.ctaHovertext = this.getAttribute('ctaHoverColor');
                 this.ctaNoHoverBg = this.getAttribute('ctaNoHoverBg');
                 this.ctaNoHovertext = this.getAttribute('ctaNoHoverColor');
                this.initCTAButton();
            }
            initCTAButton() {
                const hoverStyles = `
                .action_button_blog:hover{
                    background-color: ${this.ctaHoverBg};
                    border: 2px solid ${this.ctaNoHoverBg};
                    color:${this.ctaHovertext};
                }
                .action_button_blog{
                    background-color: ${this.ctaNoHoverBg};
                    border: 2px solid ${this.ctaNoHoverBg};
                    color:${this.ctaNoHovertext};
                }
              `;

                const styleElement = document.createElement('style');
                styleElement.textContent = hoverStyles;

                document.head.appendChild(styleElement);
            }
        }
    )
} 