function beam({ map, start, goal, inform, markFrontier, markVisited, startIteration, beamWidth }) {
    let visited = Array.from(Array(map.length), () => new Array(map[0].length));
    let q = new queue();
    q.push({ path: [start], cost: map[start[0]][start[1]], heuristicValue: heuristic(start, goal) });
    visited[start[0]][start[1]] = true;

    while (!q.isEmpty()) {
        startIteration();
        inform("path, heuristic cost:");
        let candidates = [];
        while (!q.isEmpty()) {
            let { path, cost, heuristicValue } = q.pop();
            const [x, y] = path[path.length - 1];
            inform(`${cost}, ${heuristicValue}`);
            markVisited([x, y]);
            if (x === goal[0] && y === goal[1]) {
                return path;

            }
            for (const [nx, ny] of getAdjacent(map, [x, y])) {
                if (!visited[nx][ny]) {
                    visited[nx][ny] = true;
                    markFrontier([nx, ny]);
                    candidates.push({
                        path: [...path, [nx, ny]],
                        cost: cost + map[nx][ny],
                        heuristicValue: heuristic([nx, ny], goal)
                    });

                }
            }
        }

        candidates.sort((a, b) => a.heuristicValue - b.heuristicValue);
        for (let i = 0; i < Math.min(beamWidth, candidates.length); i++) {
            q.push(candidates[i]);
            console.log(candidates[i]);

        }
    }
    return null;
}
