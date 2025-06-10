// this would for now be bidi-BFS
// import { queue } from "../shared/queue.js"

// const r_mod = [-1, 0, 1, 0];
// const c_mod = [0, 1, 0, -1];

// const TILE_ROW = 0;
// const TILE_COL = 1;

function compare_tile(a, b) {
    return (a[TILE_ROW] === b[TILE_ROW] && a[TILE_COL] === b[TILE_COL]);
}

function __subcompact_bidi_BFS({ map, frtr, other_frtr, vstd, other_vstd, markFrontier, markVisited, startIteration }) {
    if (frtr.isEmpty())
        return null;
    let curtile = frtr.pop(); // pop from the frontier

    if (vstd[curtile[TILE_ROW]][curtile[TILE_COL]] === true)
        return false; // stop if its already visited

    startIteration();

    vstd[curtile[TILE_ROW]][curtile[TILE_COL]] = true; // now mark it visited

    markVisited(curtile);

    for (let i = 0; i < 4; i++) {
        let ptt_visit = [curtile[TILE_ROW] + r_mod[i], curtile[TILE_COL] + c_mod[i]];

        if (ptt_visit[TILE_ROW] < 0 || ptt_visit[TILE_ROW] >= map.length ||
            ptt_visit[TILE_COL] < 0 || ptt_visit[TILE_COL] >= map[0].length)
            continue; // this out of bounds

        if (vstd[ptt_visit[0]][ptt_visit[1]] || (map[ptt_visit[0]][ptt_visit[1]] === true) || frtr.exists(ptt_visit, compare_tile))
            continue; // visited, impassible or already in the frontier

        if (other_vstd[ptt_visit[0]][ptt_visit[1]])
            return true; // visited by the other searching side.

        if (map[ptt_visit[TILE_ROW]][ptt_visit[TILE_COL]] === "S" || map[ptt_visit[TILE_ROW]][ptt_visit[TILE_COL]] === "G")
            return true; // if stumpled upon either start or finish

        frtr.push(ptt_visit);
        markFrontier(ptt_visit);
    }

}

function bidi_BFS({ map, start, end, markFrontier, markVisited, startIteration }) {
    let frontierStart = new queue();
    let frontierGoal = new queue();
    frontierStart.push(start);
    frontierGoal.push(end);

    let visitedStart = Array.from({ length: map.length }, () => new Array(map[0].length));
    let visitedGoal = Array.from({ length: map.length }, () => new Array(map[0].length));

    while (1) {
        let fromStart = __subcompact_bidi_BFS({
            map: map,
            frtr: frontierStart,
            other_frtr: frontierGoal,
            vstd: visitedStart,
            other_vstd: visitedGoal,
            markFrontier,
            markVisited,
            startIteration
        });
        let fromGoal = __subcompact_bidi_BFS({
            map: map,
            frtr: frontierGoal,
            other_frtr: frontierStart,
            vstd: visitedGoal,
            other_vstd: visitedStart,
            markFrontier,
            markVisited,
            startIteration
        });
        if (fromGoal === null || fromStart === null)
            break;
        if (fromGoal === true || fromStart === true)
            break;
    }
}