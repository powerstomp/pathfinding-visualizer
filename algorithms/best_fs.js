function HRT_MNHTTN(cur, goal) {
    const R = 0, C = 1, HRT = 2;
    return Math.abs(cur[R] - goal[R]) + Math.abs(cur[C] - goal[C]);
}

function bestFS({ map, start, goal, markFrontier, markVisited, startIteration }) {
    const _return_path = (pt, g) => {
        let cur = g;
        let path = []
        while (cur !== null) {
            path.push(cur);
            cur = pt[cur[0]][cur[1]];
        }
        return path;
    }

    const R = 0, C = 1, HRT = 2;
    let frontier = new minheap((a, b) => (a[HRT] - b[HRT]))
    frontier.push([start[R], start[C], HRT_MNHTTN(start, goal)]);

    const EXP = 0, FRT = 1;
    let ex_fr_map = Array.from({ length: map.length }, () => Array.from({ length: map[0].length }, () => Array.from({ length: 2 }, () => null)));
    let path_track = Array.from({ length: map.length }, () => Array.from({ length: map[0].length }, () => null));


    while (frontier.length() !== 0) {
        let cur = frontier.pop();
        ex_fr_map[cur[R]][cur[C]][FRT] = false;

        if (ex_fr_map[cur[R]][cur[C]][EXP] === true) // if explored
            continue;

        if (cur[R] === goal[R] && cur[C] === goal[C]) { // if goal
            return _return_path(path_track, goal);
        }

        startIteration();
        ex_fr_map[cur[R]][cur[C]][EXP] = true;
        markVisited(cur);

        for (let next of getAdjacent(map, cur)) {
            next.push(HRT_MNHTTN(next, goal));
            if (ex_fr_map[next[R]][next[C]][FRT] || ex_fr_map[next[R]][next[C]][EXP]) // if in frontier or explored
                continue;
            frontier.push(next);
            ex_fr_map[next[R]][next[C]][FRT] = true;
            path_track[next[R]][next[C]] = cur;
            markFrontier(next);
        }
    }
    return null;
}