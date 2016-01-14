(window['win'] = function() {
    // direction mappings
    var i, dirs = ['up', 'right', 'down', 'left'],
        diffs = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ]; // don't ask me why the coords are ordered [y,x]
    window['t'] = 1; // next Turn direction if we hit a wall (opposite of last turn direction)
    window['m'] = 1; // My internally tracked direction

    // reset the game (look at the game code to see what these affect)
    clearInterval(ticker);
    $('table').remove();
    renderBoard();
    renderFruitCell();
    direction = dirs[m];
    $('div.gameOver')['hide']()['css']('top', 0);

    // reset the snake
    snakeHead = [10, i = 14];
    snakeCells = [];
    while (i > 6) {
        snakeCells.push([10, i--])
    };

    // intercept game loop interval call
    if (!window['o']) {
        window['o'] = updateSnakeCell;
        updateSnakeCell = function() {
            // which direction is the fruit?
            var targetdir = snakeHead[0] < fruitCell[0] ? 2 : snakeHead[0] > fruitCell[0] ? 0 : snakeHead[1] < fruitCell[1] ? 1 : 3,
                hit = true,
                nextCell;
            i = 4; // four tries allowed before failing (it's a trap!)
            while (i-- && hit) {
                hit = false;
                nextCell = [snakeHead[0] + diffs[targetdir][0], snakeHead[1] + diffs[targetdir][1]];
                // check snake array for hits
                $['each'](snakeCells, function(i, v) {
                    hit = hit || (v[0] == nextCell[0] && v[1] == nextCell[1]);
                });
                hit = hit || nextCell[0] < 0 || nextCell[0] >= size || nextCell[1] < 0 || nextCell[1] >= size; // check for edge hit
                if (hit) targetdir = (targetdir + t + 4) % 4; // turn if there's an obstruction (see direction mappings)
            }

            // have we turned?
            if (m != targetdir) {
                t = m - targetdir; // the next turn will be in the opposite direction of this turn
                if (Math.abs(t) > 1) t = -(Math.abs(t) / t); // these two lines help keep the snake from putting itself in peril

                direction = dirs[m = targetdir]; // finally set the direction of the snake for the game loop to handle
            }
            o(); // call the original game loop function
        };
    }
    startGame();
})();
