let userScore = 0;
let computerScore = 0;
let game_total = 0;
let userScore_array = [];

let rock_games = 0;
let paper_games = 0;
let scissor_games = 0;
let rock_score = 0;
let paper_score = 0;
let scissor_score = 0;
let rock_wins_array = [];
let paper_wins_array = [];
let scissor_wins_array = [];

var result = '';
var dropbuttonflag = 0;
var dropcontentflag = 0;

const title_heading = document.getElementById("title");
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const choices_div = document.querySelector(".choice");
const result_div = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissor_div = document.getElementById("s");
const reset_button = document.getElementById("resetbutton");
const dropdown_content = document.querySelector(".dropdown_content");
const dropdown_button = document.querySelector(".dropdown_button");
const dropdown = document.querySelector(".stats_dropdown");
const stats_link = document.getElementById("stats_link");

const color_list = ["red", "blue", "purple", "yellow", "orange", "pink"];

//randomizes the color of the title text
setInterval(function() {
    var rand_color = Math.floor((Math.random() * 6));
    title_heading.style.color = color_list[rand_color];
}, 500)

//on-click event handlers for each of the moves
//rock
rock_div.addEventListener('click', function() {
    game("r");
    rock_games++;
})

//paper
paper_div.addEventListener('click', function() {
    game("p");
    paper_games++;
})

//scissors
scissor_div.addEventListener('click', function() {
    game("s");
    scissor_games++;
})

//reset button
reset_button.addEventListener("click", function() {
    reset_score();
})

//event handler for drop-down menu animation
dropdown_button.addEventListener("mouseenter", function(){
    dropbuttonflag = 1;
    setTimeout(function() {
        switch(dropdown_content.classList.contains("visi_class")){
            case false:
                dropdown_content.classList.add("visi_class");
                break;
        }
    }, 200)
})

//code that closes dropdown menu when user mouse leaves the menu
dropdown_button.addEventListener("mouseleave", function() {
    dropbuttonflag = 0;
    setTimeout(function() {
        switch (dropcontentflag) {
            case 0:
                dropdown_content.classList.remove("visi_class");
                break;
        }
    }, 200)
})

//when the mouse enters the dropdown region, dropcontentflag is set to 1 keeping the menu open
dropdown_content.addEventListener("mouseenter", function() {
    dropcontentflag = 1;
})

//when the mouse leaves, the dropcontentflag is set to 0 closing the menu
dropdown_content.addEventListener("mouseleave", function() {
    dropcontentflag = 0;
    setTimeout(function() {
        switch(dropbuttonflag) {
            case 0:
                dropdown_content.classList.remove("visi_class");
                break;
        }
    }, 200)
})

//event handler for sessions stats 

stats_link.addEventListener("click", function() {
    sessionStorage.setItem("userScore_array", JSON.stringify(userScore_array));
    sessionStorage.setItem("rock_wins_array", JSON.stringify(rock_wins_array));
    sessionStorage.setItem("paper_wins_array", JSON.stringify(paper_wins_array));
    sessionStorage.setItem("scissor_wins_array", JSON.stringify(scissor_wins_array));
    sessionStorage.setItem("rock_games", rock_games);
    sessionStorage.setItem("paper_games", paper_games);
    sessionStorage.setItem("scissor_games", scissor_games);
    sessionStorage.setItem("game_total", game_total);
})

//function responsible for setting the computers move
//takes users move as parameter and passes it to game_result along with the computers move
function game(move) {
    var moves = ["r", "p", "s"];
    var comp_index = Math.floor(Math.random() * 3);
    var comp_move = moves[comp_index];
    game_result(move,comp_move);
}

