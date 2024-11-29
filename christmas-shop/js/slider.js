let sliderPosition = 0; //initial position
const container = document.querySelector('.slider-row');
const slider = document.querySelector('.slider');
const sliderRight = document.getElementById('slider-right');
const sliderLeft = document.getElementById('slider-left');
let windowWidth = window.innerWidth;
console.log(windowWidth);
let step = 3;
( windowWidth > 768 ? step = 3 : step = 6 );
console.log(step);


let sliderStep = ( slider.clientWidth - container.clientWidth ) / step;

sliderRight.addEventListener('click', ()=>{
    sliderPosition -= sliderStep;
    ( sliderPosition < 0 ? 
        sliderLeft.classList.add('slider-button-active') :
        sliderLeft.classList.remove('slider-button-active')
    );
    slider.style.transform = `translateX(${sliderPosition}px)`;
});

sliderLeft.addEventListener('click', ()=>{
    sliderPosition += sliderStep;
    ( sliderPosition >= 0 ? 
        sliderRight.classList.add('slider-button-active') :
        sliderRight.classList.remove('slider-button-active')
    );
    slider.style.transform = `translateX(${sliderPosition}px)`;
});