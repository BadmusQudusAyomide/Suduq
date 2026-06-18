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
