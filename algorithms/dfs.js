function dfs({ map, start, end, markFrontier, markVisited, startIteration }) {
	let visited = Array.from(Array(map.length), () => new Array(map[0].length));
	let queue = [start];
	while (queue.length) {
		let u = queue.pop();
		if (visited[u[0]][u[1]])
			continue;
		startIteration();
		visited[u[0]][u[1]] = true;
		markVisited(u);

		for (let i = 0; i < 4; i++) {
			let v = [u[0] + [0, 1, 0, -1][i], u[1] + [1, 0, -1, 0][i]];
			if (v[0] < 0 || v[0] >= map.length || v[1] < 0 || v[1] >= map[0].length)
				continue;
			if (map[v[0]][v[1]] === true || visited[v[0]][v[1]])
				continue;
			if (map[v[0]][v[1]] === 'G')
				return;
			queue.push(v);
			markFrontier(v);
		}
	}
	// return { cost: pathCost, path: [] };
}
