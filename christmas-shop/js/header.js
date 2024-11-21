const header = document.querySelector("#header");
let path = "";
if ( document.URL.indexOf('/pages/') != -1 ) path = '../'

const data = `
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
        </nav>
    </div>
    `;

header.innerHTML = data;