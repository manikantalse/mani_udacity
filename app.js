/*
 * Create a list that holds all of your cards
 */

let deck = document.querySelector(".deck");
let list = document.querySelectorAll(".deck .card");
let movesDisplay = document.querySelector(".moves");
let restart = document.querySelector(".restart");
let stars = document.querySelector(".stars");
let modal = document.querySelector(".modal");
let close = document.querySelector(".close");
let replay = document.querySelector("#replay");
let timeDisplay = document.querySelector("#timer");
let timer = { minutes: 0, hours: 0 };
let clock;


let openCards, matchCount, moves, canOpen;

let cards = [...list]; // for some reason i wasn't able to shuffle it as NodeList ,hence i converted it as default array list

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

play();

/**
 * Method to start/restart the game.
 */
function play() {

    openCards = [];
    matchCount = 0;
    moves = 0;
    canOpen = true;

    document.querySelectorAll(".open").forEach(function (card) {
        card.classList.remove("open", "show");
    })

    timer = { minutes: 0, seconds: 0 };

    timeDisplay.innerHTML = "00:00";

    modal.style.display = "none";
    movesDisplay.innerText = moves;

    deck.innerHTML = "";
    while (stars.children.length != 3) {
        stars.innerHTML += `<li><i class="fa fa-star"></i></li>`;
    }

    cards = shuffle(cards);

    for (const card of cards) {
        deck.appendChild(card);
    }

    restart.classList.add("shakeIt");
    restart.addEventListener("animationend", function () {
        restart.classList.remove("shakeIt");
    })

    if (clock) clearInterval(clock);

    clock = setInterval(function () {
        timer.seconds++;
        timer.seconds %= 60;
        if (timer.seconds == 0) {
            timer.minutes++;
        }
        timeDisplay.innerHTML = returnTime(timer.minutes, timer.seconds);
    }, 1000)

}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


movesDisplay.innerText = moves;

// Adding event listeners for each click of a card.
for (const card of cards) {
    card.addEventListener("click", function (e) {

        if (openCards.length == 2 || e.target.nodeName == "I" || e.target.className.includes("open show")) return;

        openCards.push(e.target);

        let openCard = openCards[0];

        if (openCards.length == 1) {
            openCard.classList.add("open", "show");
            return;
        }

        let currentCard = openCards[1];
        currentCard.classList.add("open", "show");

        canOpen = false;

        moves++;
        movesDisplay.innerText = moves;

        // To decrease rating after every 10 moves.
        if (moves % 10 == 0 && stars.children.length >= 2) {
            stars.removeChild(stars.firstElementChild);
        }

        // Checking if the two opened cards are matching or not
        if (openCard.firstElementChild.className == currentCard.firstElementChild.className) {

            matchCount++;

            openCard.classList.add("shakeIt");
            currentCard.classList.add("shakeIt");

            openCard.addEventListener("animationend", function () {

                openCard.classList.remove("shakeIt");
                currentCard.classList.remove("shakeIt");

                canOpen = true;
                openCards = [];

                // If all the cards are matched, then display success modal
                if (matchCount == 8) {
                    modal.style.display = "block";
                    document.getElementById("modalStars").innerHTML = stars.innerHTML;
                    document.getElementById("modalMoves").innerText = moves;
                    document.getElementById("timer2").innerText = timeDisplay.innerText = returnTime(timer.minutes, timer.seconds);
                    clearInterval(clock);

                }
            })

        } else {
            // If two cards are not matching, then wait for a second to select again.
            setTimeout(function () {
                openCard.classList.remove("open", "show");
                currentCard.classList.remove("open", "show");
                canOpen = true;
                openCards = [];
            }, 1000);
        }



    })
}

function returnTime(min, sec){ return (min < 10 ? "0" + min : min) + " : " + (sec < 10 ? "0" + sec : sec) };

restart.addEventListener("click", play);
replay.addEventListener("click", play);