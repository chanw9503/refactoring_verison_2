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
  return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, invoice, plays) {
  let result = `청구 내역 (고객명 : ${data.customer})\n`;

  for (let perf of invoice.performances) {
    //청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(appleSauce())}\n`;
  result += `적립 포인트: ${totalVolumeCredit()}점\n`;

  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0;

  switch (playFor(aPerformance).type) {
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
      throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
  }

  return result;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ('comedy' === playFor(aPerformance).type)
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

function totalVolumeCredit() {
  let result = 0;
  for (let perf of invoices.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function appleSauce() {
  let result = 0;

  for (let perf of invoices.performances) {
    result += amountFor(perf);
  }

  return result;
}

const result = statement(invoices, plays);

console.log(result);
