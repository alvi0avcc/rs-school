    // for burger-menu
    let isOpenMenu = false;

function HeaderAdd(){
    const header = document.querySelector("#header");
    let path = "";
    if ( document.URL.indexOf('/pages/') != -1 ) path = '../';

    let data = `
        <div class="nav-container">
            <a href="${path}index.html" class="logo">
                <img src="${path}images/logo/logo.svg" alt="logo image">
                <p>THE&nbsp;GIFTS</p>
            </a> 
            <nav class="nav-menu-container">
                    <ul class="nav-menu">
                        <li><a href="${path}pages/gifts.html">GIFTS</a></li>
                        <li><a href="${path}#about-section">ABOUT</a></li>
                        <li><a href="${path}#gift-section">BEST</a></li>
                        <li><a href="#footer">CONTACTS</a></li>
                    </ul>
                    <div class="burger-menu">
                        <div class="burger-part"></div>
                        <div class="burger-part"></div>
                    </div>
            </nav>
        </div>
        `;

    header.innerHTML = data;
    


    const burgerButton = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    // navMenu.classList.add('show');

    burgerButton.addEventListener( 'click', ()=>{
        // console.log(isOpenMenu);
        document.querySelector('html').classList.toggle('no-scroll');
        burgerButton.classList.toggle('burger-menu-x');

        if ( !isOpenMenu ) {
            navMenu.classList.add('nav-menu-burger');
            navMenu.classList.add('show');
            setTimeout(()=>{
                navMenu.classList.add('move');
            },0);
        }else{
            navMenu.classList.remove('move');
            setTimeout(()=>{
                navMenu.classList.remove('nav-menu-burger');
                navMenu.classList.remove('show');
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
            setTimeout(()=>{
                navMenu.classList.remove('nav-menu-burger');
                navMenu.classList.remove('show');
            },500),
            // navMenu.classList.remove('show'),
            // navMenu.classList.remove('nav-menu-burger'),
            document.querySelector('html').classList.remove('no-scroll')
            ) : ''
        );
    });
};

// run All
HeaderAdd();