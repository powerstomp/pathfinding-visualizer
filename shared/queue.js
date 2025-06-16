function node(t) {
    return {
        data: t,
        next: null,
    };
}

class queue {
    constructor() {
        this.head_ref = null;
        this.tail_ref = null;
    }
    push(data) {
        if (this.head_ref === null && this.tail_ref === null) {
            this.head_ref = new node(data);
            this.tail_ref = this.head_ref;
        } else {
            this.tail_ref.next = new node(data);
            this.tail_ref = this.tail_ref.next;
        }
    }

    pop() {
        if (this.head_ref === null && this.tail_ref === null) return null;
        else {
            let ret = this.head_ref.data;
            if (this.head_ref === this.tail_ref) {
                this.head_ref = null;
                this.tail_ref = null;
            }
            else {
                this.head_ref = this.head_ref.next;
            }
            return ret;
        }
    }

    isEmpty() {
        return (this.head_ref === null && this.tail_ref === null);
    }

    exists(ext_data, comp_funk) {
        let cur = this.head_ref;
        while (cur !== null) {
            if (comp_funk(cur.data, ext_data))
                return true;
            cur = cur.next;
        }
        return false;
    }
}