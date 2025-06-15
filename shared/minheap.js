const LEFT = 1;
const RIGHT = 2;

// a < b => -1, a == b => 0, a > b => 1

class minheap {
    constructor(comp_funk) {
        this.arr = [];
        this.compare = comp_funk;
    }

    _get_parent_idx(index) {
        return (index % 2 === 0) ? (index - 2) / 2 : (index - 1) / 2;
    }

    _get_child_idx(index, side) {
        return index * 2 + side;
    }

    __bubble_up() {
        // takes no additional arguments, this is called within push, which pushes things into the back.
        let cur_index = this.length() - 1;
        while (cur_index > 0) {
            let parent_idx = this._get_parent_idx(cur_index);

            if (parent_idx < 0)
                break;

            if (this.compare(this.arr[cur_index], this.arr[parent_idx]) < 0) {
                [this.arr[cur_index], this.arr[parent_idx]] = [this.arr[parent_idx], this.arr[cur_index]];
                cur_index = parent_idx;
            } else
                break;
        }
    }

    push(item) {
        this.arr.push(item);

        this.__bubble_up();
    }

    __bubble_down() {
        let cur_index = 0;
        while (cur_index < this.length()) {
            let left_child = this._get_child_idx(cur_index, LEFT);
            let right_child = this._get_child_idx(cur_index, RIGHT);

            let smallest = cur_index;

            if (left_child < this.length() && this.compare(this.arr[left_child], this.arr[smallest]) < 0)
                smallest = left_child;

            if (right_child < this.length() && this.compare(this.arr[right_child], this.arr[smallest]) < 0)
                smallest = right_child;

            if (this.compare(this.arr[cur_index], this.arr[smallest]) > 0) {
                [this.arr[cur_index], this.arr[smallest]] = [this.arr[smallest], this.arr[cur_index]];
                cur_index = smallest;
            }
            else
                break;
        }
    }

    pop() {
        if (this.length() == 0)
            return null;
        let ret = this.arr[0];
        [this.arr[0], this.arr[this.length() - 1]] = [this.arr[this.length() - 1], this.arr[0]]; // swap bottom of heap up
        this.arr.pop();

        this.__bubble_down();
        return ret;
    }

    length() {
        return this.arr.length;
    }
}

function main() {
    frontier = new minheap((a, b) => (a - b));
    frontier.push(10);
    frontier.push(5);
    frontier.push(8);
    frontier.push(4);

    alert(frontier.pop());
    alert(frontier.pop());
    alert(frontier.pop());
    alert(frontier.pop());
}
