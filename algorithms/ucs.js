let r_mod = [-1, 0, 1, 0];
let c_mod = [0, 1, 0, -1];

const TILE_COST = 2;
const TILE_ROW = 0;
const TILE_COL = 1;

function __cost_map_generator(map) {
    let a = Array.from({ length: map.length }, (_, i) =>
        Array.from({ length: map[0].length }, (_, j) => {
            let tile = new Array(3);
            tile[TILE_ROW] = i;
            tile[TILE_COL] = j;
            tile[TILE_COST] = 0;
            return tile;
        })
    );
    return a;
}

function __frontier_resident_chk_n_update(frtr, tile) {
    for (let tl of frtr) {
        if (tl[TILE_COL] === tile[TILE_COL] && tl[TILE_ROW] === tile[TILE_ROW]) {
            if (tile[TILE_COST] < tl[TILE_COST]) {
                tl[TILE_COST] = tile[TILE_COST];
            }
            return true;
        }
    }
    return false;
}

function ucs({ map, start, markFrontier, markVisited, startIteration }) { // for now this is a breadthfs, since theres no cost consideration yet.

    let _start_wcost = Array.from(start);
    _start_wcost.push(0);
    let frontier = [_start_wcost];
    let explored = Array.from(Array(map.length), () => new Array(map[0].length));
    while (1) {
        frontier.sort((a, b) => (a[TILE_COST] - b[TILE_COST])); // this will for now sort alphabetically. not goop. it has to sort by cost

        if (frontier.length === 0) // that should be a failure
            return;

        let cur_tile = frontier.shift();

        if (explored[cur_tile[0]][cur_tile[1]]) // this how we check explored
            continue;

        startIteration(); // this likely is a function to mark where the current iteration is going
        explored[cur_tile[0]][cur_tile[1]] = true;
        markVisited(cur_tile);

        for (let i = 0; i < 4; i++) {
            let potential_visit = [cur_tile[0] + r_mod[i], cur_tile[1] + c_mod[i], cur_tile[TILE_COST] + 1];

            if (potential_visit[0] >= map.length || potential_visit[0] < 0
                || potential_visit[1] >= map[0].length || potential_visit[1] < 0)
                continue; // out of bounds

            if (explored[potential_visit[0]][potential_visit[1]] || map[potential_visit[0]][potential_visit[1]] === true || __frontier_resident_chk_n_update(frontier, potential_visit))
                continue; // already did, or its in the frontier

            if (map[potential_visit[0]][potential_visit[1]] === 'G')
                return;

            frontier.push(potential_visit);
            markFrontier(potential_visit);
        }
    }
}