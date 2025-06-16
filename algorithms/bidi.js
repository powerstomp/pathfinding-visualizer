function __subcompact_bidi_BFS({ map, path_tracker, search_towards, frtr, vs_fr, vs_fr_other, markFrontier, markVisited, startIteration }) {
    const VS = 0;
    const FR = 1;

    if (frtr.isEmpty())
        return null; // this signifies one of the 2 or even both sides no longer has anywhere else to go to, thus no route

    let cur = frtr.pop_front();
    vs_fr[cur[0]][cur[1]][FR] = false;

    if (vs_fr[cur[0]][cur[1]][VS]) // if visited
        return false;



    startIteration();
    vs_fr[cur[0]][cur[1]][VS] = true;
    markVisited(cur);



    for (let next of getAdjacent(map, cur)) {
        if (vs_fr[next[0]][next[1]][VS] || vs_fr[next[0]][next[1]][FR]) // if in frontier or visited
            continue;

        if (vs_fr_other[next[0]][next[1]][VS]) // if visited by opposite side
            return [next, cur];
        if ((next[0] === search_towards[0] && next[1] === search_towards[1])) // if on goal or start
            return [next, cur];

        frtr.push_back(next);
        path_tracker[next[0]][next[1]] = cur; // mark the next tile as coming from cur.
        vs_fr[next[0]][next[1]][FR] = true;
        markFrontier(next);
    }
    return false;
}

function bidi_BFS({ map, start, goal, markFrontier, markVisited, startIteration }) {
    let frontierStart = new linked_list();
    let frontierGoal = new linked_list();

    frontierStart.push_back(start);
    frontierGoal.push_front(goal);

    let path_track_start = Array.from({ length: map.length }, () => (Array.from({ length: map[0].length }, () => null)));
    let path_track_goal = Array.from({ length: map.length }, () => (Array.from({ length: map[0].length }, () => null)));

    let combine_ex_fr_Start = Array.from({ length: map.length }, () => (
        Array.from({ length: map[0].length }, () => (
            Array.from({ length: 2 }, () => null)
        ))
    ));
    let combine_ex_fr_Goal = Array.from({ length: map.length }, () => (
        Array.from({ length: map[0].length }, () => (
            Array.from({ length: 2 }, () => null)
        ))
    ));
    let turn = true; // start's search party turn
    let ret_Start = undefined;
    let ret_Goal = undefined;

    while (ret_Start !== null && ret_Goal !== null && !Array.isArray(ret_Start) && !Array.isArray(ret_Goal)) {
        if (turn) {
            ret_Start = __subcompact_bidi_BFS({ map: map, path_tracker: path_track_start, search_towards: goal, frtr: frontierStart, vs_fr: combine_ex_fr_Start, vs_fr_other: combine_ex_fr_Goal, markFrontier, markVisited, startIteration });
        }
        else {
            ret_Goal = __subcompact_bidi_BFS({ map: map, path_tracker: path_track_goal, search_towards: start, frtr: frontierGoal, vs_fr: combine_ex_fr_Goal, vs_fr_other: combine_ex_fr_Start, markFrontier, markVisited, startIteration });
        }
        turn = !turn;
    }

    if (ret_Goal === null || ret_Start === null)
        return null;
    else return __return_path(ret_Start, ret_Goal, path_track_start, path_track_goal);

}

function __return_path(rS, rG, pts, ptg) {
    const NEXT = 0, CUR = 1;
    let path = [];
    if (Array.isArray(rS)) // this means the Start search side got here first. next should face the goal, cur faces start
    {
        let cur = rS[CUR];
        while (cur !== null) {
            path.push(cur);
            cur = pts[cur[0]][cur[1]];
        }
        cur = rS[NEXT]

        while (cur !== null) {
            path.push(cur);
            cur = ptg[cur[0]][cur[1]];
        }
    }
    else // the opposite. next is the start and cur faces goal  
    {
        let cur = rG[CUR];
        while (cur !== null) {
            path.push(cur);
            cur = ptg[cur[0]][cur[1]];
        }
        cur = rG[NEXT]

        while (cur !== null) {
            path.push(cur);
            cur = pts[cur[0]][cur[1]];
        }
    }
    return path;
}