const UNIT_GROUPS = {
  length: {
    label: 'Length',
    units: {
      m: { label: 'Meters', factor: 1 },
      km: { label: 'Kilometers', factor: 1000 },
      cm: { label: 'Centimeters', factor: 0.01 },
      mm: { label: 'Millimeters', factor: 0.001 },
      mi: { label: 'Miles', factor: 1609.344 },
      ft: { label: 'Feet', factor: 0.3048 },
      in: { label: 'Inches', factor: 0.0254 }
    }
  },
  weight: {
    label: 'Weight',
    units: {
      kg: { label: 'Kilograms', factor: 1 },
      g: { label: 'Grams', factor: 0.001 },
      lb: { label: 'Pounds', factor: 0.45359237 },
      oz: { label: 'Ounces', factor: 0.028349523125 },
      t: { label: 'Metric tons', factor: 1000 }
    }
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { label: 'Celsius' },
      f: { label: 'Fahrenheit' },
      k: { label: 'Kelvin' }
    }
  },
  speed: {
    label: 'Speed',
    units: {
      'm/s': { label: 'Meters per second', factor: 1 },
      'km/h': { label: 'Kilometers per hour', factor: 0.2777777778 },
      mph: { label: 'Miles per hour', factor: 0.44704 },
      knot: { label: 'Knots', factor: 0.5144444444 }
    }
  },
  area: {
    label: 'Area',
    units: {
      'm2': { label: 'Square meters', factor: 1 },
      'km2': { label: 'Square kilometers', factor: 1000000 },
      ha: { label: 'Hectares', factor: 10000 },
      acre: { label: 'Acres', factor: 4046.8564224 },
      ft2: { label: 'Square feet', factor: 0.09290304 }
    }
  },
  volume: {
    label: 'Volume',
    units: {
      l: { label: 'Liters', factor: 1 },
      ml: { label: 'Milliliters', factor: 0.001 },
      gal: { label: 'Gallons', factor: 3.785411784 },
      'ft3': { label: 'Cubic feet', factor: 28.316846592 },
      m3: { label: 'Cubic meters', factor: 1000 }
    }
  }
};

const FILE_SIZE_UNITS = {
  b: { label: 'Bytes', factor: 1 },
  kb: { label: 'KB', factor: 1024 },
  mb: { label: 'MB', factor: 1024 ** 2 },
  gb: { label: 'GB', factor: 1024 ** 3 },
  tb: { label: 'TB', factor: 1024 ** 4 }
};

const ROMAN_MAP = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
];

function round(value, decimals = 6) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function getUnitGroups() {
  return UNIT_GROUPS;
}

export function convertUnitValue(amount, fromUnit, toUnit, category) {
  const normalizedCategory = category || 'length';
  const group = UNIT_GROUPS[normalizedCategory];

  if (!group) {
    throw new Error('Unsupported unit category.');
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    throw new Error('Enter a valid number.');
  }

  if (normalizedCategory === 'temperature') {
    const c = {
      c: (value) => value,
      f: (value) => (value - 32) * (5 / 9),
      k: (value) => value - 273.15
    }[fromUnit];

    const to = {
      c: (value) => value,
      f: (value) => value * (9 / 5) + 32,
      k: (value) => value + 273.15
    }[toUnit];

    if (!c || !to) {
      throw new Error('Unsupported temperature units.');
    }

    return {
      amount: numericAmount,
      from: group.units[fromUnit]?.label || fromUnit,
      to: group.units[toUnit]?.label || toUnit,
      result: round(to(c(numericAmount)), 6),
      category: normalizedCategory
    };
  }

  const fromFactor = group.units[fromUnit]?.factor;
  const toFactor = group.units[toUnit]?.factor;

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error('Unsupported units selected.');
  }

  const result = (numericAmount * fromFactor) / toFactor;

  return {
    amount: numericAmount,
    from: group.units[fromUnit]?.label || fromUnit,
    to: group.units[toUnit]?.label || toUnit,
    result: round(result, 6),
    category: normalizedCategory
  };
}

