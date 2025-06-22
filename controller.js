const visitedColor = "#cbc7d8";    // Muted Lavender-Blue (slightly desaturated for background elements)
const frontierColor = "#f2dde1";   // Vibrant Raspberry (stands out as active frontier)
const pathColor = "#e094a0";      // Bright Spring Green (for the explored path segments)

function controller(state) {
	return {
		selected: null,
		frames: [[]],
		currentFrame: 0,
		runtimeMillis: 0,
		pathCost: null,
		beamWidth: 3,
		extraData: "",
		init() {
			this.frames = [[]];
			this.path = [];
			this.currentFrame = 0;
			this.runtimeMillis = 0;
			this.pathCost = null;
			this.extraData = "";
			this.runFrame(this.currentFrame);
		},
		runAlgorithm() {
			let algorithm = algorithms.find(({ id }) => id === this.selected);
			let frames = [[]];
			let start, goal;
			if (algorithm.run && (start = findMap(state.map, 'S')) && (goal = findMap(state.map, 'G'))) {
				try {
					state.map[start[0]][start[1]] = 0;
					state.map[goal[0]][goal[1]] = 1;
					let startTime = performance.now();
					let path = algorithm.run({
						map: state.map, start, goal,
						startIteration: () => frames.push([]),
						inform: (str) => frames.at(-1).push(str),
						markFrontier: ([i, j]) =>
							frames.at(-1).push([i, j, frontierColor]),
						markVisited: ([i, j]) =>
							frames.at(-1).push([i, j, visitedColor]),
						beamWidth: this.beamWidth,
					});
					let endTime = performance.now();

					this.runtimeMillis = endTime - startTime;

					if (path) {
						this.pathCost = 0;
						let frame = [];
						for (const [x, y] of path) {
							frame.push([x, y, pathColor]);
							// console.log(x, y);
							this.pathCost += state.map[x][y];
						}
						frames.push(frame);
					} else
						this.pathCost = null;
				} catch (e) {
					console.log(e);
				} finally {
					state.map[start[0]][start[1]] = 'S';
					state.map[goal[0]][goal[1]] = 'G';
				}
			}
			this.extraData = "";
			this.frames = frames;
			this.currentFrame = 0;
			this.runFrame();
		},
		runFrame(_id) {
			state.drawGrid();

			for (let id = 0; id <= _id; id++) {
				this.extraData = "";
				for (obj of this.frames[id]) {
					if (typeof obj === "string")
						this.extraData += obj + '\n';
					else
						state.drawCell(...obj);
				}
			}
		},
		runNextFrame() {
			if (++this.currentFrame >= this.frames.length)
				this.currentFrame = this.frames.length - 1;
			this.extraData = "";
			for (obj of this.frames[this.currentFrame]) {
				if (typeof obj === "string")
					this.extraData += obj + '\n';
				else
					state.drawCell(...obj);
			}
			// this.runFrame(this.currentFrame);
		},
		runPreviousFrame() {
			if (--this.currentFrame < 0)
				this.currentFrame = 0;
			this.runFrame(this.currentFrame);
		},
		onViewChange() {
			state.onViewChange();
			this.runFrame(this.currentFrame);
		},
		onMapSizeChange() {
			state.onMapSizeChange();
			this.init();
		},
	}
}
