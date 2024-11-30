let giftsData = [];

window.onload = ()=>{
    // console.log('page loaded');
    let path = "";
    if ( document.URL.indexOf('/pages/') != -1 ) path = '../'; //what page loaded

    fetch(`${path}data/gifts.json`).then( (response)=>{
        // console.log(response);
        response.json().then( (data)=>{
            giftsData = data;
            console.log(giftsData);
            ( path === "" ? giftsForMain() : giftsForGifts() );
        });
    })
}

function giftsForMain(){
    const giftsLength = giftsData.length;
    // console.log('page 1 giftsLength = ',giftsLength);
    const lottery = [];
    for ( let i = 0; i < 4; i++){
        lottery.push( Math.floor( Math.random() * giftsLength ) );
        // console.log('lottery = ',lottery);
    }

    for ( let i = 0; i < 4; i++){
        // console.log('current card = ',giftsData[lottery[i]] );
        
        const giftCard = document.getElementById(`card-${i+1}`);
        let category = '';

        switch  (giftsData[lottery[i]].category) {
            case 'For Work':
                category = 'for-work';
                break;
            case 'For Health':
                category = 'for-health';
                break;
            case 'For Harmony':
                category = 'for-harmony';
                break;
            default:
            console.error('error! Gift category not found');
        };

        giftCard.classList.add(category);
        const data =`
                <div class="image-container"></div>
                <div class="gift-description">
                    <h4>${giftsData[lottery[i]].category}</h4>
                    <h3>${giftsData[lottery[i]].name}</h3>
                </div>
        `;
        giftCard.innerHTML = data;
     }
}

function giftsForGifts(){
    const giftsLength = giftsData.length;
    console.log('page 2 giftsLength = ',giftsLength);
    
}