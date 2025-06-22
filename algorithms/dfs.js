function dfs({ map, start, goal, inform, markFrontier, markVisited, startIteration }) {
	let visited = Array.from(Array(map.length), () => new Array(map[0].length));
	let path = [];
	const run = (x, y) => {
		if (visited[x][y])
			return false;
		path.push([x, y]);
		if (x === goal[0] && y === goal[1])
			return true;

		startIteration();
		inform(`position: (${x}, ${y})`)
		visited[x][y] = true;
		markVisited([x, y]);

		for (const v of getAdjacent(map, [x, y]))
			if (run(...v))
				return true;

		path.pop();
		return false;
	};
	run(...start);
	return path.length ? path : null;
}
