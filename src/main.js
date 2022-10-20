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

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
  mask: '0000',
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

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
    setCardType(foundMask.cardType);
    return foundMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

globalThis.setCardType = setCardType;
