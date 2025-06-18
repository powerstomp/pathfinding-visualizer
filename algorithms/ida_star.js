function search({ map, g, threshold, path, node, goal, markFrontier, markVisited, visited }) {
    let f = g + heuristic(node, goal);
    if (f > threshold) {
        if (!visited[node[0]][node[1]])
            markFrontier(node);
        return f;
    } else if (!visited[node[0]][node[1]]) {
        markVisited(node);
        visited[node[0]][node[1]] = true;
    }

    if (node[0] === goal[0] && node[1] === goal[1])
        return true;

    let min = Infinity;
    for (let neighbor of getAdjacent(map, node)) {
        if (path.some(p => p[0] === neighbor[0] && p[1] === neighbor[1]))
            continue;
        path.push(neighbor);
        let tmp = search({ map, g: g + map[neighbor[0]][neighbor[1]], threshold, path, node: neighbor, goal, markFrontier, markVisited, visited });
        if (tmp === true)
            return true;
        if (tmp < min)
            min = tmp;
        path.pop();
    }
    return min;
}

function ida_star({ map, start, goal, markFrontier, markVisited, startIteration }) {
    let visited = Array.from(Array(map.length), () => new Array(map[0].length));
    let path = [start];
    let threshold = heuristic(start, goal);
    while (true) {
        startIteration();
        let tmp = search({ map, g: 0, threshold, path, node: start, goal, markFrontier, markVisited, visited });
        if (tmp === true)
            return path;
        if (tmp === Infinity)
            return null;
        threshold = tmp;
    }
}
