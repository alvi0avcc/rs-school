function HeaderAdd(){
    const header = document.querySelector("#header");
    let path = "";
    if ( document.URL.indexOf('/pages/') != -1 ) path = '../'

    let data = `
        <div class="nav-container">
            <a href="${path}index.html" class="logo">
                <img src="${path}images/logo/logo.svg" alt="logo image">
                <p>THE&nbsp;GIFTS</p>
            </a> 
            <nav class="nav-menu-container">
                    <ul class="nav-menu">
                        <li><a href="${path}pages/gifts.html">GIFTS</a></li>
                        <li><a href="#about-section">ABOUT</a></li>
                        <li><a href="#gift-section">BEST</a></li>
                        <li><a href="#footer">CONTACTS</a></li>
                    </ul>
                    <svg class="burger-menu" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 16H30" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10 24H30" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
            </nav>
        </div>
        `;

    header.innerHTML = data;
    
    // for burger-menu
    const burgerButton = document.querySelector('.burger-menu');
    burgerButton.addEventListener( 'click', ()=>{
        console.log('burger :)');
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('show');
        // const navMenuContainer = document.querySelector('.nav-menu-container');
        navMenu.classList.toggle('nav-menu-burger');
    });
};

// run All
HeaderAdd();