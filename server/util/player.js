class Player {
  constructor(id) {
    this.id = id;
    this.gold = 0;
    this.hand = [];
  }

  drewCards(cards) {
    for (var i = 0; i < cards.length; i++) {
      this.hand.push(cards[i]);
    }
  }

  removeCard(i) {
    return this.hand.splice(i, 1)[0];
  }

  incrGold(n) {
    this.gold += n;
  }

  getJson() {
    return {
      id: this.id,
      gold: this.gold,
      hand: this.hand.map(x => x.getJson()),
    };
  }

  getJsonForPlayer(pid) {
    return {
      id: this.id,
      gold: this.gold,
      hand: this.hand.map(x => x.getJson()),
    };
  }
};

module.exports = Player;