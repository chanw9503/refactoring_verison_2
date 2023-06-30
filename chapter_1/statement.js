/**
 *
 * volumeCredits 리팩토링 순서
 * 1. 반복문 쪼개기로 변수 값을 누적시키는 부분을 분리
 * 2. 문장 슬라이드 하기로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮긴다.
 * 3. 함수 추출하기로 적립 포인트 계산 부분을 별도 함수로 추출한다.
 * 4. 변수 인라인하기로 volumeCredits 변수를 제거한다. ㅕㅛㅛㅛㅛㅛㅛ
 *
 */

import createStatementData from './createStatementData.js';
import invoices from './invoices.js';
import plays from './plays.js';

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}
function renderPlainText(data) {
  let result = `청구 내역 (고객명 : ${data.customer})\n`;

  for (let perf of data.performances) {
    //청구 내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredit}점\n`;
  return result;
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명 : ${data.customer}<h1/>\n`;
  result += '<table>\n';
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>';

  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
    result += `<td>${perf.amount}</td></tr>\n`;
  }

  result += '</table>\n';
  result += `<p>총액 : <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트 <em>${data.totalVolumeCredit}</em>점</p>\n`;

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
