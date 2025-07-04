function recursive_best_first_search({ map, start, goal, inform, markFrontier, markVisited, startIteration }) {
    let path = [start];
    let visited = Array.from(Array(map.length), () => new Array(map[0].length).fill(false));
    let [result, _] = rbfs({ map, node: start, goal, g: 0, f_limit: Infinity, path, inform, markFrontier, markVisited, startIteration, visited });
    return result ? path : null;
}

function rbfs({ map, node, goal, g, f_limit, path, inform, markFrontier, markVisited, startIteration, visited }) {
    startIteration();
    let f_node = g + heuristic(node, goal);
    inform(`node: (${node[0]}, ${node[1]})`);
    inform(`f(n) = ${f_node}`);
    inform(`f_limit: ${f_limit}`);
    inform(`recursion depth: ${path.length}`);

    if (f_node > f_limit) return [false, f_node];
    if (node[0] === goal[0] && node[1] === goal[1])
        return [true, f_node];

    let successors = getAdjacent(map, node)
        .filter(n => !path.some(p => p[0] === n[0] && p[1] === n[1]))
        .map(n => ({
            node: n,
            g: g + map[n[0]][n[1]],
            f: Math.max(f_node, g + map[n[0]][n[1]] + heuristic(n, goal))
        }));

    for (let i = 0; i < successors.length; i++)
        if (!visited[successors[i].node[0]][successors[i].node[1]])
            markFrontier(successors[i].node);

    if (successors.length === 0) return [false, Infinity];

    while (true) {
        successors.sort((a, b) => a.f - b.f);
        let best = successors[0];
        if (best.f > f_limit) return [false, best.f];

        let alt = successors[1]?.f ?? Infinity;

        path.push(best.node);
        let [result, new_f] = rbfs({ map, node: best.node, goal, g: best.g, f_limit: Math.min(alt, f_limit), path, inform, markFrontier, markVisited, startIteration, visited });

        if (result) return [true, new_f];
        path.pop();

        if (!visited[best.node[0]][best.node[1]]) {
            visited[best.node[0]][best.node[1]] = true;
            markVisited(best.node);
        }
        best.f = new_f;
        if (new_f === Infinity) {
            successors.shift();
            if (successors.length === 0) return [false, Infinity];
        }
    }
}
