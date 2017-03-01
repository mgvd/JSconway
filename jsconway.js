$(document).ready(function () {

    var canvas = $("#canvas")[0];



    var ctx = canvas.getContext("2d");

    var ALIVE = 1;
    var DIED = 2;
    var DEAD = 8;
    var NONE = null;


    var alivecolors = {
        1: "#C2FFC9",
        2: "#215c73",
        3: "#215c73",
        4: "#215c73",
        5: "#17307a",
        6: "#100a45",
        7: "#100a45",
        8: "black"
    };
    var highlightcolors = {
        1: "yellow",
        2: "#552222"
    };

    var w = $("#canvas").width();
    var h = $("#canvas").height();



    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    // let's draw some random cells;
    var cs = 3; //cellsize
    var cells = new Array();
    var new_cells = new Array();
    var mousex = 0;
    var mousey = 0;

    var rows = Math.floor(h / cs);
    var cols = Math.floor(w / cs);

    function init() {


        $("#start_button")[0].onclick = start_playing;
        $("#stop_button")[0].onclick = stop_playing;
        $("#random_button")[0].onclick = randomize;
        $("#clear_button")[0].onclick = clear_canvas;
        canvas.onclick = conway_loop;
        init_cells();
        draw_cells();
    }
    init();

    function highlight_cell(e) {
        mousex = Math.floor(e.layerX / cs);
        mousey = Math.floor(e.layerY / cs);
    }

    function highlight_neighbours(x, y) {
        for (var ix = -1; ix <= 1; ix++) {
            for (var iy = -1; iy <= 1; iy++) {
                var nx = x + ix;
                var ny = y + iy;
                if (cells[nx] && cells[nx][ny]) {
                    ctx.fillStyle = highlightcolors[cells[nx][ny]];
                    ctx.fillRect(nx * cs, ny * cs, cs, cs);
                }
            }
        }
    }

    function stop_playing() {
        if (typeof game_loop != "undefined") clearInterval(game_loop);
        clearInterval(game_loop);
        return false;
    }

    function start_playing() {
        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(conway_loop, 60);
        return false;
    }

    function randomize() {
        stop_playing();
        init_cells();
        draw_cells();
        return false;
    }

    function clear_canvas() {
        stop_playing();
        clear_cells();
        draw_cells();
        return false;
    }

    function conway_loop() {
        calculate_cells();
        draw_cells();
    }



    function draw_cells() {

        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                if (new_cells[x][y] != cells[x][y]) {
                		if (new_cells[x][y] > 7) {
                    	color = alivecolors[DEAD];
                    } else {
                    	color = alivecolors[new_cells[x][y]];
                    }
                    ctx.fillStyle = color;
                    ctx.fillRect(x * cs, y * cs, cs, cs);
                }
            }
        }
    //    highlight_neighbours(mousex, mousey);
        cells = new_cells;
    }

    // For a space that is 'populated':
    // Each cell with one or no neighbors dies, as if by loneliness.
    // Each cell with four or more neighbors dies, as if by overpopulation.
    // Each cell with two or three neighbors survives.
    // For a space that is 'empty' or 'unpopulated'
    // Each cell with three neighbors becomes populated.
    function calculate_cells() {

        new_cells = new Array(cols);
        for (var x = 0; x < cols; x++) {
            new_cells[x] = new Array(rows);
        }
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                var no_neighbours = get_no_neighbours(x, y);

                if (cells[x][y] == ALIVE) {
                    // alive!
                    if (!(no_neighbours == 2 || no_neighbours == 3)) {
                        new_cells[x][y] = DIED;
                    } else {
                        new_cells[x][y] = ALIVE;
                    }
                } else {
                    // not alive
                    if (no_neighbours == 3) {
                        new_cells[x][y] = ALIVE;
                    } else {
                        // stays dead
                        if (cells[x][y] != NONE) {
                            new_cells[x][y] = DEAD;
                        }
                        if (cells[x][y] != DEAD) {
                            new_cells[x][y] = cells[x][y] + 1;
                        }
                    }
                }
            }
        }
    }

    function get_no_neighbours(x, y) {
        //        X-1,Y-1 - X,Y-1 - X+1,Y-11
        //        X-1,Y   -   -   - X+1,Y
        //        X-1,Y+1 - X,Y+1 - X+1,Y+1
        var no = 0;
        for (var iy = -1; iy <= 1; iy++) {
            var ny = y + iy;

            for (var ix = -1; ix <= 1; ix++) {

                var nx = x + ix;
                if (cells[nx] && cells[nx][ny]) {
                    if (!(nx == x && ny == y) && cells[nx][ny] == ALIVE) {
                        no++;
                    }
                }

            }
        }
        return no;
    }

    function copy_array(arr1) {
        var arr2 = new Array();
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] instanceof Array) {
                arr2[i] = copy_array(arr1[i]);
            } else {
                arr2[i] = arr1[i];
            }
        }
        return arr2;
    }

    function init_cells() {
        new_cells = new Array(rows);
        for (var x = 0; x < cols; x++) {
            new_cells[x] = new Array(cols);
            for (var y = 0; y < rows; y++) {
                new_cells[x][y] = DEAD;

                if (Math.random() > 0.5) {
                    new_cells[x][y] = ALIVE;
                }

            }
        }
        for (var x = 0; x < cols; x++) {
            cells[x] = new Array();
            for (var y = 0; y < rows; y++) {
                cells[x][y] = DEAD;
            }
        }
    }

    function clear_cells() {
        new_cells = new Array(rows);
        for (var x = 0; x < cols; x++) {
            new_cells[x] = new Array(cols);

        }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);
    }


});
