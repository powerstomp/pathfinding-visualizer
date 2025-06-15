const lineColor = "#8db7d2";       // Deep Olive Green (for grid lines, subtle but visible)
const fillColor = "#5e62a9";       // Earthy Muted Green (for the default grid background)
const wallColor = "#434279";      // Dark Indigo (strong contrast for impassable walls)
const startColor = "oklch(75% 0.28 120)";     // Lively Chartreuse (clearly marks the beginning)
const goalColor = "oklch(85% 0.2 80)";       // Sunny Yellow (clearly marks the destination, good contrast with start)

function gridRenderer() {
	return {
		numRows: 15,
		numCols: 25,
		map: [],

		init() {
			this.canvas = document.getElementById("grid");
			this.ctx = this.canvas.getContext("2d");

			this.onMapSizeChange();
		},

		setupCanvas() {
			const parent = this.canvas.parentElement;

			this.canvas.width = this.canvas.height = 0;

			this.canvas.width = parent.clientWidth;
			this.canvas.height = parent.clientHeight;

			this.cellWidth = this.canvas.width / this.numCols;
			this.cellHeight = this.canvas.height / this.numRows;
		},

		onViewChange() {
			this.setupCanvas();
			this.drawGrid();
		},
		onMapSizeChange() {
			this.map = resizeMap(this.map, this.numRows, this.numCols);
			this.onViewChange();
		},

		drawGrid() {
			let canvasWidth = this.canvas.width;
			let canvasHeight = this.canvas.height;
			this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			this.ctx.fillStyle = fillColor;
			this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

			this.ctx.strokeStyle = lineColor;
			this.ctx.lineWidth = 1;

			this.ctx.beginPath();
			for (let i = 0; i <= this.numRows; i++) {
				let y = Math.floor(i * this.cellHeight);
				this.ctx.beginPath();
				this.ctx.moveTo(0, y + 0.5);
				this.ctx.lineTo(canvasWidth, y + 0.5);
				this.ctx.stroke();
			}
			for (let i = 0; i <= this.numCols; i++) {
				let x = Math.floor(i * this.cellWidth);
				this.ctx.beginPath();
				this.ctx.moveTo(x + 0.5, 0);
				this.ctx.lineTo(x + 0.5, canvasHeight);
				this.ctx.stroke();
			}
			this.ctx.stroke();

			for (let i = 0; i < this.numRows; i++)
				for (let j = 0; j < this.numCols; j++)
					this.drawCell(i, j);
		},

		getCellColor(i, j) {
			return this.map[i][j] === 'S' ? startColor
				: this.map[i][j] === 'G' ? goalColor
					: this.map[i][j] === true ? wallColor
						: fillColor;
		},
		drawCell(i, j, color) {
			if (i < 0 || i >= this.numRows || j < 0 || j >= this.numCols)
				return;
			if (!color)
				color = this.getCellColor(i, j);

			let x = Math.floor(j * this.cellWidth);
			let y = Math.floor(i * this.cellHeight);
			let nextX = Math.floor((j + 1) * this.cellWidth);
			let nextY = Math.floor((i + 1) * this.cellHeight);

			this.ctx.fillStyle = color;
			this.ctx.fillRect(x + 1, y + 1, nextX - x - 1, nextY - y - 1);

			this.ctx.strokeStyle = "black";
			this.ctx.font = "14px monospaced";
			this.ctx.textBaseline = "top";
			if (Number.isFinite(this.map[i][j]))
				this.ctx.strokeText(this.map[i][j], x + 2, y + 1);
		},
		toggleCell(i, j) {
			if (!Number.isFinite(this.map[i][j]))
				this.map[i][j] = getRandomDigit();
			else
				this.map[i][j] = (
					!findMap(this.map, 'S') ? 'S'
						: !findMap(this.map, 'G') ? 'G'
							: true);
		},
		onClick({ offsetX, offsetY }) {
			let cellX = Math.floor(offsetY / this.cellHeight),
				cellY = Math.floor(offsetX / this.cellWidth);
			this.toggleCell(cellX, cellY);
			this.drawCell(cellX, cellY);
		}
	}
}
