function heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function isValid(x, y, map) {
    if (map[x][y] === true)
        return false;
    return true;
}

function a_star({ map, start, goal, markFrontier, markVisited, startIteration }) {
    openList = [start]
    cameFrom = Array.from(Array(map.length), () => new Array(map[0].length).fill(null));
    g = Array.from(Array(map.length), () => new Array(map[0].length).fill(Infinity));
    f = Array.from(Array(map.length), () => new Array(map[0].length).fill(Infinity));

    g[start[0]][start[1]] = 0;
    f[start[0]][start[1]] = heuristic(start, goal);
    startIteration();
    markFrontier(start)

    while (openList.length > 0) {
        startIteration();
        openList.sort((a, b) => f[b[0]][b[1]] - f[a[0]][a[1]]);
        let cur = openList.pop();
        markVisited(cur);

        if (cur[0] === goal[0] && cur[1] === goal[1]) {
            path = [cur]
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

                if (!openList.some(([x, y]) => x === tmp[0] && y === tmp[1])) {
                    markFrontier(tmp);
                    openList.push(tmp);
                }

            }
        }
    }
    return null;
}
