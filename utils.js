function getRandomDigit() { return 1 + Math.floor(Math.random() * 9) };

function resizeMap(map, w, h) {
	return Array.from({ length: w }, (_, y) =>
		Array.from({ length: h }, (_, x) => map[y]?.[x] ?? getRandomDigit())
	);
}
function findMap(map, item) {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === item)
				return [i, j];
		}
	}
	return null;
}
function getAdjacent(map, [_x, _y]) {
	let result = [];
	// console.log(_x, _y);
	for (let i = 0; i < 4; i++) {
		let x = _x + [0, 1, 0, -1][i], y = _y + [1, 0, -1, 0][i];
		if (x < 0 || y < 0 || x >= map.length || y >= map[0].length)
			continue;
		if (map[x][y] === true)
			continue;
		result.push([x, y]);
	}
	// console.log(result);
	return result;
}
function randomMazeGen(map) {
	const w = map.length;
	const h = map[0].length;

	let start = findMap(map, 'S');
	let goal = findMap(map, 'G');
	if (!start || !goal) return map;

	const newMap = Array.from({ length: w }, (_, i) =>
		Array.from({ length: h }, (_, j) => true)
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

	if (w % 2 === 0) {
		for (let j = 1; j < h - 1; j += Math.random() < 0.5 ? 2 : 1) {
			if (newMap[w - 2][j] === true) newMap[w - 2][j] = getRandomDigit();
		}
	}

	if (h % 2 === 0) {
		for (let i = 1; i < w - 1; i += Math.random() < 0.5 ? 2 : 1) {
			if (newMap[i][h - 2] === true) newMap[i][h - 2] = getRandomDigit();
		}
	}

	newMap[start[0]][start[1]] = 'S';
	newMap[goal[0]][goal[1]] = 'G';

	// console.log(newMap);
	return newMap;
}

function heuristic(a, b) {
	return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