export function convertFileSizeValue(amount, fromUnit, toUnit) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    throw new Error('Enter a valid number.');
  }

  const fromFactor = FILE_SIZE_UNITS[fromUnit]?.factor;
  const toFactor = FILE_SIZE_UNITS[toUnit]?.factor;

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error('Unsupported file size units.');
  }

  return {
    amount: numericAmount,
    from: FILE_SIZE_UNITS[fromUnit]?.label || fromUnit,
    to: FILE_SIZE_UNITS[toUnit]?.label || toUnit,
    result: round((numericAmount * fromFactor) / toFactor, 8)
  };
}

export function toRoman(value) {
  const numeric = Number(value);

  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 3999) {
    throw new Error('Enter a whole number between 1 and 3999.');
  }

  let result = '';
  let remaining = numeric;

  for (const [arabic, roman] of ROMAN_MAP) {
    while (remaining >= arabic) {
      result += roman;
      remaining -= arabic;
    }
  }

  return result;
}

export function fromRoman(value) {
  const roman = String(value || '').trim().toUpperCase();

  if (!roman) {
    throw new Error('Enter a Roman numeral.');
  }

  let total = 0;
  let previous = 0;

  for (let index = roman.length - 1; index >= 0; index -= 1) {
    const current = ROMAN_MAP.find(([, symbol]) => symbol === roman[index])?.[0];

    if (!current) {
      throw new Error('Enter a valid Roman numeral.');
    }

    if (current < previous) {
      total -= current;
    } else {
      total += current;
      previous = current;
    }
  }

  return total;
}

export function calculateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    throw new Error('Enter a valid date of birth.');
  }

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    days,
    birthday: birthDate.toISOString().slice(0, 10)
  };
}

export function calculateDateDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Enter valid start and end dates.');
  }

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    totalDays,
    totalWeeks: round(totalDays / 7, 2),
    isFuture: diffMs > 0
  };
}

export function convertTimezone(input, fromTimeZone, toTimeZone) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Enter a valid date and time.');
  }

  const format = (value, timeZone) =>
    new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'long',
      timeZone
    }).format(new Date(value));

  return {
    input: date.toISOString(),
    from: format(date, fromTimeZone),
    to: format(date, toTimeZone)
  };
}

export function calculateCountdown(targetDate) {
  const target = new Date(targetDate);

  if (Number.isNaN(target.getTime())) {
    throw new Error('Enter a valid countdown date.');
  }

  const now = Date.now();
  const diff = target.getTime() - now;

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isComplete: diff <= 0
  };
}

export function calculateWorkingDays(startDate, endDate, holidays = '') {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Enter valid dates.');
  }

  const normalizedEnd = end.getTime() < start.getTime() ? start : end;
  const normalizedStart = end.getTime() < start.getTime() ? end : start;
  const holidaySet = new Set(
    String(holidays || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => new Date(item).toDateString())
  );

  let days = 0;
  for (
    let current = new Date(normalizedStart);
    current <= normalizedEnd;
    current.setDate(current.getDate() + 1)
  ) {
    const day = current.getDay();
    const dateKey = current.toDateString();

    if (day !== 0 && day !== 6 && !holidaySet.has(dateKey)) {
      days += 1;
    }
  }

  return {
    workingDays: days,
    startDate: normalizedStart.toISOString().slice(0, 10),
    endDate: normalizedEnd.toISOString().slice(0, 10)
  };
}

export function calculatePercentage(value, percent) {
  const numericValue = Number(value);
  const numericPercent = Number(percent);

  if (!Number.isFinite(numericValue) || !Number.isFinite(numericPercent)) {
    throw new Error('Enter valid numeric values.');
  }

  return {
    percentOfValue: numericValue * (numericPercent / 100),
    valuePlusPercent: numericValue + numericValue * (numericPercent / 100),
    valueMinusPercent: numericValue - numericValue * (numericPercent / 100)
  };
}

export function scientificCalculator(value1, value2, operator) {
  const number1 = Number(value1);
  const number2 = Number(value2);

  if (!Number.isFinite(number1)) {
    throw new Error('Enter a valid first number.');
  }

  switch (operator) {
    case 'add':
      return number1 + number2;
    case 'subtract':
      return number1 - number2;
    case 'multiply':
      return number1 * number2;
    case 'divide':
      if (number2 === 0) {
        throw new Error('Cannot divide by zero.');
      }
      return number1 / number2;
    case 'power':
      return number1 ** number2;
    case 'sqrt':
      if (number1 < 0) {
        throw new Error('Square root is not defined for negative values.');
      }
      return Math.sqrt(number1);
    default:
      throw new Error('Unsupported operator.');
  }
}

