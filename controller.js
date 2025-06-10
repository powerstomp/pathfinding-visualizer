const visitedColor = "#cbc7d8";    // Muted Lavender-Blue (slightly desaturated for background elements)
const frontierColor = "#f2dde1";   // Vibrant Raspberry (stands out as active frontier)
const pathColor = "#e094a0";      // Bright Spring Green (for the explored path segments)

function controller(state) {
	return {
		selected: null,
		frames: [[]],
		currentFrame: 0,
		runtimeMillis: 0,
		init() {
			this.frames = [[]];
			this.currentFrame = 0;
			this.runtimeMillis = 0;
			this.runFrame(this.currentFrame);
		},
		runAlgorithm() {
			let algorithm = algorithms.find(({ id }) => id === this.selected);
			let frames = [[]];
			if (algorithm && (start = findMap(state.map, 'S')) && (end = findMap(state.map, 'G'))) {
				let startTime = performance.now();
				algorithm.run({
					map: state.map, start, end,
					startIteration: () => frames.push([]),
					markFrontier: ([i, j]) =>
						frames.at(-1).push([i, j, frontierColor]),
					markVisited: ([i, j]) =>
						frames.at(-1).push([i, j, visitedColor]),
				});
				let endTime = performance.now();

				this.runtimeMillis = endTime - startTime;
			}
			this.frames = frames;
			this.currentFrame = 0;
			this.runFrame();
		},
		runFrame(_id) {
			state.drawGrid();
			for (let id = 0; id <= _id; id++)
				for (obj of this.frames[id])
					state.drawCell(...obj);
		},
		runNextFrame() {
			if (++this.currentFrame >= this.frames.length)
				this.currentFrame = this.frames.length - 1;
			for (obj of this.frames[this.currentFrame])
				state.drawCell(...obj);
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
