import './css/index.css';
import IMask from 'imask';

const ccBgColor01 = document.querySelector(
  '.cc-bg svg > g g:nth-child(1) path'
);
const ccBgColor02 = document.querySelector(
  '.cc-bg svg > g g:nth-child(2) path'
);
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

const colors = {
  visa: ['#436D99', '#2D57F2'],
  mastercard: ['#DF6F29', '#C69347'],
  default: ['#000', '#808080'],
};

function setCardType(type) {
  ccBgColor01.setAttribute('fill', colors[type][0]);
  ccBgColor02.setAttribute('fill', colors[type][1]);
  ccLogo.setAttribute('src', `cc-${type}.svg`);
}

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = code.length > 0 ? code : '123';
}

function updateCardNumber(number) {
  const ccNumber = document.querySelector('.cc-number');
  ccNumber.innerText = number.length > 0 ? number : '1234 5678 9012 3456';
}

function updateExpirationDate(date) {
  const ccSecurity = document.querySelector('.cc-extra .value');
  ccSecurity.innerText = date.length > 0 ? date : '02/32';
}

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
  mask: '0000',
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);
securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value);
});

const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: 'DD/YY',
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    DD: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);
expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value);
});

const cardNumber = document.querySelector('#card-number');
const cardNumberPattern = {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardType: 'visa',
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d|2[3-7]\d{0,2})\d{0,12}/,
      cardType: 'mastercard',
    },
    {
      mask: '0000 0000 0000 0000',
      cardType: 'default',
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const numbers = (dynamicMasked.value + appended).replace(/\D/g);

    const foundMask = dynamicMasked.compiledMasks.find((m) =>
      numbers.match(m.regex)
    );
    return foundMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);
cardNumberMasked.on('accept', () => {
  setCardType(cardNumberMasked.masked.currentMask.cardType);
  updateCardNumber(cardNumberMasked.value);
});

const addCardButton = document.querySelector('#add-card');
addCardButton.addEventListener('click', (event) => {
  alert('Cartão adicionado!');
});

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
});

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerText =
    cardHolder.value.length > 0 ? cardHolder.value : 'FULANO DA SILVA';
});

globalThis.setCardType = setCardType;
