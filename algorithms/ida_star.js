function search({ map, g, threshold, path, node, goal, markFrontier, markVisited }) {
    let f = g + heuristic(node, goal);
    markFrontier(node);
    if (f > threshold)
        return f;


    if (node[0] === goal[0] && node[1] === goal[1])
        return true;

    let min = Infinity;
    for (let neighbor of getAdjacent(map, node)) {
        if (path.some(p => p[0] === neighbor[0] && p[1] === neighbor[1]))
            continue;
        path.push(neighbor);
        markFrontier(neighbor);
        let tmp = search({ map, g: g + map[neighbor[0]][neighbor[1]], threshold, path, node: neighbor, goal, markFrontier, markVisited });
        if (tmp === true)
            return true;
        if (tmp < min)
            min = tmp;
        path.pop();
    }
    markVisited(node);
    return min;
}

function ida_star({ map, start, goal, markFrontier, markVisited, startIteration }) {
    let path = [start];
    let threshold = heuristic(start, goal);
    while (true) {
        startIteration();
        let tmp = search({ map, g: 0, threshold, path, node: start, goal, markFrontier, markVisited });
        if (tmp === true)
            return path;
        if (tmp === Infinity)
            return null;
        threshold = tmp;
    }
}