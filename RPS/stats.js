let computerScore = sessionStorage.getItem("computerScore");
let userScore = sessionStorage.getItem("userScore");
let game_total = sessionStorage.getItem("game_total");
let userScore_array = JSON.parse(sessionStorage.getItem("userScore_array"));

let rock_wins_array = JSON.parse(sessionStorage.getItem("rock_wins_array"));
let paper_wins_array = JSON.parse(sessionStorage.getItem("paper_wins_array"));
let scissor_wins_array = JSON.parse(sessionStorage.getItem("scissor_wins_array"));
let rock_games = sessionStorage.getItem("rock_games");
let paper_games = sessionStorage.getItem("paper_games");
let scissor_games = sessionStorage.getItem("scissor_games");

let win_data = [];
let move_win_data = [];

var dropbuttonflag = 0;
var dropcontentflag = 0;

const win_rate_div = document.getElementById("win_rate");
const move_win_div = document.getElementById("move_win_rate");

const dropdown_content = document.querySelector(".dropdown_content");
const dropdown_button = document.querySelector(".dropdown_button");
const dropdown = document.querySelector(".stats_dropdown");

var win_rate_x = [];
var win_rate_y = [];

var rock_rate_x = []
var paper_rate_x = [];
var scissor_rate_x = [];
var rock_rate_y = [];
var paper_rate_y = [];
var scissor_rate_y = [];

dropdown_button.addEventListener("mouseenter", function(){
    dropbuttonflag = 1;
    console.log("dropdown entered");
    setTimeout(function() {
        switch(dropdown_content.classList.contains("visi_class")){
            case false:
                dropdown_content.classList.add("visi_class");
                break;
        }
    }, 200)
})

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

dropdown_content.addEventListener("mouseenter", function() {
    dropcontentflag = 1;
})

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


window.addEventListener("load", function() {
    //win rate statistics
    for (var i = 1; i <= game_total; i++) {
        win_rate_x.push(i);
    }

    for (var i = 0; i <= userScore_array.length; i++) {
        var win_calc_y = ((userScore_array[i]/win_rate_x[i]))*100;
        win_rate_y.push(win_calc_y);
    }

    var line1 = {
        x: win_rate_x,
        y: win_rate_y,
        type: 'scatter'
    };

    var win_rate_layout = {
        title: {
            text: 'Win Rate',
            font: {
                family: 'Asap, sans-serif',
                size: 30,
                weight: 'bold'
            },
        },
        xaxis: {
            title: {
                text: 'Games Played',
                font: {
                    family: 'Asap, sans-serif',
                    size: 18,
                    color: 'black'
                }
            },
        },
        yaxis: {
            title: {
                text: "Win Percentage",
                font: {
                    family: 'Asap, sans-serif',
                    size: 18,
                    color: 'black'
                }
            },
        },
    };

    win_data = [line1];

    Plotly.newPlot('win_rate', win_data, win_rate_layout);
    //end win rate statistics

    //individual move win rate statistics
    for (var i = 1; i <= rock_games; i++) {
        rock_rate_x.push(i);
    }

    for (var i = 0; i <= rock_rate_x.length; i++) {
        var rock_y_calc = ((rock_wins_array[i] / rock_rate_x[i]))*100; 
        rock_rate_y.push(rock_y_calc);
    }

    for (var i = 1; i <= paper_games; i++) {
        paper_rate_x.push(i);
    }

    for (var i = 0; i <= paper_rate_x.length; i++) {
        var paper_y_calc = ((paper_wins_array[i] / paper_rate_x[i]))*100; 
        paper_rate_y.push(paper_y_calc);
    }

    for (var i = 1; i <= scissor_games; i++) {
        scissor_rate_x.push(i);
    }

    for (var i = 0; i <= scissor_rate_x.length; i++) {
        var scissor_y_calc = ((scissor_wins_array[i] / scissor_rate_x[i]))*100; 
        scissor_rate_y.push(scissor_y_calc);
    }

    var line2 = {
        x: rock_rate_x,
        y: rock_rate_y,
        name: 'Rock Rate',
        type: 'scatter'
    };

    var line3 = {
        x: paper_rate_x,
        y: paper_rate_y,
        name: 'Paper Rate',
        type: 'scatter'
    };

    var line4 = {
        x: scissor_rate_x,
        y: scissor_rate_y,
        name: 'Scissor Rate',
        type: 'scatter'
    };

    var move_rate_layout = {
        title: {
            text: 'Move Win Rates',
            font: {
                family: 'Asap, sans-serif',
                size: 30,
                weight: 'bold'
            },
        },
        xaxis: {
            title: {
                text: 'Games Played',
                font: {
                    family: 'Asap, sans-serif',
                    size: 18,
                    color: 'black'
                }
            },
        },
        yaxis: {
            title: {
                text: "Win Percentage",
                font: {
                    family: 'Asap, sans-serif',
                    size: 18,
                    color: 'black'
                }
            },
        },
    };

    move_win_data = [line2, line3, line4];


    Plotly.newPlot('move_win_rate', move_win_data, move_rate_layout);


})
