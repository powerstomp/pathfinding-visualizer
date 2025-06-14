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
		},
		randomMazeGen() {
			const w = this.numRows;
			const h = this.numCols;

			let start = findMap(this.map, 'S');
			let goal = findMap(this.map, 'G');
			if (!start || !goal) return this.map;

			const newMap = Array.from({ length: w }, (_, i) =>
				Array.from({ length: h }, (_, j) =>
					(i === 0 || i === w - 1 || j === 0 || j === h - 1)
						? getRandomDigit()
						: true 
				)
			);

			let stack = [];
			let sx = start[0], sy = start[1];
			if (sx <= 0) sx = 1;
			if (sy <= 0) sy = 1;
			if (sx >= w - 1) sx = w - 2;
			if (sy >= h - 1) sy = h - 2;
			if (sx % 2 === 0) sx++;
			if (sy % 2 === 0) sy++;
			newMap[sx][sy] = getRandomDigit();
			stack.push([sx, sy]);

			const dirs = [
				[0, 2],  // D
				[2, 0],  // R
				[0, -2], // U
				[-2, 0], // L
			];

			while (stack.length) {
				const [x, y] = stack[stack.length - 1];
				let neighbors = [];
				for (let [dx, dy] of dirs) {
					let nx = x + dx, ny = y + dy;
					if (
						nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 &&
						newMap[nx][ny] === true

					) {
						neighbors.push([nx, ny, dx, dy]);
					}
				}
				if (neighbors.length) {
					const [nx, ny, dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];
					newMap[x + dx / 2][y + dy / 2] = getRandomDigit();
					newMap[nx][ny] = getRandomDigit();
					stack.push([nx, ny]);

				} else {
					stack.pop();
				}
			}

			for (let i = 0; i < w; i++) {
				let rand = Math.random();
				if (rand < 0.5) {
					newMap[i][h - 2] = getRandomDigit();
				}
			}

			for (let j = 0; j < h; j++) {
				let rand = Math.random();
				if (rand < 0.5) {
					newMap[w - 2][j] = getRandomDigit();
				}
			}

			for (let j = 0; j < h; j++) {
				if (Math.random() < 0.3) newMap[0][j] = true;
			}

			for (let i = 0; i < w; i++) {
				if (Math.random() < 0.3) newMap[i][0] = true;
			}

			for (let j = 0; j < h; j++) {
				if (Math.random() < 0.3) newMap[w - 1][j] = true;
			}

			for (let i = 0; i < w; i++) {
				if (Math.random() < 0.3) newMap[i][h - 1] = true;
			}

			let sS = getAdjacent(newMap, start);
			let gS = getAdjacent(newMap, goal);
			while (sS.length == 0 || gS.length == 0) {
				let rand = Math.floor(Math.random() * 4);
				if (sS.length == 0) {
					if (newMap[start[0] + [0, 1, 0, -1][rand]][start[1] + [1, 0, -1, 0][rand]] !== true) {
						newMap[start[0] + [0, 1, 0, -1][rand]][start[1] + [1, 0, -1, 0][rand]] = getRandomDigit();
						sS = getAdjacent(newMap, start);
					}
				}
				if (gS.length == 0) {
					if (newMap[goal[0] + [0, 1, 0, -1][rand]][goal[1] + [1, 0, -1, 0][rand]] !== true) {
						newMap[goal[0] + [0, 1, 0, -1][rand]][goal[1] + [1, 0, -1, 0][rand]] = getRandomDigit();
						gS = getAdjacent(newMap, goal);
					}
				}
			}
			
			newMap[start[0]][start[1]] = 'S';
			newMap[goal[0]][goal[1]] = 'G';
			
			this.map = newMap;
			console.log(this.map);
			this.onViewChange();
		}
	}
}
