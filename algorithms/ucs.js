function new_ucs({ map, start, goal, markFrontier, markVisited, startIteration }) {
    let explored = Array.from(Array(map.length), () => new Array(map[0].length));
    let frontier = [[start[0], start[1], 0]]; // this will be replaced with something faster later.
    let path = [];
    let path_track = __path_map_gen(map);
    let found = false;

    while (frontier.length) {
        frontier.sort((a, b) => (a[2] - b[2]));
        let cur_tile = frontier.shift(); // grab tile with smallest weight for evaluation

        if (explored[cur_tile[0]][cur_tile[1]])
            // skip iteration if tile is already visited
            continue;
        if (cur_tile[0] === goal[0] && cur_tile[1] === goal[1]) {
            found = true;
            break; // if goal then eject
        }

        startIteration();
        explored[cur_tile[0]][cur_tile[1]] = true; // mark tile as visited
        markVisited(cur_tile);

        for (let potentials of getAdjacent(map, cur_tile)) {
            potentials.push(map[potentials[0]][potentials[1]] + cur_tile[2]);
            if (explored[potentials[0]][potentials[1]])
                continue;
            if (__frontier_resident_chk(frontier, potentials))
                continue;
            frontier.push(potentials);
            path_track[potentials[0]][potentials[1]] = cur_tile;
            markFrontier(potentials);
        }
    }

    if (found) {
        let cur = goal;
        let prev = path_track[cur[0]][cur[1]];
        while (prev !== null) {
            path.push([cur[0], cur[1]]);
            cur = path_track[cur[0]][cur[1]];
            prev = path_track[cur[0]][cur[1]];
        }
        path.push(start);
    }

    return (path.length === 0) ? null : path; // for now this returns null
}

function __path_map_gen(map) {
    return Array.from({ length: map.length }, () =>
        Array.from({ length: map[0].length }, () => null)
    );
}

function __frontier_resident_chk(frtr, tile) {
    for (let tl of frtr) {
        if (tl[0] === tile[0] && tl[1] === tile[1]) {
            if (tl[2] > tile[2])
                tl[2] = tile[2];
            return true;
        }
    }
    return false;
}

// const recursive_guts = (cur) => {


//     if (explored[cur[0]][cur[1]]) {
//         return false;
//     }

//     path.push(cur);

//     if (cur[0] === goal[0] && cur[1] === goal[1])
//         return true;

//     startIteration();
//     explored[cur[0]][cur[1]] = true;
//     markVisited(cur);

//     for (neighbors of getAdjacent(map, cur)) {
//         neighbors.push(map[neighbors[0]][neighbors[1]] + cur[2]);
//         if (explored[neighbors[0]][neighbors[1]]) // if explored
//             continue;
//         if (__frontier_resident_chk(frontier, neighbors)) // if in frontier
//             continue;
//         frontier.push(neighbors);
//         markFrontier(neighbors);
//     }

//     if (frontier.length === 0)
//         return false;
//     else {
//         frontier.sort((a, b) => (a[2] - b[2]));
//         next = frontier.shift();
//         if (recursive_guts(next))
//             return true;
//     }

//     path.pop();
//     return false;
// }

// recursive_guts([start[0], start[1], 0]);