// const test = document.querySelector('.test');
// const comp = document.querySelector('.pick-comp');
// test.addEventListener('click', (e) => {
//     comp.setAttribute('data-state', 'picked');
// })
let states = {
    playerPicked: '',
    compPicked: '',
    selectionState: 'initial'
}

let signs = [
    {icon: 'scissor', beats: ['lizard', 'paper']},
    {icon: 'paper', beats: ['rock', 'spock']},
    {icon: 'rock', beats: ['lizard', 'scissor']},
    {icon: 'lizard', beats: ['spock', 'paper']},
    {icon: 'spock', beats: ['scissor', 'rock']},
]

const selectionContainer = document.querySelector('div.selection[data-state=initial]');
const pickedContainer = document.querySelector('div.picked-container');
const selectionButtons = selectionContainer.querySelectorAll('button.btn-icon');
const score = document.querySelector('span.score');

window.addEventListener('load', (e) => {
    let scoreValue = window.localStorage.getItem('score');
    if (scoreValue == null) {
        window.localStorage.setItem('score', 0);
    } else {
        score.innerHTML = parseInt(window.localStorage.getItem('score'));
    }
})

selectionButtons.forEach(b => {
    b.addEventListener('click', (e) => {
        selectionContainer.setAttribute('data-state', 'picked');
        pickedContainer.setAttribute('data-state', 'picking');

        const icon = b.getAttribute('data-icon');
        states.playerPicked = icon;
        states.selectionState = 'picking';

        const playerSign = signs.find(s => s.icon == icon);
        const pickedUser = pickedContainer.querySelector('.pick-user');
        pickedUser.querySelector('.pick-container').appendChild(b.cloneNode(true));

        const index = randomIntFromInterval(0, selectionButtons.length - 1);
        const compButtonElement = selectionButtons.item(index);
        const compSign = signs.find(s => s.icon == compButtonElement.getAttribute('data-icon'));

        setTimeout(() => {
            const pickedComp = pickedContainer.querySelector('.pick-comp');
            pickedComp.querySelector('.pick-container').appendChild(compButtonElement.cloneNode(true));
            pickedComp.setAttribute('data-state', 'picked');

            pickedContainer.setAttribute('data-state', 'finished');
            const pickedResultContainer = pickedContainer.querySelector('div.picked-result-container');
            const pickResult = pickedResultContainer.querySelector('span.picked-result');

            if (compSign.beats.includes(icon)) {
                // Comp win
                pickResult.innerHTML = "You Lose";
                pickedComp.setAttribute('data-state', 'won');
            } else if (playerSign.beats.includes(compSign.icon)) {
                // Player win
                pickResult.innerHTML = "You Win";
                pickedUser.setAttribute('data-state', 'won');
                let newScore = parseInt(window.localStorage.getItem('score')) + 1;
                score.innerHTML = newScore
                window.localStorage.setItem('score', newScore);
            } else {
                // Draw
                pickResult.innerHTML = "Draw";
            }

        }, 1500)
    })
})

const playAgainButton = document.querySelector('button.btn[data-type=reset]');
playAgainButton.addEventListener('click', (e) => {
    reset();
})

const ruleButton = document.querySelector('button[data-type=rule]');
ruleButton.addEventListener('click', (e) => {
    const modal = document.querySelector('.modal');
    modal.classList.add('open');

    const main = document.querySelector('main');
    main.classList.add('backdrop');

    const close = modal.querySelector('button.btn-close');
    close.addEventListener('click', (e) => {
        modal.classList.remove('open');
        main.classList.remove('backdrop');
    })
})

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function createSign(sign) {
    const button = document.createElement('button')
    button.classList.add('btn-icon');
    button.setAttribute('data-icon', sign.icon)
    button.setAttribute('data-type', "sign");
    button.setAttribute('aria-label', `${sign.icon} button`);

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('icon-wrapper');

    const svg = document.createElement('svg');
    svg.classList.add('icon');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href', `./assets/icon-signs.svg#icon-${sign.icon}`);
    // use.setAttribute('xlink:href', );

    svg.appendChild(use);
    iconWrapper.appendChild(svg);

    button.appendChild(iconWrapper);

    return button;
    // <button class="btn-icon" data-icon="scissor" data-type="sign" aria-label="scissor button">
    //           <div class="icon-wrapper">
    //             <svg class="icon">
    //               <use xlink:href="scissors"></use>
    //             </svg>
    //           </div>
    //         </button>
}

function reset() {
    selectionContainer.setAttribute('data-state', 'initial');
    pickedContainer.setAttribute('data-state', 'picking');


    const pickUser = pickedContainer.querySelector('.pick-user');
    const pickedUserContainer = pickUser.querySelector('.pick-container');
    pickUser.setAttribute('data-state', 'none');

    const pickComp = pickedContainer.querySelector('.pick-comp');
    const pickedCompContainer = pickComp.querySelector('.pick-container');
    pickComp.setAttribute('data-state', 'picking');

    pickedUserContainer.lastChild.remove();
    pickedCompContainer.lastChild.remove();

}
