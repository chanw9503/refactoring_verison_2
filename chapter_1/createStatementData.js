import plays from './plays.js';

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performances = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    let result = 0;

    switch (this.play.type) {
      case 'tragedy': //비극
        result = 40000;
        if (this.performances.audience > 30) {
          result += 1000 * (this.performances.audience - 30);
        }
        break;

      case 'comedy': //희극
        result = 30000;
        if (this.performances.audience > 20) {
          result += 10000 + 500 * (this.performances.audience - 20);
        }
        result += 300 * this.performances.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르 : ${this.performances.play.type}`);
    }

    return result;
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performances.audience - 30, 0);
    if ('comedy' === this.play.type) result += Math.floor(this.performances.audience / 5);
    return result;
  }
}

export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredit = totalVolumeCredit(result);

  return result;

  function enrichPerformance(aPerformance) {
    const caclulator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = caclulator.play;
    result.amount = caclulator.amount;
    result.volumeCredits = caclulator.volumeCredits;
    return result;
  }
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}
function amountFor(aPerformance) {
  return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
}

function volumeCreditsFor(aPerformance) {}

function totalVolumeCredit(data) {
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

function totalAmount(data) {
  return data.performances.reduce((total, p) => total + p.amount, 0);
}
