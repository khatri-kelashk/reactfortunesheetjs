// store/imageHistory.js
export class History {
  constructor(initial) {
    this.past = [];
    this.present = initial;
    this.future = [];
  }

  set(state) {
    this.past.push(this.present);
    this.present = state;
    this.future = [];
  }

  undo() {
    if (!this.past.length) return this.present;
    this.future.unshift(this.present);
    this.present = this.past.pop();
    return this.present;
  }

  redo() {
    if (!this.future.length) return this.present;
    this.past.push(this.present);
    this.present = this.future.shift();
    return this.present;
  }

  get() {
    return this.present;
  }
}
