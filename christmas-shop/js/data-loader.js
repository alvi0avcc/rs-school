let giftsData = [];

const tabs = document.querySelectorAll('.filter');
let filter = 'filter-all';

window.onload = ()=>{
    let path = "";
    if ( document.URL.indexOf('/pages/') != -1 ) path = '../'; //what page loaded

    fetch(`${path}data/gifts.json`).then( (response)=>{
        // console.log(response);
        response.json().then( (data)=>{
            giftsData = data;
            // console.log(giftsData);
            if( path === "" ){
                giftsForMain();
             }else{
                for( let element of tabs ) {
                    element.addEventListener('click',(events)=>{
                        for( let selected of tabs ) selected.classList.remove('active'); //clear selected tab
                        element.classList.add('active'); // add current selected tab
                        console.dir(events.target);
                        console.log('filter',events.target.attributes.filter.value);
                        console.log(events.target.id);
                        filter = events.target.attributes.filter.value;
                        giftsForGifts( tabSelect() );
                    });
                };
            
                giftsForGifts( giftsData );
             };
        });
    })
};


function tabSelect(){
    
    switch (filter) {
        case "filter-work":
            filter = "For Work";
            break;
        case "filter-health":
            filter = "For Health";
            break;
        case "filter-harmony":
            filter = "For Harmony";
            break;
        default:
            break;
    };

    let filteredGiftsData = [];

    if (filter == "filter-all") {
        filteredGiftsData = structuredClone(giftsData);
    }else{
        filteredGiftsData = giftsData.filter( function(param){ return param.category == filter; });
    }

    console.log(filteredGiftsData);

    return filteredGiftsData;
};

function giftsForMain(){
    const giftsLength = giftsData.length;
    const lottery = [];
    for ( let i = 0; i < 4; i++){
        lottery.push( Math.floor( Math.random() * giftsLength ) );
        // console.log('lottery = ',lottery);
    }

    const giftsCards = document.getElementById('gift-cards');
    for ( let i = 0; i < 4; i++){
        
        const giftCard = document.createElement('div');

        const category = categoryToStyle(giftsData[lottery[i]].category);

        giftCard.setAttribute('id', `card-${i+1}`);
        giftCard.classList.add( "gift-card", category );
        const data =`
                <div class="image-container"></div>
                <div class="gift-description">
                    <h4>${giftsData[lottery[i]].category}</h4>
                    <h3>${giftsData[lottery[i]].name}</h3>
                </div>
        `;

        giftCard.innerHTML = data;
        if( i == 3 ) {
            giftCard.classList.add('row-center');
        }
        giftsCards.appendChild(giftCard);
    }
}

function giftsForGifts(filteredGiftsData){
    
    const giftsLength = filteredGiftsData.length;
    
    const giftsCards = document.getElementById('gift-cards');
    giftsCards.innerHTML = "";

    for ( let i = 0; i < giftsLength; i++){
        const giftCard = document.createElement('div');
        const category = categoryToStyle(filteredGiftsData[i].category);

        giftCard.setAttribute('id', `card-${i+1}`);
        giftCard.classList.add( "gift-card", category );
        const data =`
                <div class="image-container"></div>
                <div class="gift-description">
                    <h4>${filteredGiftsData[i].category}</h4>
                    <h3>${filteredGiftsData[i].name}</h3>
                </div>
        `;

        giftCard.innerHTML = data;

        giftsCards.appendChild(giftCard);
    }
}

function categoryToStyle(category){
    let style = '';
    switch  (category) {
        case 'For Work':
            style = 'for-work';
            break;
        case 'For Health':
            style = 'for-health';
            break;
        case 'For Harmony':
            style = 'for-harmony';
            break;
        default:
        console.error('error! Gift category not found');
    };

    return style;
}