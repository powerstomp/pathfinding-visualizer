function resizeMap(map, w, h) {
	return Array.from({ length: w }, (_, y) =>
		Array.from({ length: h }, (_, x) => map[y]?.[x] ?? false)
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
