$(document).ready(function() {

    numberOfBombs();
    score();
    createDialogBoxes();

    $(".levelButton").on("click", function() {

        var board = $("#board");
        var level = $(this).val();
        drawBoard(level);
        numberOfBombs();
        score(level);

        //setting timer
        var start = Math.floor(Date.now()/1000);
        var timer = setInterval(function(){ setTimer(start); }, 1000);
        $(".levelButton").on("click", function() {
            window.clearInterval(timer);
        });

        board.children(".fieldBomb").on("click", function() {

            $(this).children().removeClass("invisible");
            window.clearInterval(timer);
            gameOver();
        });

        board.children().on("click", function() {

            $(this).addClass("clicked");
            $(this).removeClass("suspected");
            numberOfBombs();
            score(level);
        });

        board.children(".fieldClear").on("click", function() {

            $(this).removeClass("suspected");
            var x = parseInt($(this).attr("data-x"), 10);
            var y = parseInt($(this).attr("data-y"), 10);
            $(this).html(sumBombsAround(x,y));

            if (win(score(level))) window.clearInterval(timer);
        });

        board.children().on("contextmenu", function() {
            if (!$(this).hasClass("clicked")) {
                $(this).toggleClass("suspected");
                numberOfBombs();
            }
            return false;
        });
    })
})


function drawBoard(level) {

    $("#board").html('');
    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            var random = Math.random();
            var randomClass = 'fieldClear';

            if (level === "easy" && random <= 0.1) randomClass = 'fieldBomb';
            if (level === "normal" && random <= 0.22) randomClass = 'fieldBomb';
            if (level === "hard" && random <= 0.35) randomClass = 'fieldBomb';

            $('<div/>', {
                class: 'gradient boardElement ' + randomClass,
                'data-x': i,
                'data-y': j,
            }).appendTo("#board");
        }
        $('<div/>', {
            style: 'clear:both'
        }).appendTo("#board");
    }
    var bomb = $('<img class="invisible bombImg boardElement" src="http://clipartist.net/openclipart.org/2013/Mo/AhNinn/bomb-555px.png" alt="bomb">');
    $(".fieldBomb").append(bomb);
}

function numberOfBombs() {

    var bombNumber = $("#board").children(".fieldBomb").length;
    var suspectedBombs = $("#board").children(".suspected").length;
    $("#bombNumber").html("Bombs: " + (bombNumber - suspectedBombs));
    return bombNumber;
}

function score(level = null) {

    var revealedClearFields = $("#board").children(".fieldClear.clicked").length;
    var levelFactor;
        if (level === null) levelFactor = 0;
        if (level === "easy") levelFactor = 100;
        if (level === "normal") levelFactor = 300;
        if (level === "hard") levelFactor = 500;

    var points = revealedClearFields * levelFactor;
    $("#score").html("Your Score: " + points);
    return points;
}

function win(score) {

    var bombs = $("#board").children(".fieldBomb").length;
    if ($("#board").children(".fieldClear.clicked").length + bombs === 100) {

        points = score + (bombs * 500);
        $("#score").html("Your Score: " + points);
        $("#wrapper").find(".boardElement").off();
        $("#win").dialog("open");
        $("#win").dialog({
            close: function(event, ui) {
            window.location.reload();
            }
        });
        return true;
    }

}

function createDialogBoxes() {

    $("#gameover").dialog({
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 500
        }
    });

    $("#win").dialog({
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 500
        }
    });
}

function sumBombsAround(x,y) {

    var sum = 0;
    for (var i = x-1; i <= x+1; i++) {
        for (var j = y-1; j <= y+1; j++) {
            var selector = '[data-x="' + i + '"]' + '[data-y="' + j + '"]';
            if ($(selector).hasClass("fieldBomb")) {
                sum++;
            }
        }
    }
    if (sum>0) {
        return sum;
    } else {
        return "";
    }
}

function gameOver() {

    var fieldBombs = $("#board").children(".fieldBomb");
    fieldBombs.addClass("red").removeClass("gradient");
    $("#board").effect("shake", {distance:5}, 500);
    $("#wrapper").find(".boardElement").off();
    $("#gameover").dialog("open");
    $("#gameover").dialog({
        close: function(event, ui) {
        window.location.reload();
        }
    })
}

function setTimer(start) {

        var now = Math.floor(Date.now()/1000);
        time = now - start;
        $("#timer").text("Time: " + time);
}