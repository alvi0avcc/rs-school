function ButtonUp(){
    const body = document.querySelector('body');
    const up = document.createElement('div');

    up.classList.add('up');

    const data = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18 11L12 5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 11L12 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    `;

    const svg = document.createElementNS("http://www.w3.org/1999/xhtml", "svg");
    svg.innerHTML = data;

    up.appendChild(svg);
    body.appendChild(up);

        window.onscroll = () => {
            if ( window.matchMedia("(max-width: 768px)").matches ) {
                ( window.scrollY > 1 ? up.classList.add('show') : up.classList.remove('show') );
            } else up.classList.remove('show');
        };

    up.addEventListener('click', ()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
    });
};

// 
ButtonUp();