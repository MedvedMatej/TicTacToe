let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.height = 800;
canvas.width = 800;
canvas.addEventListener("click", play);

let board = Array.from(Array(3), () => Array(3).fill(null));
let turn = 0;
let game = 1;
let scorePlayer = 0;
let scoreComputer = 0;
let draws = 0;
drawBoard();

function play(e) {
    let x = Math.floor(e.offsetX*3/canvas.width);
    let y = Math.floor(e.offsetY*3/canvas.height);
    
    if (board[y][x] != null) return;

    board[y][x] = turn % 2;
    drawSymbol(x, y, turn);
    turn++;

    let state = evalGame(board, turn);
    resolveState(state);

    if (state == 0){
        let move = bestMove(board);
        board[move[0]][move[1]] = turn % 2;
        drawSymbol(move[1], move[0], turn);
        turn++;

        state = evalGame(board, turn);
        resolveState(state);
    }
}

function minimax(board, turn, isMax){
    let state = evalGame(board, turn);
    if (state == 1) {
        return -10;
    }
    else if (state == -1) {
        return 10;
    }
    else if (state == 2) {
        return 0;
    }

    if (isMax){
        let best = -1000;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null){
                    board[i][j] = turn % 2;
                    best = Math.max(best, minimax(board, turn + 1, !isMax));
                    board[i][j] = null;
                }
            }
        }
        return best;
    }
    else{
        let best = 1000;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null){
                    board[i][j] = turn % 2;
                    best = Math.min(best, minimax(board, turn + 1, !isMax));
                    board[i][j] = null;
                }
            }
        }
        return best;
    }
}

function bestMove(board){
    if(game % 2 == 1){        
        let best = -1000;
        let move = [0, 0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null){
                    board[i][j] = turn % 2;
                    let score = minimax(board, turn + 1, false);
                    board[i][j] = null;
                    if (score > best){
                        best = score;
                        move = [i, j];
                    }
                }
            }
        }
        console.log(move)
        return move;
    }
    else{
        let best = 1000;
        let move = [0, 0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null){
                    board[i][j] = turn % 2;
                    let score = minimax(board, turn + 1, true);
                    board[i][j] = null;
                    if (score < best){
                        best = score;
                        move = [i, j];
                    }
                }
            }
        }
        console.log(move)
        return move;
    }

}

function evalGame(board, turn) {
    let finished = false;
    for (let i = 0; i < 3; i++) {
        if (board[i][0] != null && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
            finished = true;
        }
        if (board[0][i] != null && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
            finished = true;
        }
    }
    if (board[0][0] != null && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        finished= true;
    }
    if (board[0][2] != null && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        finished= true;
    }

    if(finished){
        if (turn % 2 == 0) {
            return -1;
        }
        else {
            return 1;
        }
    }

    if(turn > 8){
        return 2;
    }    

    return 0;
}

function resolveState(state){
    if (state == 1) {
        alert("X wins!");
        if(game == 0){
            scorePlayer++;
        }
        else{
            scoreComputer++;
        }
    }
    else if (state == -1) {
        alert("O wins!");
        if(game == 1){
            scoreComputer++;
        }
        else{
            scorePlayer++;
        }
    }
    else if (state == 2) {
        alert("Draw!");
        draws++;
    }

    if (state != 0){
        game++;
        canvas.removeEventListener("click", play);
        document.getElementById("win").innerHTML = "Wins: " + scorePlayer;
        document.getElementById("defeat").innerHTML = "Defeats: " + scoreComputer;
        document.getElementById("draw").innerHTML = "Draws: " + draws;
    }
}

function drawBoard() {
    ctx.shadowBlur = 7;
    ctx.shadowColor = "black";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.moveTo(canvas.width / 3 * 2, 0);
    ctx.lineTo(canvas.width / 3 * 2, canvas.height);
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.moveTo(0, canvas.height / 3 * 2);
    ctx.lineTo(canvas.width, canvas.height / 3 * 2);
    ctx.stroke();

    ctx.strokeStyle = "#e1e1e1";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.moveTo(canvas.width / 3 * 2, 0);
    ctx.lineTo(canvas.width / 3 * 2, canvas.height);
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.moveTo(0, canvas.height / 3 * 2);
    ctx.lineTo(canvas.width, canvas.height / 3 * 2);
    ctx.stroke();

}

function drawX(x, y, padding=20) {
    x = (canvas.width*x*2 + canvas.width)/6;
    y = (canvas.width*y*2 + canvas.width)/6;
    ctx.beginPath();
    ctx.moveTo(x - canvas.width/6 + padding, y - canvas.width/6 + padding);
    ctx.lineTo(x + canvas.width/6 - padding, y + canvas.width/6 - padding);
    ctx.moveTo(x + canvas.width/6 - padding, y - canvas.width/6 + padding);
    ctx.lineTo(x - canvas.width/6 + padding, y + canvas.width/6 - padding);
    ctx.stroke();
}

function drawO(x, y, padding=20) {
    ctx.beginPath();
    ctx.arc((canvas.width*x*2 + canvas.width)/6, (canvas.width*y*2 + canvas.width)/6, canvas.width/6-padding, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawSymbol(x, y, turn) {
    if (turn % 2 == 0) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 10;
        drawX(x, y);
        ctx.strokeStyle = "#e1e1e1";
        ctx.lineWidth = 5;
        drawX(x, y);
    }
    else {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 10;
        drawO(x, y);
        ctx.strokeStyle = "#e1e1e1";
        ctx.lineWidth = 5;
        drawO(x, y);
    }
}

function playAgain() {
    document.getElementById("game").innerHTML = "Game: " + game;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    board = Array.from(Array(3), () => Array(3).fill(null));
    turn = 0;

    if(game % 2 == 0){
        let move = bestMove(board);
        board[move[0]][move[1]] = turn % 2;
        drawSymbol(move[1], move[0], turn);
        turn++;
    }

    canvas.addEventListener("click", play);
}
