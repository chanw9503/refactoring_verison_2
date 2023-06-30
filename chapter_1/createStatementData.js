import plays from './plays.js';

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`);
  }
}
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performances = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error('서브클래스에서 처리하도록 설계되었습니다.');
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performances.audience - 30, 0);
    if ('comedy' === this.play.type) result += Math.floor(this.performances.audience / 5);
    return result;
  }
}
class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performances.audience > 30) {
      result += 1000 * (this.performances.audience - 30);
    }
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    result = 30000;
    if (this.performances.audience > 20) {
      result += 10000 + 500 * (this.performances.audience - 20);
    }
    result += 300 * this.performances.audience;
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
    const caclulator = new createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
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
