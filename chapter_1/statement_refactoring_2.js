/**
 *
 * volumeCredits 리팩토링 순서
 * 1. 반복문 쪼개기로 변수 값을 누적시키는 부분을 분리
 * 2. 문장 슬라이드 하기로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮긴다.
 * 3. 함수 추출하기로 적립 포인트 계산 부분을 별도 함수로 추출한다.
 * 4. 변수 인라인하기로 volumeCredits 변수를 제거한다. ㅕㅛㅛㅛㅛㅛㅛ
 *
 */

const invoices = require('./invoices.json');
const plays = require('./plays.json');

function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredit = totalVolumeCredit(statementData);

  return renderPlainText(statementData, invoice, plays);

  function totalVolumeCredit(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumeCredits;
    }
    return result;
  }

  function totalAmount(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }

    return result;
  }
}
function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance);
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);
  return result;
}

function renderPlainText(data, plays) {
  let result = `청구 내역 (고객명 : ${data.customer})\n`;

  for (let perf of data.performances) {
    //청구 내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredit}점\n`;
  return result;

  function appleSauce() {
    let result = 0;

    for (let perf of data.performances) {
      result += amountFor(perf);
    }

    return result;
  }
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0;

  switch (aPerformance.play.type) {
    case 'tragedy': //비극
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;

    case 'comedy': //희극
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르 : ${aPerformance.play.type}`);
  }

  return result;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ('comedy' === aPerformance.play.type)
    result += Math.floor(aPerformance.audience / 5);
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

const result = statement(invoices, plays);

console.log(result);