export function calculateBMI(weightKg, heightCm) {
  const weight = Number(weightKg);
  const height = Number(heightCm) / 100;

  if (!Number.isFinite(weight) || !Number.isFinite(height) || height <= 0) {
    throw new Error('Enter valid weight and height values.');
  }

  const bmi = weight / (height * height);

  let category = 'Normal';
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Normal';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return {
    bmi: round(bmi, 2),
    category
  };
}

export function calculateTip(bill, tipPercent, people) {
  const billAmount = Number(bill);
  const tip = Number(tipPercent);
  const split = Number(people);

  if (!Number.isFinite(billAmount) || billAmount < 0 || !Number.isFinite(tip) || tip < 0 || !Number.isFinite(split) || split <= 0) {
    throw new Error('Enter valid bill, tip, and people values.');
  }

  const tipAmount = billAmount * (tip / 100);
  const total = billAmount + tipAmount;

  return {
    tipAmount: round(tipAmount, 2),
    total: round(total, 2),
    perPerson: round(total / split, 2)
  };
}

export function calculateLoanEmi(principal, annualRate, years) {
  const principalAmount = Number(principal);
  const rate = Number(annualRate) / 100 / 12;
  const months = Number(years) * 12;

  if (
    !Number.isFinite(principalAmount) ||
    principalAmount <= 0 ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    !Number.isFinite(months) ||
    months <= 0
  ) {
    throw new Error('Enter valid loan details.');
  }

  if (rate === 0) {
    return {
      emi: round(principalAmount / months, 2),
      totalPayment: round(principalAmount, 2),
      totalInterest: 0
    };
  }

  const emi = (principalAmount * rate * (1 + rate) ** months) / ((1 + rate) ** months - 1);
  return {
    emi: round(emi, 2),
    totalPayment: round(emi * months, 2),
    totalInterest: round(emi * months - principalAmount, 2)
  };
}

export function isPrime(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 2) {
    return false;
  }

  for (let divider = 2; divider <= Math.sqrt(number); divider += 1) {
    if (number % divider === 0) {
      return false;
    }
  }

  return true;
}

export function calculateGcdLcm(a, b) {
  const first = Number(a);
  const second = Number(b);

  if (!Number.isInteger(first) || !Number.isInteger(second) || first === 0 || second === 0) {
    throw new Error('Enter non-zero integers.');
  }

  const gcd = (() => {
    let x = Math.abs(first);
    let y = Math.abs(second);
    while (y) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  })();

  const lcm = (Math.abs(first) * Math.abs(second)) / gcd;

  return { gcd, lcm };
}

export function generateRandomNumber(min, max, count = 1) {
  const minValue = Number(min);
  const maxValue = Number(max);
  const countValue = Number(count);

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || minValue > maxValue || !Number.isFinite(countValue) || countValue <= 0) {
    throw new Error('Enter valid range and count values.');
  }

  const numbers = [];
  for (let index = 0; index < countValue; index += 1) {
    const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    numbers.push(value);
  }
  return {
    numbers,
    count: numbers.length
  };
}

export function calculateGeometry(shape, values) {
  const numberValues = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Number(value)])
  );

  switch (shape) {
    case 'circle':
      if (!Number.isFinite(numberValues.radius) || numberValues.radius < 0) {
        throw new Error('Enter a valid radius.');
      }
      return {
        area: round(Math.PI * numberValues.radius ** 2, 4),
        perimeter: round(2 * Math.PI * numberValues.radius, 4)
      };
    case 'rectangle':
      if (!Number.isFinite(numberValues.length) || !Number.isFinite(numberValues.width) || numberValues.length < 0 || numberValues.width < 0) {
        throw new Error('Enter valid length and width.');
      }
      return {
        area: round(numberValues.length * numberValues.width, 4),
        perimeter: round(2 * (numberValues.length + numberValues.width), 4)
      };
    case 'triangle':
      if (!Number.isFinite(numberValues.base) || !Number.isFinite(numberValues.height) || numberValues.base < 0 || numberValues.height < 0) {
        throw new Error('Enter valid base and height.');
      }
      return {
        area: round((numberValues.base * numberValues.height) / 2, 4),
        perimeter: null
      };
    case 'square':
      if (!Number.isFinite(numberValues.side) || numberValues.side < 0) {
        throw new Error('Enter a valid side length.');
      }
      return {
        area: round(numberValues.side ** 2, 4),
        perimeter: round(4 * numberValues.side, 4)
      };
    default:
      throw new Error('Unsupported geometry shape.');
  }
}

