function bfs({ map, start, goal, markFrontier, markVisited, startIteration }) {
    let visited = Array.from(Array(map.length), () => new Array(map[0].length));
    let q = new queue();
    let parent = Array.from(Array(map.length), () => new Array(map[0].length).fill(null));

    q.push(start);
    visited[start[0]][start[1]] = true;

    while (!q.isEmpty()) {
        let [x, y] = q.pop();
        startIteration();
        markVisited([x, y]);
        if (x === goal[0] && y === goal[1]) {
            let trace = [[x, y]];
            while (parent[x][y]) {
                [x, y] = parent[x][y];
                trace.push([x, y]);
            }
            return trace.reverse();
        }
        for (const [nx, ny] of getAdjacent(map, [x, y])) {
            if (!visited[nx][ny]) {
                q.push([nx, ny]);
                visited[nx][ny] = true;
                parent[nx][ny] = [x, y];
                markFrontier([nx, ny]);
            }
        }
    }
    return null;
}