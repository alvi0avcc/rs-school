let sliderPosition = 0; //initial position
const body = document.querySelector('body');
const container = document.querySelector('.slider-row');
const slider = document.querySelector('.slider');
const sliderRight = document.getElementById('slider-right');
const sliderLeft = document.getElementById('slider-left');
let windowWidth; //window width
let step; // step counter
let sliderStep; //step in pixel

function CheckResize(){
    windowWidth = window.innerWidth;
    ( windowWidth > 768 ? step = 3 : step = 6 );
    sliderStep = Math.round( ( slider.clientWidth - container.clientWidth ) / step );
}

body.onresize = () => { 
    sliderPosition = 0;
    sliderLeft.classList.remove('slider-button-active');
    sliderRight.classList.add('slider-button-active');
    slider.style.transform = `translateX(0px)`;
    CheckResize();
    const burger = document.querySelector('.burger-menu');
    burger.classList.remove('burger-menu-x');
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.remove('move');
    setTimeout(()=>{
        navMenu.classList.remove('show');
    },500);

    if (body.clientWidth > 768 ) {
        navMenu.classList.remove('nav-menu-burger');
    }else navMenu.classList.add('nav-menu-burger');
    isOpenMenu = false;
 };

sliderRight.addEventListener('click', ()=>{
    if ( sliderRight.classList.contains('slider-button-active') ) {
        sliderPosition -= sliderStep;
        ( sliderPosition < 0 ?
            sliderLeft.classList.add('slider-button-active') : sliderLeft.classList.remove('slider-button-active') );
        ( sliderPosition <= -sliderStep * step  ?
            sliderRight.classList.remove('slider-button-active') : sliderRight.classList.add('slider-button-active') );
        slider.style.transform = `translateX(${sliderPosition}px)`;
    }
});

sliderLeft.addEventListener('click', ()=>{
    if ( sliderLeft.classList.contains('slider-button-active') ) {
        sliderPosition += sliderStep;
        
        sliderRight.classList.add('slider-button-active');
        ( sliderPosition >= 0 ?
            sliderLeft.classList.remove('slider-button-active') : sliderLeft.classList.add('slider-button-active')
        );
        slider.style.transform = `translateX(${sliderPosition}px)`;
    }
});

CheckResize();