//this function takes in both the users move and the computers move and determines the result of the game
function game_result(move, comp_move){
    var move_combo = move + comp_move;
    switch(move_combo){
        case "sr":
            result = "Scissors Loses to Rock. You Lose!";
            lose(result);
            comp_animation(comp_move,"loss");
            break;
        case "sp":
            result = "Scissors Beats Paper. You win!";
            win(result);
            move_wins(move);
            comp_animation(comp_move,"win");
            break;
        case "ss":
            result = "Scissors Versus Scissors. Draw!";
            draw(result);
            comp_animation(comp_move,"draw");
            break;
        case "rs":
            result = "Rock Beats Scissors. You Win!";
            win(result);
            move_wins(move);
            comp_animation(comp_move,"win");
            break;
        case "rp":
            result = "Rock Loses to Paper. You Lose!";
            lose(result);
            comp_animation(comp_move,"loss");
            break;
        case "rr":
            result = "Rock Versus Rock. Draw!";
            draw(result);
            comp_animation(comp_move,"draw");
            break;
        case "pr":
            result = "Paper Beats Rock. You Win!";
            win(result);
            move_wins(move);
            comp_animation(comp_move,"win");
            break;
        case "ps":
            result = "Paper Loses to Scissors. You Lose!";
            lose(result);
            comp_animation(comp_move,"loss");
            break;
        case "pp":
            result = "Paper Versus Paper. Draw!"
            draw(result);
            comp_animation(comp_move,"draw");
            break;
        }
        
        update_stats(move);

}

//this function is responsible for updating the sessions win and loss stats of the user
function update_stats(move) {
    switch(move) {
        case "r":
            rock_wins_array.push(rock_score);
            break;
        case "s":
            scissor_wins_array.push(scissor_score);
            break;
        case "p":
            paper_wins_array.push(paper_score);
            break;
    }
}

//this functions keeps track of the individual move win statistics for the user in each session
function move_wins(move){
    switch (move) {
        case "r":
            rock_score++;
            break;
        case "p":
            paper_score++;
            break;
        case "s":
            scissor_score++;
            break;
    }
}

//this function handles the win event
function win(message){
    userScore++;
    game_total++;
    fade_change(userScore_span, userScore);
    fade_change(result_div, message);
    userScore_array.push(userScore);
    sessionStorage.setItem("userScore", userScore);
}

//this functions handles the lose event
function lose(message){
    computerScore++;
    game_total++;
    userScore_array.push(userScore);
    fade_change(computerScore_span, computerScore);
    fade_change(result_div, message);
    sessionStorage.setItem("computerScore", computerScore);
}

//this function handles the draw event
function draw(message){
    game_total++;
    fade_change(result_div, message);
    userScore_array.push(userScore);
}

//this function is creates a fade out animation for onscreen elements
function fade_change(element, message) {
    element.classList.add("fade");
    setTimeout(function(){
        element.innerHTML = message;
        element.classList.remove("fade");
    }, 500)
}

//this function handles the animation for the computers move choice
function comp_animation(comp_move, condition){
    var element = ""
    switch(comp_move){
        case "r":
            element = rock_div;
            break;
        case "s":
            element = scissor_div;
            break;
        case "p":
            element = paper_div;
            break;
    }

    switch(condition){
        case "win":
            element.classList.add("fade");
            element.classList.add("comp-choice-win");
            setTimeout(function(){
                element.classList.remove("fade");
                element.classList.remove("comp-choice-win");
            }, 500)
            break;
        case "loss":
            element.classList.add("fade");
            element.classList.add("comp-choice-loss");
            setTimeout(function(){
                element.classList.remove("fade");
                element.classList.remove("comp-choice-loss");
            }, 500)
            break;
        case "draw":
            element.classList.add("fade");
            element.classList.add("comp-choice-draw");
            element.classList.remove("choice");
            setTimeout(function(){
                element.classList.remove("fade");
                element.classList.remove("comp-choice-draw");
                element.classList.add("choice");
            }, 500)
            break;
    }
}

//this function handles resetting the score for the user session
function reset_score() {
    userScore = 0;
    computerScore = 0;
    game_total = 0;
    fade_change(userScore_span, userScore);
    fade_change(computerScore_span, computerScore);
}
