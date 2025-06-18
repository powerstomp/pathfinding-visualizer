function a_star({ map, start, goal, markFrontier, markVisited, startIteration }) {

    let cameFrom = Array.from(Array(map.length), () => new Array(map[0].length).fill(null));
    let g = Array.from(Array(map.length), () => new Array(map[0].length).fill(Infinity));
    let f = Array.from(Array(map.length), () => new Array(map[0].length).fill(Infinity));
    let openList = new minheap((a, b) => f[a[0]][a[1]] - f[b[0]][b[1]]);
    openList.push(start);

    g[start[0]][start[1]] = 0;
    f[start[0]][start[1]] = heuristic(start, goal);
    startIteration();
    markFrontier(start)

    while (openList.length() > 0) {
        startIteration();
        let cur = openList.pop();
        markVisited(cur);

        if (cur[0] === goal[0] && cur[1] === goal[1]) {
            let path = [cur]
            while (cameFrom[cur[0]][cur[1]]) {
                cur = cameFrom[cur[0]][cur[1]];
                path.push(cur);
            }
            return path.reverse();
        }

        for (const tmp of getAdjacent(map, cur)) {
            let tmp_g = g[cur[0]][cur[1]] + map[tmp[0]][tmp[1]];
            let tmp_f = tmp_g + heuristic(tmp, goal)

            if (tmp_f < f[tmp[0]][tmp[1]]) {
                g[tmp[0]][tmp[1]] = tmp_g;
                f[tmp[0]][tmp[1]] = tmp_f;
                cameFrom[tmp[0]][tmp[1]] = cur;

                if (!openList.arr.some(([x, y]) => x === tmp[0] && y === tmp[1])) {
                    markFrontier(tmp);
                    openList.push(tmp);
                }

            }
        }
    }
    return null;
}
