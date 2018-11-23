export default class Card {
  constructor(number) {
    if (typeof number !== 'undefined') {
      this.number = number;
    } else {
      this.number = Math.floor(Math.random() * 10) - 4;
    }
  }

  getJson() {
    return {
      number: this.number,
    }
  }
};