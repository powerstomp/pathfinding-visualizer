const lineColor = "oklch(70.9% 0.01 56.259)";
const fillColor = "oklch(44.4% 0.011 73.639)";
const wallColor = "oklch(37.2% 0.044 257.287)";
const startColor = "oklch(76.8% 0.233 130.85)";
const goalColor = "oklch(82.8% 0.189 84.429)";
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
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.ctx.fillStyle = fillColor;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.ctx.strokeStyle = lineColor;
			this.ctx.lineWidth = 1;

			this.ctx.beginPath();
			for (let i = 0; i <= this.numRows; i++) {
				const y = i * this.cellHeight;

				this.ctx.moveTo(0, y);
				this.ctx.lineTo(this.canvas.width, y);
			}
			for (let i = 0; i <= this.numCols; i++) {
				const x = i * this.cellWidth;
				this.ctx.moveTo(x, 0);
				this.ctx.lineTo(x, this.canvas.height);
			}
			this.ctx.stroke();

			for (let i = 0; i < this.numRows; i++)
				for (let j = 0; j < this.numCols; j++)
					this.drawCell(i, j);
		},

		getCellColor(i, j) {
			return this.map[i][j] === 'S' ? startColor
				: this.map[i][j] === 'G' ? goalColor
					: this.map[i][j] ? wallColor
						: fillColor;
		},
		drawCell(i, j, color) {
			if (i < 0 || i >= this.numRows || j < 0 || j >= this.numCols)
				return;
			if (!color)
				color = this.getCellColor(i, j);

			const x = j * this.cellWidth;
			const y = i * this.cellHeight;

			this.ctx.fillStyle = color;
			this.ctx.fillRect(x + 1, y + 1, this.cellWidth - 2, this.cellHeight - 2);
		},
		toggleCell(i, j) {
			if (this.map[i][j])
				this.map[i][j] = false;
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
