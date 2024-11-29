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
    let isOpenMenu = false;

    const burgerButton = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    // navMenu.classList.add('show');

    burgerButton.addEventListener( 'click', ()=>{
        console.log(isOpenMenu);
        burgerButton.classList.toggle('burger-menu-x');

        if ( !isOpenMenu ) {
            navMenu.classList.toggle('nav-menu-burger');
            navMenu.classList.toggle('show');
            setTimeout(()=>{
                navMenu.classList.toggle('move');
            },0);
        }else{
            navMenu.classList.toggle('move');
            setTimeout(()=>{
                navMenu.classList.toggle('nav-menu-burger');
                navMenu.classList.toggle('show');
            },500);
        }

        isOpenMenu = !isOpenMenu;
        
    });
    
    navMenu.addEventListener('click',(events)=>{
        console.log(events);
        ( events.target.localName === "a" ? (
            isOpenMenu = false,
            burgerButton.classList.remove('burger-menu-x'),
            navMenu.classList.toggle('move'),
            navMenu.classList.remove('show'),
            navMenu.classList.remove('nav-menu-burger')
            ) : ''
        );
    });

    window.onscroll = ()=>{
        if ( isOpenMenu ){
            burgerButton.classList.remove('burger-menu-x');
            navMenu.classList.toggle('move');
            setTimeout(()=>{
                navMenu.classList.toggle('nav-menu-burger');
                navMenu.classList.toggle('show');
            },500);
            isOpenMenu = false;
        }
    };
};

// run All
HeaderAdd();