class Field {
  constructor(size) {
    this.slots = [];
    for (var i = 0; i < size; i++) {
      this.slots.push([]);
    }
  }

  // calculate harvestable

  getSize() {
    return this.slots.length;
  }

  addToSlot(i, c) {
    // if plot is empty or same type
    if (this.slots[i].length == 0 || this.slots[i][0].number == c.number) {
      this.slots[i].push(c);
      return true;
    } else {
      return false;
    }
  }

  expand() {
    this.slots.push([]);
  }

  harvest(i) {
    if (i > this.slots.length - 1) {
      return [];
    }
    var harvested = this.slots[i];
    this.slots[i] = [];
    return harvested;
  }

  canPlant(c) {
    if (0 in this.slots.map((x) => x.length)) {
      return true;
    }
    for (var i = 0; i < this.slots.length; i++) {
      if (c.number == this.slots[i][0].number) {
        return true;
      }
    }
    return false;
  }
};

module.exports = Field;