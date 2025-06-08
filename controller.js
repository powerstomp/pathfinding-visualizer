const visitedColor = "oklch(70.7% 0.022 261.325)";
const frontierColor = "oklch(74% 0.238 322.16)";

function controller(state) {
	return {
		selected: null,
		frames: [[]],
		currentFrame: 0,
		init() {
			this.frames = [[]];
			this.currentFrame = 0;
			this.runFrame(this.currentFrame);
		},
		runAlgorithm() {
			let algorithm = algorithms.find(({ id }) => id === this.selected);
			let frames = [[]];
			if (algorithm && findMap(state.map, 'S'))
				algorithm.run({
					map: state.map, start: findMap(state.map, 'S'),
					startIteration: () => frames.push([]),
					markFrontier: ([i, j]) =>
						frames.at(-1).push([i, j, frontierColor]),
					markVisited: ([i, j]) =>
						frames.at(-1).push([i, j, visitedColor]),
				});
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
			this.runFrame(this.currentFrame);
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
