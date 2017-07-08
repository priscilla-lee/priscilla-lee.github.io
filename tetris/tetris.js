var UNIT = 25; //size of block on grid
var DELAY_DECREMENT = 5; // to decrement every collapsed row
var INITIAL_DELAY = 300; // milliseconds
var NUM_TOP_ROWS = 5; //invisible rows at top, not shown
var NUM_NEXT_PIECES = 5; //must be less than 7
var IMAGES = (function () {
    function IMAGES() {
    }
    IMAGES.get = function (shape) {
        switch (shape) {
            case Shape.I: return this.I;
            case Shape.J: return this.J;
            case Shape.L: return this.L;
            case Shape.O: return this.O;
            case Shape.S: return this.S;
            case Shape.T: return this.T;
            case Shape.Z: return this.Z;
            case Shape.Ghost: return this.Ghost;
            case Shape.Empty: return this.Empty;
        }
    };
    IMAGES.set = function (shape, img) {
        switch (shape) {
            case Shape.I:
                this.I = img;
                break;
            case Shape.J:
                this.J = img;
                break;
            case Shape.L:
                this.L = img;
                break;
            case Shape.O:
                this.O = img;
                break;
            case Shape.S:
                this.S = img;
                break;
            case Shape.T:
                this.T = img;
                break;
            case Shape.Z:
                this.Z = img;
                break;
            case Shape.Ghost:
                this.Ghost = img;
                break;
            case Shape.Empty:
                this.Empty = img;
                break;
        }
    };
    IMAGES.I = undefined;
    IMAGES.J = undefined;
    IMAGES.L = undefined;
    IMAGES.O = undefined;
    IMAGES.S = undefined;
    IMAGES.T = undefined;
    IMAGES.Z = undefined;
    IMAGES.Ghost = undefined;
    IMAGES.Empty = undefined;
    return IMAGES;
}());
var Component;
(function (Component) {
    Component[Component["Board"] = 0] = "Board";
    Component[Component["Hold"] = 1] = "Hold";
    Component[Component["Next"] = 2] = "Next";
})(Component || (Component = {}));
var Size;
(function (Size) {
    Size[Size["Large"] = 0] = "Large";
    Size[Size["Medium"] = 1] = "Medium";
    Size[Size["Small"] = 2] = "Small";
})(Size || (Size = {}));
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
var Style;
(function (Style) {
    Style[Style["Default"] = 0] = "Default";
    Style[Style["Image"] = 1] = "Image";
})(Style || (Style = {}));
var Shape;
(function (Shape) {
    Shape["I"] = "I";
    Shape["J"] = "J";
    Shape["L"] = "L";
    Shape["O"] = "O";
    Shape["S"] = "S";
    Shape["T"] = "T";
    Shape["Z"] = "Z";
    Shape["Ghost"] = "ghost";
    Shape["Empty"] = ".";
})(Shape || (Shape = {}));
// enum to capture key codes
var Keyboard;
(function (Keyboard) {
    Keyboard[Keyboard["Enter"] = 13] = "Enter";
    Keyboard[Keyboard["LeftArrow"] = 37] = "LeftArrow";
    Keyboard[Keyboard["UpArrow"] = 38] = "UpArrow";
    Keyboard[Keyboard["RightArrow"] = 39] = "RightArrow";
    Keyboard[Keyboard["DownArrow"] = 40] = "DownArrow";
    Keyboard[Keyboard["Space"] = 32] = "Space";
    Keyboard[Keyboard["Shift"] = 16] = "Shift";
    Keyboard[Keyboard["Tab"] = 9] = "Tab";
    Keyboard[Keyboard["A"] = 65] = "A";
    Keyboard[Keyboard["W"] = 87] = "W";
    Keyboard[Keyboard["S"] = 83] = "S";
    Keyboard[Keyboard["D"] = 68] = "D";
    Keyboard[Keyboard["P"] = 80] = "P";
})(Keyboard || (Keyboard = {}));
var KeyControls;
(function (KeyControls) {
    KeyControls[KeyControls["Default"] = 0] = "Default";
    KeyControls[KeyControls["Alternative"] = 1] = "Alternative";
})(KeyControls || (KeyControls = {}));
var Keys = (function () {
    function Keys(keyControls) {
        switch (keyControls) {
            case KeyControls.Default:
                this.play = Keyboard.Enter;
                this.pause = Keyboard.Enter;
                this.left = Keyboard.LeftArrow;
                this.right = Keyboard.RightArrow;
                this.down = Keyboard.DownArrow;
                this.rotate = Keyboard.UpArrow;
                this.drop = Keyboard.Space;
                this.hold = Keyboard.Shift;
                break;
            case KeyControls.Alternative:
                this.play = Keyboard.Enter;
                this.pause = Keyboard.Enter;
                this.left = Keyboard.A;
                this.right = Keyboard.D;
                this.down = Keyboard.S;
                this.rotate = Keyboard.W;
                this.drop = Keyboard.Space;
                this.hold = Keyboard.Shift;
                break;
        }
    }
    return Keys;
}());
/************************************************************************
* CUSTOMIZABLE VARIABLES: cols, rows, size, keys, delay, colors
    ? what keys/controls
    ? style/color/image of tetrominos
    ? ghost or no ghost
    ? how many games at same time? 1 or 2 player
    ? reveal how many "next" blocks

************************************************************************/
var Color = (function () {
    function Color(outline, fill, shade, highlight, twinkle) {
        this.outline = outline;
        this.fill = fill;
        this.shade = shade;
        this.highlight = highlight;
        this.twinkle = twinkle;
    }
    Color.I = new Color("#0D455B", "#1A9AFC", "#1986D3", "#26ADFF", "white");
    Color.J = new Color("#001467", "#133BDF", "#1224C2", "#245CDF", "white");
    Color.L = new Color("#842600", "#F96700", "#D74900", "#F78400", "white");
    Color.O = new Color("#CA9720", "#FFDE23", "#FDB900", "#FDC500", "white");
    Color.S = new Color("#459100", "#7EEB00", "#72D000", "#8BED00", "white");
    Color.T = new Color("#8D1B8A", "#DB2DC4", "#C232A2", "#E135CD", "white");
    Color.Z = new Color("#AF203C", "#F21F48", "#F21F48", "#F95A83", "white");
    Color.Empty = new Color("black", "#222", "#222", "#222", "#222");
    Color.Ghost = new Color("black", "#888", "#222", "#222", "#888");
    return Color;
}());
function getColor(shape) {
    switch (shape) {
        case (Shape.I): return Color.I;
        case (Shape.J): return Color.J;
        case (Shape.L): return Color.L;
        case (Shape.O): return Color.O;
        case (Shape.S): return Color.S;
        case (Shape.T): return Color.T;
        case (Shape.Z): return Color.Z;
        case (Shape.Empty): return Color.Empty;
        case (Shape.Ghost): return Color.Ghost;
    }
}
// var color = {
// 	I: {outline: "black", fill: "turquoise", shade: "turquoise", highlight: "turquoise"},
// 	J: {outline: "black", fill: "blue", shade: "blue", highlight: "blue"},
// 	L: {outline: "black", fill: "orange", shade: "orange", highlight: "orange"},
// 	O: {outline: "black", fill: "yellow", shade: "yellow", highlight: "yellow"},
// 	S: {outline: "black", fill: "green", shade: "green", highlight: "green"},
// 	T: {outline: "black", fill: "purple", shade: "purple", highlight: "purple"},
// 	Z: {outline: "black", fill: "red", shade: "red", highlight: "red"},
// 	".": {outline: "black", fill: "#2A2A2A", shade: "#2A2A2A", highlight: "#2A2A2A"},
// 	"ghost": {outline: "black", fill: "white", shade: "white", highlight: "white"},
// }; 
/************************************************************************
* GAME: game logic, loop, start, play, pause, etc
************************************************************************/
var Game = (function () {
    function Game(render, keys) {
        this.started = false;
        this._loop = null;
        this.playing = false;
        this._randomPieces = new RandomPieces();
        this._current;
        this._held;
        this._limitHold = false;
        this._numCols = render.numCols;
        this._numRows = render.numRows;
        this._grid = new Grid(this._numCols, this._numRows);
        this._render = render;
        this.keys = keys;
        this._delay = INITIAL_DELAY;
    }
    Game.prototype.start = function () {
        this.started = true;
        this._nextPiece();
        this.play();
    };
    Game.prototype.play = function () {
        var _this = this;
        this._loop = setInterval(function () { return _this.step(); }, this._delay);
        this.playing = true;
    };
    Game.prototype.pause = function () {
        clearInterval(this._loop);
        this.playing = false;
    };
    Game.prototype.step = function () {
        //self.current.drawGhost();
        this._render.eraseTetromino(this._current);
        if (!this._current.fall()) {
            this._nextPiece();
        }
        this._render.drawTetromino(this._current);
    };
    Game.prototype._nextPiece = function () {
        var _this = this;
        var next = this._randomPieces.getNext();
        this._current = new Tetromino(next, this._grid);
        this._current.add();
        this._render.drawTetromino(this._current);
        this._limitHold = false;
        // collapse rows & speed up, based on number of rows collapsed
        var numCollapsedRows = this._grid.collapseFullRows();
        if (numCollapsedRows > 0) {
            this._delay -= DELAY_DECREMENT * numCollapsedRows;
            clearInterval(this._loop);
            this._loop = setInterval(function () { return _this.step(); }, this._delay);
        }
        this._render.updateBoard(this._grid);
        //this.current.drawGhost();
        this._render.drawTetromino(this._current);
        this._render.updateNext(this._randomPieces.getList());
    };
    Game.prototype.move = function (dir) {
        this._render.eraseTetromino(this._current);
        this._current.move(dir);
        this._render.drawTetromino(this._current);
    };
    Game.prototype.rotate = function () {
        this._render.eraseTetromino(this._current);
        this._current.rotate();
        this._render.drawTetromino(this._current);
    };
    Game.prototype.drop = function () {
        this._current.drop();
        this._nextPiece();
    };
    Game.prototype.hold = function () {
        //limit hold swaps
        if (this._limitHold)
            return;
        else
            this._limitHold = true;
        if (this._held) {
            //remmove & erase current
            this._current.remove();
            this._render.eraseTetromino(this._current);
            //add & draw held
            this._held.reset();
            this._held.add();
            this._render.drawTetromino(this._held);
            //swap
            var temp = this._held;
            this._held = this._current;
            this._current = temp;
        }
        else {
            //erase current & put in hold
            this._current.remove();
            this._render.eraseTetromino(this._current);
            this._held = this._current;
            //draw from next list
            var next = this._randomPieces.getNext();
            this._current = new Tetromino(next, this._grid);
            this._current.add();
            this._render.drawTetromino(this._current);
        }
        this._render.updateHold(this._held.shape);
    };
    return Game;
}());
/************************************************************************
* RANDOM PIECE GENERATOR: 7 bag method
************************************************************************/
var RandomPieces = (function () {
    function RandomPieces() {
        this._bag = [];
        this._pieces = [];
        // fill list of pieces
        for (var i = 0; i < NUM_NEXT_PIECES; i++) {
            this._pieces.push(this._select());
        }
    }
    RandomPieces.prototype._select = function () {
        if (this._bag.length == 0) {
            this._bag = [Shape.I, Shape.J, Shape.L, Shape.O, Shape.S, Shape.T, Shape.Z];
        }
        var randomIndex = Math.floor(Math.random() * this._bag.length);
        var selected = this._bag[randomIndex];
        this._bag.splice(randomIndex, 1);
        return selected;
    };
    RandomPieces.prototype.getNext = function () {
        // remove first piece from list, shift everything down, add a new piece (maintain number)
        var next = this._pieces.shift();
        this._pieces.push(this._select());
        return next;
    };
    RandomPieces.prototype.getList = function () {
        return this._pieces;
    };
    return RandomPieces;
}());
/************************************************************************
* GRID: 2d array, valid & empty checking
************************************************************************/
var Grid = (function () {
    function Grid(numCols, numRows) {
        this.numCols = numCols;
        this.numRows = numRows;
        // create the 2d array
        this._grid = [];
        for (var r = 0; r < this.numRows + NUM_TOP_ROWS; r++) {
            var oneRow = [];
            for (var c = 0; c < this.numCols; c++) {
                oneRow[c] = Shape.Empty;
            }
            this._grid[r] = oneRow;
        }
    }
    Grid.prototype.toString = function () {
        var result = "";
        for (var r = 0; r < this.numRows + NUM_TOP_ROWS; r++) {
            for (var c = 0; c < this.numCols; c++) {
                result += this._grid[r][c] + " ";
            }
            result += "\n";
        }
        return result;
    };
    Grid.prototype.get = function (row, col) {
        return this._grid[row][col];
    };
    Grid.prototype.set = function (row, col, shape) {
        this._grid[row][col] = shape;
    };
    Grid.prototype.isValidEmpty = function (row, col) {
        var isValidRow = (row >= 0 && row < this.numRows + NUM_TOP_ROWS);
        var isValidCol = (col >= 0 && col < this.numCols);
        return isValidRow && isValidCol && (this._grid[row][col] == Shape.Empty);
    };
    Grid.prototype._isFullRow = function (row) {
        for (var col = 0; col < this.numCols; col++) {
            if (this._grid[row][col] == Shape.Empty)
                return false;
        }
        return true;
    };
    Grid.prototype._clearRow = function (row) {
        for (var c = 0; c < this.numCols; c++) {
            this._grid[row][c] = Shape.Empty;
        }
    };
    Grid.prototype._collapseRow = function (row) {
        var tallest = this._tallestDirtyRow();
        while (row > tallest) {
            this._shiftRowFromTo(row - 1, row);
            row--;
        }
        this._clearRow(row); //clear the top row that got shifted down
    };
    Grid.prototype.collapseFullRows = function () {
        var tallest = this._tallestDirtyRow();
        var numCollapsedRows = 0;
        for (var r = tallest; r < this.numRows + NUM_TOP_ROWS; r++) {
            if (this._isFullRow(r)) {
                this._collapseRow(r);
                numCollapsedRows++;
            }
        }
        return numCollapsedRows;
    };
    Grid.prototype._shiftRowFromTo = function (from, to) {
        for (var c = 0; c < this.numCols; c++)
            this._grid[to][c] = this._grid[from][c];
    };
    Grid.prototype._isDirtyRow = function (row) {
        var isEmptyRow = true;
        for (var col = 0; col < this.numCols; col++) {
            if (this._grid[row][col] != Shape.Empty) {
                isEmptyRow = false;
            }
        }
        return !isEmptyRow;
    };
    Grid.prototype._tallestDirtyRow = function () {
        var r = this.numRows - 1;
        while (this._isDirtyRow(r))
            r--;
        return r + 1;
    };
    Grid.prototype._numDirtyRows = function () {
        var tallest = this._tallestDirtyRow();
        return this.numRows - tallest; //# of "dirty" rows
    };
    return Grid;
}());
/************************************************************************
* TETROMINO: stores shape, an array of blocks, and methods
*			 contains, canMove, move, canRotate, rotate, add, & remove
************************************************************************/
var Tetromino = (function () {
    function Tetromino(shape, grid) {
        this.shape = shape;
        this.grid = grid;
        this.blocks = Tetromino.getBlocks(this.shape, this, this.grid.numCols);
        this._ghost = new Ghost(this);
    }
    Tetromino.prototype.reset = function () {
        this.blocks = Tetromino.getBlocks(this.shape, this, this.grid.numCols);
        this._ghost.reset();
    };
    Tetromino.prototype.contains = function (r, c) {
        var inGhost = this._ghost.contains(r, c);
        for (var i in this.blocks) {
            var inBlocks = this.blocks[i].equals(r, c);
            if (inBlocks || inGhost) {
                return true;
            }
        }
        return false;
    };
    Tetromino.prototype._canMove = function (dir) {
        for (var i in this.blocks) {
            if (!this.blocks[i].canMove(dir)) {
                return false;
            }
        }
        return true;
    };
    Tetromino.prototype.move = function (dir) {
        if (this._canMove(dir)) {
            this.remove();
            for (var i in this.blocks) {
                this.blocks[i].move(dir);
            }
            this.add();
        }
    };
    Tetromino.prototype._canRotate = function () {
        for (var b in this.blocks) {
            if (!this.blocks[b].canRotate()) {
                return false;
            }
        }
        return true;
    };
    Tetromino.prototype.rotate = function () {
        if (this._canRotate()) {
            this.remove();
            for (var b in this.blocks) {
                this.blocks[b].rotate();
            }
            this.add();
        }
    };
    Tetromino.prototype.add = function () {
        for (var i in this.blocks) {
            var b = this.blocks[i];
            this.grid.set(b.r, b.c, this.shape);
        }
    };
    Tetromino.prototype.remove = function () {
        for (var i in this.blocks) {
            var b = this.blocks[i];
            this.grid.set(b.r, b.c, Shape.Empty);
        }
    };
    Tetromino.prototype.fall = function () {
        if (this._canMove(Direction.Down)) {
            this.move(Direction.Down);
            return true;
        }
        return false;
    };
    Tetromino.prototype.drop = function () {
        while (this.fall())
            ;
    };
    Tetromino.prototype.getGhost = function () {
        return this._ghost.update();
    };
    Tetromino.getBlocks = function (shape, T, numCols) {
        //center, top position
        var mid = Math.floor(numCols / 2) - 1; //integer division, truncates
        var i = mid - 1; //shifted because 4-wide long
        var j = mid;
        var l = mid;
        var s = mid;
        var t = mid;
        var z = mid;
        var o = mid;
        var top = NUM_TOP_ROWS - 1; //shifted for top rows
        switch (shape) {
            case Shape.I: return [new Block(0 + top, i + 1, T), new Block(0 + top, i + 0, T), new Block(0 + top, i + 2, T), new Block(0 + top, i + 3, T)];
            case Shape.J: return [new Block(1 + top, j + 1, T), new Block(0 + top, j + 0, T), new Block(1 + top, j + 0, T), new Block(1 + top, j + 2, T)];
            case Shape.L: return [new Block(1 + top, l + 1, T), new Block(0 + top, l + 2, T), new Block(1 + top, l + 0, T), new Block(1 + top, l + 2, T)];
            case Shape.O: return [new Block(0 + top, o + 0, T), new Block(0 + top, o + 1, T), new Block(1 + top, o + 0, T), new Block(1 + top, o + 1, T)];
            case Shape.S: return [new Block(0 + top, s + 1, T), new Block(0 + top, s + 2, T), new Block(1 + top, s + 0, T), new Block(1 + top, s + 1, T)];
            case Shape.T: return [new Block(1 + top, t + 1, T), new Block(0 + top, t + 1, T), new Block(1 + top, t + 0, T), new Block(1 + top, t + 2, T)];
            case Shape.Z: return [new Block(0 + top, z + 1, T), new Block(0 + top, z + 0, T), new Block(1 + top, z + 1, T), new Block(1 + top, z + 2, T)];
            case Shape.Ghost: return [new Block(-1, -1, T), new Block(-1, -1, T), new Block(-1, -1, T), new Block(-1, -1, T)];
        }
    };
    return Tetromino;
}());
/************************************************************************
* GHOST: stores blocks, parent Tetromino, also contains methods
*		 calculate, reset, and contains
************************************************************************/
var Ghost = (function () {
    function Ghost(tetromino) {
        this._tetromino = tetromino;
    }
    Ghost.prototype.update = function () {
        // deep copy
        var ghost = [];
        for (var i in this._tetromino.blocks) {
            var b = this._tetromino.blocks[i];
            ghost.push(new Block(b.r, b.c, this._tetromino));
        }
        //hard drop
        outer: while (true) {
            for (var i in ghost)
                if (!ghost[i].canMove(Direction.Down))
                    break outer;
            for (var i in ghost)
                ghost[i].r++;
        }
        //update ghostBlocks
        this.blocks = ghost;
        return this;
    };
    Ghost.prototype.reset = function () {
        this.blocks = Tetromino.getBlocks(Shape.Ghost, this._tetromino, this._tetromino.grid.numCols);
    };
    Ghost.prototype.contains = function (r, c) {
        for (var i in this.blocks) {
            var inGhost = this.blocks[i].equals(r, c);
            if (inGhost)
                return true;
        }
        return false;
    };
    return Ghost;
}());
/************************************************************************
* BLOCK: stores row, col, parent Tetromino, also contains methods
*		 equals, canMove, move, canRotate, rotate
************************************************************************/
var Block = (function () {
    function Block(row, col, T) {
        this.r = row;
        this.c = col;
        this._T = T;
    }
    Block.prototype.equals = function (r, c) {
        return (this.r == r && this.c == c);
    };
    Block.prototype.canMove = function (dir) {
        var newR = this.r;
        var newC = this.c;
        switch (dir) {
            case Direction.Down:
                newR = this.r + 1;
                break;
            case Direction.Left:
                newC = this.c - 1;
                break;
            case Direction.Right:
                newC = this.c + 1;
                break;
        }
        return (this._T.contains(newR, newC) || this._T.grid.isValidEmpty(newR, newC));
    };
    Block.prototype.move = function (dir) {
        switch (dir) {
            case Direction.Down:
                this.r++;
                break;
            case Direction.Left:
                this.c--;
                break;
            case Direction.Right:
                this.c++;
                break;
        }
    };
    Block.prototype.canRotate = function () {
        if (this._T.shape == Shape.O) {
            return true; //squares don't rotate
        }
        //first block is pivot
        var pivot = this._T.blocks[0];
        var newR = (this.c - pivot.c) + pivot.r;
        var newC = -(this.r - pivot.r) + pivot.c;
        return (this._T.contains(newR, newC) || this._T.grid.isValidEmpty(newR, newC));
    };
    Block.prototype.rotate = function () {
        if (this._T.shape == Shape.O) {
            return; //squares don't rotate
        }
        //first block is pivot
        var pivot = this._T.blocks[0];
        var newC = -(this.r - pivot.r) + pivot.c;
        var newR = (this.c - pivot.c) + pivot.r;
        this.c = newC;
        this.r = newR;
    };
    return Block;
}());
/************************************************************************
* CanvasUtil: (rendering) set board canvas w x h, draw block & board
************************************************************************/
var CanvasUtil = (function () {
    function CanvasUtil() {
    }
    CanvasUtil.rect = function (element, x, y, w, h, weight, fill, line) {
        var ctx = element.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = line;
        ctx.fillRect(x, y, w, h);
        ctx.lineWidth = weight;
        ctx.rect(x, y, w, h);
        if (weight != 0)
            ctx.stroke();
    };
    CanvasUtil.circle = function (element, x, y, r, fill, line) {
        var ctx = element.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = line;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };
    CanvasUtil.roundRect = function (element, x, y, w, h, r, color) {
        var ctx = element.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = color;
        // ctx.strokeStyle = "red";
        // ctx.lineWidth = 10;
        //draw rounded rectangle
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        //stroke & fill	
        ctx.fill();
        // ctx.stroke();  
    };
    return CanvasUtil;
}());
var ContainerDimension = (function () {
    function ContainerDimension() {
    }
    ContainerDimension.medium = function () {
        var container = new ContainerDimension();
        container.box = UNIT * 0.8 * 4;
        container.offset = 0;
        return container;
    };
    ContainerDimension.small = function () {
        var container = new ContainerDimension();
        container.box = UNIT * 0.7 * 4;
        container.offset = UNIT * 0.2;
        return container;
    };
    return ContainerDimension;
}());
var BlockDimension = (function () {
    function BlockDimension() {
    }
    BlockDimension.large = function () {
        var block = new BlockDimension();
        block.size = UNIT;
        block.weight = UNIT / 10;
        return block;
    };
    BlockDimension.medium = function () {
        var block = new BlockDimension();
        block.size = UNIT * 0.7;
        block.weight = UNIT / 10 * 0.7;
        return block;
    };
    BlockDimension.small = function () {
        var block = new BlockDimension();
        block.size = UNIT * 0.6;
        block.weight = UNIT / 10 * 0.6;
        return block;
    };
    return BlockDimension;
}());
var BezelDimension = (function () {
    function BezelDimension() {
    }
    BezelDimension.preview = function () {
        var bezel = new BezelDimension();
        bezel.x = 0;
        bezel.y = 0;
        bezel.outer = UNIT / 5;
        bezel.mid = UNIT / 3;
        bezel.inner = 0;
        bezel.ctn = 0;
        bezel.thickness = bezel.outer + bezel.mid + bezel.inner + bezel.ctn;
        return bezel;
    };
    BezelDimension.next = function (numCols) {
        var bezel = new BezelDimension();
        bezel.x = UNIT * (6 + numCols);
        bezel.y = UNIT * 2;
        bezel.outer = UNIT / 5;
        bezel.mid = UNIT / 3;
        bezel.inner = 0;
        bezel.ctn = 0;
        bezel.thickness = bezel.outer + bezel.mid + bezel.inner + bezel.ctn;
        return bezel;
    };
    BezelDimension.board = function () {
        var bezel = new BezelDimension();
        bezel.x = UNIT * 4;
        bezel.y = 0;
        bezel.outer = UNIT / 5;
        bezel.mid = UNIT / 7;
        bezel.inner = UNIT * 0.8;
        bezel.ctn = UNIT / 5;
        bezel.thickness = bezel.outer + bezel.mid + bezel.inner + bezel.ctn;
        return bezel;
    };
    BezelDimension.hold = function () {
        var bezel = new BezelDimension();
        bezel.x = UNIT * 0.5;
        bezel.y = UNIT * 2;
        bezel.outer = UNIT / 5;
        bezel.mid = UNIT / 3;
        bezel.inner = 0;
        bezel.ctn = 0;
        bezel.thickness = bezel.outer + bezel.mid + bezel.inner + bezel.ctn;
        return bezel;
    };
    return BezelDimension;
}());
var Preview = (function () {
    function Preview() {
        var bezel = BezelDimension.preview();
        var container = ContainerDimension.small();
        var block = BlockDimension.small();
        // set bezel height & width
        bezel.height = container.box + 2 * bezel.thickness;
        bezel.width = container.box + 2 * bezel.thickness;
        // set medium container x & y
        container.x = bezel.thickness + bezel.x;
        container.y = bezel.thickness + bezel.y;
        // store dimensions
        this._bezel = bezel;
        this._container = container;
        this._block = block;
    }
    Preview.prototype.bezel = function () {
        return this._bezel;
    };
    Preview.prototype.container = function () {
        return this._container;
    };
    Preview.prototype.block = function () {
        return this._block;
    };
    return Preview;
}());
var Hold = (function () {
    function Hold() {
        var bezel = BezelDimension.hold();
        var container = ContainerDimension.medium();
        var block = BlockDimension.medium();
        // set bezel height & width
        bezel.height = container.box + 2 * bezel.thickness;
        bezel.width = container.box + 2 * bezel.thickness;
        // set medium container x & y
        container.x = bezel.thickness + bezel.x;
        container.y = bezel.thickness + bezel.y;
        // store dimensions
        this._bezel = bezel;
        this._container = container;
        this._block = block;
    }
    Hold.prototype.bezel = function () {
        return this._bezel;
    };
    Hold.prototype.container = function () {
        return this._container;
    };
    Hold.prototype.block = function () {
        return this._block;
    };
    return Hold;
}());
var Board = (function () {
    function Board(numCols, numRows) {
        var bezel = BezelDimension.board();
        var block = BlockDimension.large();
        // set bezel height & width
        bezel.height = numRows * block.size + 2 * bezel.thickness;
        bezel.width = numCols * block.size + 2 * bezel.thickness;
        // store dimensions
        this._bezel = bezel;
        this._block = block;
    }
    Board.prototype.bezel = function () {
        return this._bezel;
    };
    Board.prototype.block = function () {
        return this._block;
    };
    return Board;
}());
var Next = (function () {
    function Next(numCols) {
        var bezel = BezelDimension.next(numCols);
        var mediumContainer = ContainerDimension.medium();
        var smallContainer = ContainerDimension.small();
        var mediumBlock = BlockDimension.medium();
        var smallBlock = BlockDimension.small();
        // set bezel height & width
        bezel.height = mediumContainer.box * NUM_NEXT_PIECES + 2 * bezel.thickness + mediumContainer.offset;
        bezel.width = mediumContainer.box + 2 * bezel.thickness;
        // set medium container x & y
        mediumContainer.x = bezel.thickness + bezel.x;
        mediumContainer.y = bezel.thickness + bezel.y;
        // set small container x & y
        smallContainer.x = bezel.thickness + smallContainer.offset + bezel.x;
        // store dimensions
        this._bezel = bezel;
        this._mediumContainer = mediumContainer;
        this._smallContainer = smallContainer;
        this._mediumBlock = mediumBlock;
        this._smallBlock = smallBlock;
    }
    Next.prototype.bezel = function () {
        return this._bezel;
    };
    Next.prototype.container = function (index) {
        if (index == 0) {
            return this._mediumContainer;
        }
        else {
            var smallContainer = this._smallContainer;
            var mediumContainer = this._mediumContainer;
            var bezel = this._bezel;
            smallContainer.y = bezel.thickness + bezel.y + 2 * smallContainer.offset + mediumContainer.box * index;
            return smallContainer;
        }
    };
    Next.prototype.block = function (index) {
        if (index == 0) {
            return this._mediumBlock;
        }
        else {
            return this._smallBlock;
        }
    };
    return Next;
}());
var Canvas = (function () {
    function Canvas(board, next, hold) {
        this._width = board.bezel().width + next.bezel().width + hold.bezel().width;
        this._height = Math.max(board.bezel().height, next.bezel().height);
    }
    Canvas.prototype.width = function () {
        return this._width;
    };
    Canvas.prototype.height = function () {
        return this._height;
    };
    return Canvas;
}());
var Render = (function () {
    function Render(canvas, numCols, numRows) {
        this.numCols = numCols;
        this.numRows = numRows;
        this._element = canvas;
    }
    Render.prototype.drawInitialFrame = function () {
        // set up components
        this._board = new Board(this.numCols, this.numRows);
        this._next = new Next(this.numCols);
        this._hold = new Hold();
        this._canvas = new Canvas(this._board, this._next, this._hold);
        // set up canvas
        this._element.height = this._canvas.height();
        this._element.width = this._canvas.width();
        // draw empty frame
        this._drawBezel(this._board.bezel());
        this._drawBezel(this._hold.bezel());
        this._drawBezel(this._next.bezel());
        // draw cleared components
        this._clearBoard();
        this._clearNext();
        this._clearHold();
    };
    Render.prototype.drawStylePreview = function (shape) {
        this._preview = new Preview();
        this._element.height = this._preview.bezel().height;
        this._element.width = this._preview.bezel().width;
        this._drawBezel(this._preview.bezel());
        this.updatePreview(shape);
    };
    Render.prototype._clearBoard = function () {
        for (var r = NUM_TOP_ROWS; r < this.numRows + NUM_TOP_ROWS; r++) {
            for (var c = 0; c < this.numCols; c++)
                this._drawGridBlock(r, c, Shape.Empty);
        }
    };
    Render.prototype._clearNext = function () {
        this._drawContainer(this._next.container(0), this._next.block(0), Shape.Empty); // medium box
        //draw smaller boxes (skip the first one)
        for (var i = 1; i < NUM_NEXT_PIECES; i++) {
            this._drawContainer(this._next.container(i), this._next.block(i), Shape.Empty);
        }
    };
    Render.prototype._clearHold = function () {
        this._drawContainer(this._hold.container(), this._hold.block(), Shape.Empty);
    };
    Render.prototype.updateBoard = function (grid) {
        for (var r = NUM_TOP_ROWS; r < this.numRows + NUM_TOP_ROWS; r++) {
            for (var c = 0; c < this.numCols; c++)
                this._drawGridBlock(r, c, grid.get(r, c));
        }
    };
    Render.prototype.updateNext = function (shapes) {
        this._drawContainer(this._next.container(0), this._next.block(0), shapes[0]); // medium box
        //draw smaller boxes (skip the first one)
        for (var i = 1; i < shapes.length; i++) {
            this._drawContainer(this._next.container(i), this._next.block(i), shapes[i]);
        }
    };
    Render.prototype.updateHold = function (shape) {
        this._drawContainer(this._hold.container(), this._hold.block(), shape);
    };
    Render.prototype.updatePreview = function (shape) {
        this._drawContainer(this._preview.container(), this._preview.block(), shape);
    };
    Render.prototype.drawTetromino = function (tetromino) {
        this._drawGhost(tetromino);
        for (var i in tetromino.blocks) {
            var block = tetromino.blocks[i];
            if (block.r >= NUM_TOP_ROWS) {
                this._drawGridBlock(block.r, block.c, tetromino.shape);
            }
        }
    };
    Render.prototype.eraseTetromino = function (tetromino) {
        for (var a = 0; a < 5; a++) {
            for (var i in tetromino.blocks) {
                var block = tetromino.blocks[i];
                if (block.r >= NUM_TOP_ROWS) {
                    this._drawGridBlock(block.r, block.c, Shape.Empty);
                }
            }
        } //erase 5 times to eliminate blur trails
        this._eraseGhost(tetromino);
    };
    Render.prototype._drawGhost = function (tetromino) {
        var ghostBlocks = tetromino.getGhost().blocks;
        for (var i in ghostBlocks) {
            var g = ghostBlocks[i];
            this._drawGridBlock(g.r, g.c, Shape.Ghost);
        }
    };
    Render.prototype._eraseGhost = function (tetromino) {
        var ghostBlocks = tetromino.getGhost().blocks;
        for (var i in ghostBlocks) {
            var g = ghostBlocks[i];
            this._drawGridBlock(g.r, g.c, Shape.Empty);
        }
    };
    Render.prototype._drawGridBlock = function (row, col, shape) {
        var bezel = this._board.bezel();
        var block = this._board.block();
        var gridX = bezel.thickness + bezel.x;
        var gridY = bezel.thickness + bezel.y;
        var x = col * block.size + gridX;
        var y = row * block.size + gridY - NUM_TOP_ROWS * block.size; // subtract top rows
        this._drawSquare(block, x, y, shape);
    };
    Render.prototype._drawBezel = function (bezelDim) {
        var x = bezelDim.x;
        var y = bezelDim.y;
        var w = bezelDim.width;
        var h = bezelDim.height;
        var otr = bezelDim.outer;
        var mid = bezelDim.mid;
        var inr = bezelDim.inner;
        var ctn = bezelDim.ctn;
        var o = otr;
        var m = otr + mid;
        var i = otr + mid + inr;
        var c = otr + mid + inr + ctn;
        // draw bezel
        if (otr != 0)
            CanvasUtil.roundRect(this._element, x + 0, y + 0, w, h, UNIT * 0.9, "#666"); //outer
        if (mid != 0)
            CanvasUtil.roundRect(this._element, x + o, y + o, w - (o * 2), h - (o * 2), UNIT * 0.8, "#f9f9f9"); //mid
        if (inr != 0)
            CanvasUtil.roundRect(this._element, x + m, y + m, w - (m * 2), h - (m * 2), UNIT * 0.7, "#ddd"); //inner
        if (ctn != 0)
            CanvasUtil.roundRect(this._element, x + i, y + i, w - (i * 2), h - (i * 2), UNIT * 0.4, "#000"); //container
    };
    Render.prototype._drawContainer = function (contDim, blockDim, shape) {
        var size = contDim.box;
        var fill = getColor(Shape.Empty).fill;
        // draw empty container first
        CanvasUtil.roundRect(this._element, contDim.x, contDim.y, size, size, UNIT / 3, "black");
        CanvasUtil.roundRect(this._element, contDim.x + (size * 0.05), contDim.y + (size * 0.05), size * 0.9, size * 0.9, UNIT / 4, fill);
        // then draw shape inside (if applicable)
        if (shape != Shape.Empty) {
            var coords = ContainerDraw._getCoordinates(shape, contDim, blockDim);
            for (var i in coords) {
                this._drawSquare(blockDim, coords[i].X, coords[i].Y, shape);
            }
        }
    };
    Render.prototype._drawSquare = function (blockDim, x, y, shape) {
        if (IMAGES.get(shape) == undefined) {
            this._drawDefaultSquare(blockDim, x, y, shape);
        }
        else {
            this._drawImageSquare(blockDim, x, y, shape);
        }
    };
    Render.prototype._drawDefaultSquare = function (blockDim, x, y, shape) {
        var size = blockDim.size;
        var weight = blockDim.weight;
        var otln = getColor(shape).outline;
        var fill = getColor(shape).fill;
        var shd = getColor(shape).shade;
        var hlgt = getColor(shape).highlight;
        var twkl = getColor(shape).twinkle;
        CanvasUtil.rect(this._element, x, y, size, size, 0, otln, otln); //outline
        CanvasUtil.rect(this._element, x + (size * 0.05), y + (size * 0.05), size * 0.9, size * 0.9, 0, fill, fill); //outer rectangle
        CanvasUtil.rect(this._element, x + (size * 0.25), y + (size * 0.25), size * 0.5, size * 0.5, weight, shd, hlgt); //inner rectangle
        CanvasUtil.rect(this._element, x + (size * 0.1), y + (size * 0.1), size * 0.1, size * 0.1, 0, twkl, twkl); //twinkle
    };
    Render.prototype._drawImageSquare = function (blockDim, x, y, shape) {
        var size = blockDim.size;
        var image = IMAGES.get(shape);
        var ctx = this._element.getContext("2d");
        ctx.drawImage(image, x, y, size, size);
    };
    return Render;
}());
var ContainerDraw = (function () {
    function ContainerDraw() {
    }
    ContainerDraw._getDimensions = function (shape) {
        switch (shape) {
            case Shape.I: return { w: 4, h: 1 };
            case Shape.J: return { w: 3, h: 2 };
            case Shape.L: return { w: 3, h: 2 };
            case Shape.O: return { w: 2, h: 2 };
            case Shape.S: return { w: 3, h: 2 };
            case Shape.T: return { w: 3, h: 2 };
            case Shape.Z: return { w: 3, h: 2 };
        }
    };
    ContainerDraw._getCoordinates = function (shape, contDim, blockDim) {
        var dim = ContainerDraw._getDimensions(shape);
        // calculate the center coordinates
        var x = contDim.x + (contDim.box - blockDim.size * dim.w) / 2; //depends on width
        var y = contDim.y + (contDim.box - blockDim.size * dim.h) / 2; //depends on height
        // get x & y coordinates of each block
        var s = blockDim.size;
        switch (shape) {
            case Shape.I: return [{ X: x, Y: y }, { X: x + s, Y: y }, { X: x + (2 * s), Y: y }, { X: x + (3 * s), Y: y }];
            case Shape.J: return [{ X: x, Y: y }, { X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }];
            case Shape.L: return [{ X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }, { X: x + (2 * s), Y: y }];
            case Shape.O: return [{ X: x, Y: y }, { X: x + s, Y: y }, { X: x + s, Y: y + s }, { X: x, Y: y + s }];
            case Shape.S: return [{ X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + s, Y: y }, { X: x + (2 * s), Y: y }];
            case Shape.T: return [{ X: x + s, Y: y }, { X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }];
            case Shape.Z: return [{ X: x, Y: y }, { X: x + s, Y: y }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }];
        }
    };
    return ContainerDraw;
}());
function addImageButton(shape) {
    // set up preview canvas
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "plstestme");
    var render = new Render(canvas, 0, 0);
    render.drawStylePreview(shape);
    // set up an input element
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("style", "display: none;");
    input.onchange = function (e) {
        var url = window.URL.createObjectURL(e.target.files[0]);
        var img = new Image();
        img.src = url;
        IMAGES.set(shape, img);
        img.onload = function (e) {
            render.drawStylePreview(shape);
        };
    };
    // wrap it in a nice-looking label
    var label = document.createElement("label");
    label.classList.add("btn");
    label.classList.add("btn-default");
    label.classList.add("btn-file");
    label.innerHTML = "Choose " + shape;
    label.appendChild(input);
    // and stick it on the "homescreen" panel
    homescreen.appendChild(label);
    homescreen.appendChild(canvas);
}
addImageButton(Shape.I);
addImageButton(Shape.J);
addImageButton(Shape.L);
addImageButton(Shape.O);
addImageButton(Shape.S);
addImageButton(Shape.T);
addImageButton(Shape.Z);
/************************************************************************
* KEYBOARD INPUT: onkeydown
************************************************************************/
// start with empty function
window.onkeydown = function (e) { };
function gameKeyPress(game, e) {
    //any key to start game
    if (!game.started) {
        game.start();
        return;
    }
    //toggle play & pause
    if (e.keyCode == game.keys.play || e.keyCode == game.keys.pause) {
        if (game.playing)
            game.pause();
        else
            game.play();
    }
    //only listen to keys if game is playing
    if (game.playing) {
        if (e.keyCode == game.keys.down) {
            game.move(Direction.Down);
        }
        if (e.keyCode == game.keys.left) {
            game.move(Direction.Left);
        }
        if (e.keyCode == game.keys.right) {
            game.move(Direction.Right);
        }
        if (e.keyCode == game.keys.rotate) {
            game.rotate();
        }
        if (e.keyCode == game.keys.drop) {
            game.drop();
        }
        if (e.keyCode == game.keys.hold) {
            game.hold();
        }
    }
}
/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/
function startGame(canvas, numCols, numRows, keyControls) {
    var keys = new Keys(keyControls);
    var render = new Render(canvas, numCols, numRows);
    render.drawInitialFrame();
    var game = new Game(render, keys);
    addGameKeyListener(game);
}
function addGameKeyListener(game) {
    var oldKeyDown = window.onkeydown;
    window.onkeydown = function (e) {
        oldKeyDown(e);
        gameKeyPress(game, e);
    };
}
play1.onclick = function (e) {
    well1.style.display = "block";
    form1.style.display = "none";
    startGame(canvas1, parseInt(cols1.value), parseInt(rows1.value), KeyControls.Default);
};
