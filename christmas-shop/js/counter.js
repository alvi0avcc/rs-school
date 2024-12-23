// targetDate ( Year, Mon, Day, H, M, S )
function Counter( ...targetDate ){
    const findCounter = () => {
        const days = document.getElementById('counter-days');
        const hours = document.getElementById('counter-hr');
        const min = document.getElementById('counter-min');
        const sec = document.getElementById('counter-sec');
        
        return [ days, hours, min, sec ];
    };
    
    const counterElement = findCounter();

    setInterval( ()=>{
        changeCounter( counterElement, differenceDate(targetDate) );
    },1000);
}

// difference  between date (ms) => [ days, hr, min, sec, msec ]
function differenceDate( targetDate ){
    let currentDate = new Date();
    // console.log('local = ',currentDate);
    const offset = currentDate.getTimezoneOffset(); //offset in minutes
    // console.log('offset = ',offset);
    currentDate = +currentDate;
    // console.log('number = ',currentDate);
    currentDate += offset * 60000; //correction date to UTC +0
    // console.log('offset number = ',currentDate);
    // console.log('date offset = ', new Date(currentDate) );
    target = new Date( ...targetDate ).getTime();
    let diff = target - currentDate;
    // let days = Math.trunc( diff / 1000 / 60 / 60 / 24 );
    let days = Math.trunc( diff / 86400000 );
    // diff = diff - days * 24*60*60*1000;
    diff -= days * 86400000;
    // let hr = Math.trunc( diff / 1000 / 60 / 60 );
    let hr = Math.trunc( diff / 3600000 );
    // diff = diff - hr * 60 * 60 * 1000;
    diff -= hr * 3600000;
    // let min = Math.trunc( diff / 1000 / 60 );
    let min = Math.trunc( diff / 60000  );
    // diff = diff - min * 60 * 1000;
    diff -= min * 60000;
    let sec = Math.trunc( diff / 1000 );
    diff -= sec * 1000;
    
return [days,hr,min,sec, diff];
}

function changeCounter( counterElement, remains ){
    counterElement[0].innerHTML = remains[0]; // days
    counterElement[1].innerHTML = remains[1]; // hours
    counterElement[2].innerHTML = remains[2]; //min
    counterElement[3].innerHTML = remains[3]; //sec
}


// run function
Counter( 2025, 0, 1 );
