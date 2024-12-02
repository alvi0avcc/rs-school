
// console.log('modal loaded');
// console.log(giftsData);

let cardsForModal;

function getCardsForModal(){
    // console.log('updated');
    
    let cardsForModal = document.querySelectorAll('.gift-card');

    for( let card of cardsForModal ) {
        card.addEventListener('click', (events)=>{
            // console.log('card click = ', events.currentTarget);
            const idGift = events.currentTarget.getAttribute("id-gift");
            // console.log('card id = ', idGift);

            const dialog = document.getElementById('card-info');

            document.querySelector('html').classList.add('no-scroll');
            dialog.innerHTML = getCardData(idGift);
            const dialogClose = document.querySelector('.close-x');
            dialogClose.addEventListener('click', ()=>{
                dialog.close();
                document.querySelector('html').classList.remove('no-scroll');
            })
            dialog.addEventListener('click', (events)=>{
                if ( events.target == dialog ) {
                    dialog.close();
                    document.querySelector('html').classList.remove('no-scroll');
                }
            });
            dialog.showModal();
        })
    }

};

function getCardData(id){

    function getSnow(category){
        
        let result = "";

        for ( let i =0; i<5; i++ ){
            let point;

            if ( Number( giftsData[id].superpowers[category].slice(1) ) / 100 >= i+1 ){
                point = 'point';
            } else {
                point = '';
            }

            const snow = `
                <div class="power-star" ${point}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_41019_26)">
                            <path d="M12.1959 9.88162L11.6482 9.56542L13.1158 9.17219L12.8732 8.26704L10.5005 8.90278L9.38146 8.25667C9.39689 8.17336 9.40538 8.08765 9.40538 7.99997C9.40538 7.91229 9.39692 7.82655 9.38146 7.74327L10.5005 7.09716L12.8732 7.7329L13.1158 6.82775L11.6482 6.43452L12.1959 6.11831L14.546 5.97725L14.8921 4.02063L13.0246 3.34203L11.7274 5.30677L11.1797 5.62297L11.5729 4.15545L10.6678 3.91293L10.032 6.28561L8.91226 6.93211C8.78247 6.82103 8.63242 6.73313 8.4683 6.67494V5.3828L10.2052 3.64586L9.5426 2.98325L8.46827 4.05755V3.42515L9.51792 1.32584L7.99976 0L6.48157 1.3259L7.53122 3.42521V4.05761L6.45689 2.98332L5.79429 3.64592L7.53119 5.38286V6.675C7.36708 6.73319 7.21702 6.82109 7.08724 6.93217L5.96746 6.28568L5.33171 3.91299L4.42656 4.15551L4.81979 5.62304L4.27213 5.30684L2.9749 3.34209L1.10742 4.02069L1.45349 5.97731L3.80362 6.11838L4.35128 6.43458L2.88375 6.82781L3.1263 7.73296L5.49898 7.09722L6.61807 7.74333C6.60264 7.82664 6.59414 7.91235 6.59414 8.00003C6.59414 8.08771 6.60261 8.17345 6.61807 8.25673L5.49898 8.90285L3.1263 8.2671L2.88375 9.17226L4.35128 9.56548L3.80362 9.88169L1.45349 10.0227L1.10742 11.9793L2.97493 12.6579L4.27216 10.6932L4.81985 10.377L4.42662 11.8445L5.33177 12.087L5.96752 9.71435L7.0873 9.06786C7.21708 9.17894 7.36714 9.26684 7.53125 9.32503V10.6172L5.79435 12.3541L6.45696 13.0167L7.53129 11.9424V12.5748L6.48163 14.6741L7.99983 16L9.51802 14.6741L8.46837 12.5748V11.9424L9.5427 13.0167L10.2053 12.3541L8.4684 10.6172V9.32503C8.63251 9.26684 8.78257 9.17894 8.91235 9.06786L10.0321 9.71435L10.6679 12.087L11.573 11.8445L11.1798 10.377L11.7275 10.6932L13.0247 12.6579L14.8922 11.9793L14.5462 10.0227L12.1959 9.88162Z" fill="#FF4646" />
                        </g>
                        <defs>
                            <clipPath id="clip0_41019_26">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            `;
            result += snow;
        };

        return result;
    }
    

    const cardData = `
            <div class="card-info-image-container ${categoryToStyle(giftsData[id].category)}"></div>
            <div class="card-info-description border-radius-20">
                <div class="card-info-container ${categoryToStyle(giftsData[id].category)}">
                    <h4>${giftsData[id].category}</h4>
                    <h3>${giftsData[id].name}</h3>
                    <p>${giftsData[id].description}</p>
                </div>
                <div class="card-info-container">
                    <h4>Adds superpowers to:</h4>
                    <div class="container-superpowers">
                        <div class="superpower">
                            <p class="power-name">Live</p>
                            <p class="power-value">${giftsData[id].superpowers.live}</p>
                            <div class="power-stars-container">
                                ${getSnow('live')}
                            </div>
                        </div>
                        <div class="superpower">
                            <p class="power-name">Create</p>
                            <p class="power-value">${giftsData[id].superpowers.create}</p>
                            <div class="power-stars-container">
                                ${getSnow('create')}
                            </div>
                        </div>
                        <div class="superpower">
                            <p class="power-name">Love</p>
                            <p class="power-value">${giftsData[id].superpowers.love}</p>
                            <div class="power-stars-container">
                                ${getSnow('love')}
                            </div>
                        </div>
                        <div class="superpower">
                            <p class="power-name">Dream</p>
                            <p class="power-value">${giftsData[id].superpowers.dream}</p>
                            <div class="power-stars-container">
                                ${getSnow('dream')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="close-x">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 10L10 30" stroke="#181C29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10 10L30 30" stroke="#181C29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
            </div>
    `;

    return cardData;
};



// run
getCardsForModal();