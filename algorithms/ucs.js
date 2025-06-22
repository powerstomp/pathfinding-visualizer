function ucs({ map, start, goal, inform, markFrontier, markVisited, startIteration }) {
    const _return_path = (pt, g) => {
        let cur = g;
        let path = []
        while (cur !== null) {
            path.push(cur);
            cur = pt[cur[0]][cur[1]];
        }
        return path;
    }

    let frontier = new minheap((a, b) => (a[2] - b[2])); // frontier itself, now a minheap
    frontier.push([start[0], start[1], 0]);

    const EX = 0, FT = 1;
    let ex_fr_map = Array.from({ length: map.length }, () => (Array.from({ length: map[0].length }, () => (Array.from({ length: 2 }, () => null))))); // this is for both visited and frontier check

    let path_track = Array.from({ length: map.length }, () => Array.from({ length: map[0].length }, () => null));

    while (frontier.length()) {
        let cur_tile = frontier.pop(); // grab tile with smallest weight for evaluation
        ex_fr_map[cur_tile[0]][cur_tile[1]][FT] = false; // remove from frtr check

        if (ex_fr_map[cur_tile[0]][cur_tile[1]][EX])
            // skip iteration if tile is already visited
            continue;
        if (cur_tile[0] === goal[0] && cur_tile[1] === goal[1]) {
            return _return_path(path_track, goal);
        }

        startIteration();
        inform(`g(n) = ${cur_tile[2]}`);
        ex_fr_map[cur_tile[0]][cur_tile[1]][EX] = true; // mark tile as visited
        markVisited(cur_tile);

        for (let potentials of getAdjacent(map, cur_tile)) {
            potentials.push(map[potentials[0]][potentials[1]] + cur_tile[2]);
            if (ex_fr_map[potentials[0]][potentials[1]][EX]) // if explored
                continue;
            if (ex_fr_map[potentials[0]][potentials[1]][FT] === true) // if in frontier
                continue;
            frontier.push(potentials);
            ex_fr_map[potentials[0]][potentials[1]][FT] = true; // add to frtr check
            path_track[potentials[0]][potentials[1]] = cur_tile;
            markFrontier(potentials);
        }
    }

    return null;
}
