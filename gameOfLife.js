/**
 * Created by Seth on 5/20/2015.
 */
var screenWidth = 1920;
var screenHeight = 1080;
var cellXCount = 444;
var cellYCount = 250;
var edgeCount = 6;
var updatesPerMinute = 1200;
var fadeRate = 1; // 0-1 (no fade to immediate fade)

var backgroundColor = "#6B0000";
var cellColor = "darkBlue";
var historyColor = "darkBlue";

var totalXCount = cellXCount + (edgeCount * 2);
var totalYCount = cellYCount + (edgeCount * 2);
var cellXSize = screenWidth / cellXCount;
var cellYSize = screenHeight / cellYCount;

var game = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cells = [];
var stagingCells = [];
var elapsedTime = 0;
var currentCellsSprite = null;
var historyCellSprite = null;

function preload() {

}

function create() {
    var cellSize = (cellXCount + edgeCount * 2) * (cellYCount + edgeCount * 2);
    var cellSizeTotal = cellSize;

    while (cellSize--) {
        var cell = new Cell(cellSizeTotal - cellSize);
        cell.alive = this.game.rnd.integerInRange(0, 1) === 0;
        cells.push(cell);
    }

    for (var i = 0; i < cellSizeTotal; i++) {
        setCellNeighbors(i);
    }

    this.bmd=this.game.add.bitmapData(screenWidth ,screenHeight);
    this.ctx=this.bmd.context;

    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, cellXSize * cellXCount, cellYSize * cellYCount);

    /*this.ctx.beginPath();
     this.ctx.strokeStyle = "gray";
     this.ctx.lineWidth = 1.5;

     for (var x = 0; x < cellXCount; x++) {
     this.ctx.moveTo(x * cellXSize, 0);
     this.ctx.lineTo(x * cellXSize, screenHeight);
     this.ctx.stroke();
     }

     for (var y = 0; y < cellYCount; y ++) {
     this.ctx.moveTo(0, y * cellYSize);
     this.ctx.lineTo(screenWidth, y * cellYSize);
     this.ctx.stroke();
     }

     this.ctx.closePath();*/

    this.game.add.sprite(0,0,this.bmd);
}

function update() {

    elapsedTime += this.game.time.physicsElapsed;

    if (elapsedTime > 60 / updatesPerMinute ) {
        elapsedTime -= (60 / updatesPerMinute);

        for (var y = 0; y < totalYCount; y++) {
            for (var x = 0; x < totalXCount; x++) {
                var index = x + (totalXCount * y);
                stagingCells[index] = getNewCellStatus(index);
            }
        }

        for (var i = 0; i < stagingCells.length; i++) {
            cells[i].alive = stagingCells[i] === 1;
        }

        if (currentCellsSprite !== null) {
            currentCellsSprite.destroy();
        }

        var bmd = this.game.make.bitmapData(screenWidth, screenHeight);
        var ctx = bmd.context;
        ctx.fillStyle = cellColor;

        var histBmd = this.game.make.bitmapData(screenWidth, screenHeight);
        if (historyCellSprite !== null) {
            histBmd.copyRect(historyCellSprite, new Phaser.Rectangle(0, 0, screenWidth, screenHeight));
        }
        var histCtx = histBmd.context;

        if (historyCellSprite !== null) {
            historyCellSprite.destroy();
        }

        histCtx.globalAlpha = fadeRate;
        histCtx.fillStyle = backgroundColor;
        histCtx.fillRect(0, 0, cellXSize * cellXCount, cellYSize * cellYCount);

        histCtx.globalAlpha = 1;
        histCtx.fillStyle = historyColor;

        for (var x = 0; x < cellXCount; x++) {
            for (var y = 0; y < cellYCount; y++) {
                if (cells[(x + edgeCount) + (totalXCount * (y + edgeCount))].alive) {
                    ctx.fillRect(x * cellXSize, y * cellYSize, cellXSize, cellYSize)
                    histCtx.fillRect(x * cellXSize, y * cellYSize, cellXSize, cellYSize)
                }
            }
        }

        historyCellSprite = this.game.add.sprite(0, 0, histBmd);
        currentCellsSprite = this.game.add.sprite(0,0,bmd);
    }
}

function getNewCellStatus(index) {
    var retVal = null;
    var currentStatus = cells[index].alive;
    var neighborCount = cells[index].getAliveNeighborCount();

    if (currentStatus) {
        if (neighborCount < 2 || neighborCount > 3) {
            retVal = 0;
        } else {
            retVal = 1;
        }
    } else {
        if (neighborCount === 3 || neighborCount === 5 || neighborCount === 6) {
            retVal = 1;
        } else {
            retVal = 0;
        }
    }

    return retVal;
}

function Cell(index) {
    this.index = index;
    this.alive = false;

    this.neighbors = [];
}

Cell.prototype.getAliveNeighborCount = function() {
    var ret = 0;
    for (var i = 0; i < this.neighbors.length; i++) {
        if (this.neighbors[i].alive) {
            ret++;
        }
    }
    return ret;
};

function setCellNeighbors(index) {
    if (index >= totalXCount) {
        if (index % totalXCount > 0) {
            cells[index].neighbors.push(cells[index - totalXCount - 1]);
        }
        cells[index].neighbors.push(cells[index - totalXCount]);
        if ((index + 1) % totalXCount > 0) {
            cells[index].neighbors.push(cells[index - totalXCount + 1]);
        }
    }
    if (index != 0 && index % totalXCount > 0) {
        cells[index].neighbors.push(cells[index - 1]);
    }
    if ((index + 1) % totalXCount > 0) {
        cells[index].neighbors.push(cells[index + 1]);
    }
    if (index < (totalXCount * totalYCount - totalXCount)) {
        if (index != 0 && index % totalXCount > 0) {
            cells[index].neighbors.push(cells[index + totalXCount - 1]);
        }
        cells[index].neighbors.push(cells[index + totalXCount]);
        if ((index + 1) % totalXCount > 0) {
            cells[index].neighbors.push(cells[index + totalXCount + 1]);
        }
    }
}