export function calculatePythagorean(a, b) {
  const first = Number(a);
  const second = Number(b);

  if (!Number.isFinite(first) || !Number.isFinite(second) || first < 0 || second < 0) {
    throw new Error('Enter valid side lengths.');
  }

  return {
    hypotenuse: round(Math.sqrt(first ** 2 + second ** 2), 4),
    area: round((first * second) / 2, 4)
  };
}

export function calculateVolume(shape, values) {
  const numberValues = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Number(value)])
  );

  switch (shape) {
    case 'cube':
      if (!Number.isFinite(numberValues.side) || numberValues.side < 0) {
        throw new Error('Enter a valid side length.');
      }
      return { volume: round(numberValues.side ** 3, 4) };
    case 'cuboid':
      if (!Number.isFinite(numberValues.length) || !Number.isFinite(numberValues.width) || !Number.isFinite(numberValues.height) || numberValues.length < 0 || numberValues.width < 0 || numberValues.height < 0) {
        throw new Error('Enter valid dimensions.');
      }
      return { volume: round(numberValues.length * numberValues.width * numberValues.height, 4) };
    case 'sphere':
      if (!Number.isFinite(numberValues.radius) || numberValues.radius < 0) {
        throw new Error('Enter a valid radius.');
      }
      return { volume: round((4 / 3) * Math.PI * numberValues.radius ** 3, 4) };
    case 'cylinder':
      if (!Number.isFinite(numberValues.radius) || !Number.isFinite(numberValues.height) || numberValues.radius < 0 || numberValues.height < 0) {
        throw new Error('Enter valid radius and height.');
      }
      return { volume: round(Math.PI * numberValues.radius ** 2 * numberValues.height, 4) };
    default:
      throw new Error('Unsupported volume shape.');
  }
}

export function numberToWords(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric) || !Number.isInteger(numeric) || numeric < 0) {
    throw new Error('Enter a non-negative whole number.');
  }

  const small = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
  ];
  const teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen'
  ];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function toWordsUnderThousand(n) {
    if (n === 0) {
      return '';
    }

    if (n < 10) {
      return small[n];
    }

    if (n < 20) {
      return teens[n - 10];
    }

    if (n < 100) {
      const remainder = n % 10;
      const base = tens[Math.floor(n / 10)];
      return remainder ? `${base} ${small[remainder]}` : base;
    }

    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    const base = `${small[hundred]} hundred`;
    if (!remainder) {
      return base;
    }
    return `${base} ${toWordsUnderThousand(remainder)}`;
  }

  if (numeric === 0) {
    return 'zero';
  }

  const groups = [
    { value: 1_000_000_000, word: 'billion' },
    { value: 1_000_000, word: 'million' },
    { value: 1_000, word: 'thousand' }
  ];

  let result = '';

  for (const group of groups) {
    if (numeric >= group.value) {
      const amount = Math.floor(numeric / group.value);
      const remainder = numeric % group.value;
      const chunk = toWordsUnderThousand(amount);
      result += `${chunk} ${group.word}`;
      if (remainder) {
        result += ` ${toWordsUnderThousand(remainder)}`;
      }
      return result;
    }
  }

  return toWordsUnderThousand(numeric);
}

export async function fetchCurrencyConversion(amount, fromCurrency, toCurrency) {
  const response = await fetch(
    `https://api.exchangerate.host/latest?base=${encodeURIComponent(fromCurrency)}&symbols=${encodeURIComponent(toCurrency)}`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch exchange rates right now.');
  }

  const data = await response.json();
  const rate = data?.rates?.[toCurrency];

  if (!rate) {
    throw new Error('The requested currency pair was not returned by the API.');
  }

  return {
    amount,
    from: fromCurrency,
    to: toCurrency,
    rate,
    result: round(amount * rate, 6)
  };
}
