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
	console.log(_x, _y);
	for (let i = 0; i < 4; i++) {
		let x = _x + [0, 1, 0, -1][i], y = _y + [1, 0, -1, 0][i];
		if (x < 0 || y < 0 || x >= map.length || y >= map[0].length)
			continue;
		if (map[x][y] === true)
			continue;
		result.push([x, y]);
	}
	console.log(result);
	return result;
}
