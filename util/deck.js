const Card = require('./card.js');

class Deck {
  constructor(size) {
    this.cards = [];
    for (var i = 0; i < size; i++) {
      this.cards.push(new Card());
    }
    this.timesShuffled = 0;
    this.discardPile = [];
  }

  shuffleDiscardIntoDeck() {
    if (this.cards.length > 0) {
      console.log("trying to reshuffle discard into non empty deck");
      return;
    }

    if (this.discardPile.length == 0) {
      console.log("no cards in discard to reshuffle");
      return;
    }

    // move cards back into deck
    for (var i = 0; i < this.discardPile.length; i++) {
      this.cards.push(this.discardPile[i]);
      this.discardPile.splice(i, 1);
      i--;
    }

    // shuffle deck
    var j, t;
    for (var i = this.cards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = t;
    }

    // TODO: notify game somehow, emit something?
    this.timesShuffled++;
  }

  getTimesShuffled() {
    return this.timesShuffled;
  }

  getSize() {
    return this.cards.length;
  }

  drawCard() {
    var card = this.cards.shift();
    if (this.cards.length == 0) {
      this.shuffleDiscardIntoDeck();
    }
    return card;
  }

  discard(card) {
    this.discardPile.push(card);
  }

  getJson() {
    return {
      // cards: this.cards.map(x => x.getJson()),
      cards: this.cards.length,
      // discard: this.discardPile.map(x => x.getJson()),
      discard: this.discardPile.length,
      timesShuffled: this.timesShuffled,
    };
  }
};

module.exports = Deck;