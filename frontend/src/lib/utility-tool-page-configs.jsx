import { Badge } from '../components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { convertIntegerBases, formatColorSummary, parseColorInput } from './dev-utils';
import {
  analyzeWordFrequency,
  calculateAge,
  calculateBMI,
  calculateCountdown,
  calculateDateDifference,
  calculateGeometry,
  calculateGcdLcm,
  calculateLoanEmi,
  calculatePercentage,
  calculatePythagorean,
  calculateTip,
  calculateVolume,
  calculateWorkingDays,
  checkPasswordStrength,
  checkSslCertificate,
  convertFileSizeValue,
  convertTimezone,
  convertUnitValue,
  csvToJson,
  estimateReadingTime,
  fetchCurrencyConversion,
  fromRoman,
  generateBarcode,
  generateBcryptHash,
  generateFakeData,
  generateFavicon,
  generateGradient,
  generateHmac,
  generateInvoiceNumber,
  generateJwt,
  generatePalette,
  generateQrCode,
  generateRandomNumber,
  generateRsaKeyPair,
  getHttpStatusInfo,
  getUnitGroups,
  isPalindrome,
  isPrime,
  jsonToCsv,
  lookupDns,
  lookupIpAddress,
  numberToWords,
  parseUserAgent,
  scientificCalculator,
  simulatePing,
  toRoman,
  xmlToJson,
  yamlToJson
} from './utility-utils';

function renderSummaryCards(items) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <Card key={label}>
          <CardHeader className="pb-2">
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-lg break-all">{value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function formatUnitOptions(category) {
  const categoryOptions = getUnitGroups()[category] || getUnitGroups().length;
  return Object.entries(categoryOptions.units || {}).map(([value, meta]) => ({
    value,
    label: meta.label
  }));
}

export const utilityToolPageConfigs = {
  unit: {
    title: 'Unit Converter',
    description: 'Convert across length, weight, temperature, speed, area, and volume units.',
    fields: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        defaultValue: 1,
        step: 'any'
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        defaultValue: 'length',
        options: Object.entries(getUnitGroups()).map(([value, config]) => ({
          value,
          label: config.label
        }))
      },
      {
        name: 'fromUnit',
        label: 'From',
        type: 'select',
        defaultValue: 'm',
        options: formatUnitOptions('length')
      },
      {
        name: 'toUnit',
        label: 'To',
        type: 'select',
        defaultValue: 'km',
        options: formatUnitOptions('length')
      }
    ],
    outputLabel: 'Converted result',
    outputDescription: 'The converted value appears here.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter values to convert units.</p>;
      }

      return renderSummaryCards([
        ['Result', result.result],
        ['From', `${result.amount} ${result.from}`],
        ['To', result.to],
        ['Category', result.category]
      ]);
    },
    onProcess: ({ amount, category, fromUnit, toUnit }) => convertUnitValue(amount, fromUnit, toUnit, category),
    copyValue: ({ result }) => (result ? String(result.result) : '')
  },
  currency: {
    title: 'Currency Converter',
    description: 'Convert currencies using live exchange rates.',
    fields: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        defaultValue: 1,
        step: 'any'
      },
      {
        name: 'fromCurrency',
        label: 'From currency',
        type: 'text',
        defaultValue: 'USD'
      },
      {
        name: 'toCurrency',
        label: 'To currency',
        type: 'text',
        defaultValue: 'EUR'
      }
    ],
    outputLabel: 'Converted currency',
    outputDescription: 'Live rate information appears here.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter an amount and currencies.</p>;
      }

      return (
        <div className="space-y-4">
          {renderSummaryCards([
            ['Amount', `${result.amount} ${result.from}`],
            ['Rate', `1 ${result.from} = ${result.rate} ${result.to}`],
            ['Converted', `${result.result} ${result.to}`]
          ])}
        </div>
      );
    },
    onProcess: ({ amount, fromCurrency, toCurrency }) =>
      fetchCurrencyConversion(Number(amount), String(fromCurrency).toUpperCase(), String(toCurrency).toUpperCase())
  },
  'number-base': {
    title: 'Number Base Converter',
    description: 'Convert between binary, octal, decimal, and hexadecimal values.',
    fields: [
      {
        name: 'value',
        label: 'Number',
        type: 'text',
        defaultValue: '255'
      },
      {
        name: 'base',
        label: 'Input base',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Auto detect' },
          { value: '2', label: 'Binary' },
          { value: '8', label: 'Octal' },
          { value: '10', label: 'Decimal' },
          { value: '16', label: 'Hexadecimal' }
        ]
      }
    ],
    outputLabel: 'Converted number',
    outputDescription: 'See the value in each base.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a number to convert it.</p>;
      }

      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {renderSummaryCards([
            ['Binary', `0b${result.binary}`],
            ['Octal', `0o${result.octal}`],
            ['Decimal', String(result.decimal)],
            ['Hexadecimal', `0x${result.hexadecimal}`]
          ])}
        </div>
      );
    },
    onProcess: ({ value, base }) => convertIntegerBases(value, base)
  },
  roman: {
    title: 'Roman Numeral Converter',
    description: 'Convert between Roman numerals and Arabic numbers.',
    fields: [
      {
        name: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'roman-to-number',
        options: [
          { value: 'roman-to-number', label: 'Roman → Number' },
          { value: 'number-to-roman', label: 'Number → Roman' }
        ]
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        defaultValue: 'XIV'
      }
    ],
    outputLabel: 'Converted value',
    outputDescription: 'The result appears here.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a value to convert it.</p>;
      }

      return renderSummaryCards([
        ['Result', result]
      ]);
    },
    onProcess: ({ mode, value }) => (mode === 'number-to-roman' ? toRoman(value) : String(fromRoman(value)))
  },
  'number-to-words': {
    title: 'Number to Words',
    description: 'Convert whole numbers into readable words.',
    fields: [
      {
        name: 'value',
        label: 'Number',
        type: 'number',
        defaultValue: 1000
      }
    ],
    outputLabel: 'Words',
    outputDescription: 'The number written out in words.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a number to see the words.</p>;
      }

      return renderSummaryCards([
        ['Output', result]
      ]);
    },
    onProcess: ({ value }) => numberToWords(value),
    copyValue: ({ result }) => (result ? String(result) : '')
  },
  'file-size': {
    title: 'File Size Converter',
    description: 'Convert between bytes, KB, MB, GB, and TB.',
    fields: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        defaultValue: 1,
        step: 'any'
      },
      {
        name: 'fromUnit',
        label: 'From',
        type: 'select',
        defaultValue: 'mb',
        options: Object.entries({ b: 'Bytes', kb: 'KB', mb: 'MB', gb: 'GB', tb: 'TB' }).map(([value, label]) => ({
          value,
          label
        }))
      },
      {
        name: 'toUnit',
        label: 'To',
        type: 'select',
        defaultValue: 'kb',
        options: Object.entries({ b: 'Bytes', kb: 'KB', mb: 'MB', gb: 'GB', tb: 'TB' }).map(([value, label]) => ({
          value,
          label
        }))
      }
    ],
    outputLabel: 'Converted size',
    outputDescription: 'The file size in the target unit.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a size to convert it.</p>;
      }

      return renderSummaryCards([
        ['Result', `${result.result} ${result.to}`],
        ['From', `${result.amount} ${result.from}`]
      ]);
    },
    onProcess: ({ amount, fromUnit, toUnit }) => convertFileSizeValue(amount, fromUnit, toUnit),
    copyValue: ({ result }) => (result ? String(result.result) : '')
  },
  color: {
    title: 'Color Converter',
    description: 'Convert between HEX, RGB, and HSL values.',
    fields: [
      {
        name: 'value',
        label: 'Color value',
        type: 'text',
        defaultValue: '#4f46e5'
      },
      {
        name: 'inputFormat',
        label: 'Input format',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Auto detect' },
          { value: 'hex', label: 'HEX' },
          { value: 'rgb', label: 'RGB' },
          { value: 'hsl', label: 'HSL' }
        ]
      }
    ],
    outputLabel: 'Converted color',
    outputDescription: 'Preview and copy your color values.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a color value to convert it.</p>;
      }

      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div className="h-36 rounded-xl border shadow-sm" style={{ backgroundColor: result.hex }} />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{result.hex}</Badge>
                <Badge variant="outline">{result.rgbText}</Badge>
                <Badge variant="outline">{result.hslText}</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {renderSummaryCards([
                  ['HEX', result.hex],
                  ['RGB', result.rgbText],
                  ['HSL', result.hslText]
                ])}
              </div>
            </div>
          </div>
        </div>
      );
    },
    onProcess: ({ value, inputFormat }) => formatColorSummary(parseColorInput(value, inputFormat)),
    copyValue: ({ result }) => result?.hex || ''
  },
  'age-calculator': {
    title: 'Age Calculator',
    description: 'Calculate age in years, months, and days from a date of birth.',
    fields: [
      {
        name: 'dateOfBirth',
        label: 'Date of birth',
        type: 'date',
        defaultValue: '1995-01-01'
      }
    ],
    outputLabel: 'Age result',
    outputDescription: 'The calculated age breakdown.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a date of birth.</p>;
      }
      return renderSummaryCards([
        ['Years', result.years],
        ['Months', result.months],
        ['Days', result.days],
        ['Birthday', result.birthday]
      ]);
    },
    onProcess: ({ dateOfBirth }) => calculateAge(dateOfBirth)
  },
  'date-difference': {
    title: 'Date Difference Calculator',
    description: 'Compare two dates and see the difference in days and weeks.',
    fields: [
      {
        name: 'startDate',
        label: 'Start date',
        type: 'date',
        defaultValue: '2026-01-01'
      },
      {
        name: 'endDate',
        label: 'End date',
        type: 'date',
        defaultValue: '2026-01-15'
      }
    ],
    outputLabel: 'Date difference',
    outputDescription: 'The result is shown below.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Pick two dates to compare.</p>;
      }
      return renderSummaryCards([
        ['Total days', result.totalDays],
        ['Total weeks', result.totalWeeks],
        ['Direction', result.isFuture ? 'Future' : 'Past']
      ]);
    },
    onProcess: ({ startDate, endDate }) => calculateDateDifference(startDate, endDate)
  },
  timezone: {
    title: 'Timezone Converter',
    description: 'Convert a date-time value across timezones.',
    fields: [
      {
        name: 'input',
        label: 'Date and time',
        type: 'datetime-local',
        defaultValue: '2026-06-18T12:00'
      },
      {
        name: 'fromTimeZone',
        label: 'From timezone',
        type: 'text',
        defaultValue: 'UTC'
      },
      {
        name: 'toTimeZone',
        label: 'To timezone',
        type: 'text',
        defaultValue: 'America/New_York'
      }
    ],
    outputLabel: 'Timezone result',
    outputDescription: 'Show the same moment in another timezone.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a time and timezone values.</p>;
      }
      return renderSummaryCards([
        ['From', result.from],
        ['To', result.to],
        ['Input', result.input]
      ]);
    },
    onProcess: ({ input, fromTimeZone, toTimeZone }) => convertTimezone(input, fromTimeZone, toTimeZone)
  },
  countdown: {
    title: 'Countdown Timer',
    description: 'See how much time remains until a target date.',
    fields: [
      {
        name: 'targetDate',
        label: 'Target date',
        type: 'datetime-local',
        defaultValue: '2027-01-01T00:00'
      }
    ],
    outputLabel: 'Countdown',
    outputDescription: 'Time remaining until the target moment.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Choose a target date.</p>;
      }
      return renderSummaryCards([
        ['Days', result.days],
        ['Hours', result.hours],
        ['Minutes', result.minutes],
        ['Seconds', result.seconds],
        ['Status', result.isComplete ? 'Complete' : 'Running']
      ]);
    },
    onProcess: ({ targetDate }) => calculateCountdown(targetDate)
  },
  'working-days': {
    title: 'Working Days Calculator',
    description: 'Count business days between two dates and ignore weekends and holidays.',
    fields: [
      {
        name: 'startDate',
        label: 'Start date',
        type: 'date',
        defaultValue: '2026-01-01'
      },
      {
        name: 'endDate',
        label: 'End date',
        type: 'date',
        defaultValue: '2026-01-31'
      },
      {
        name: 'holidays',
        label: 'Holidays (comma-separated)',
        type: 'text',
        defaultValue: '2026-01-02,2026-01-03'
      }
    ],
    outputLabel: 'Working days',
    outputDescription: 'The number of business days in the range.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Pick a date range.</p>;
      }
      return renderSummaryCards([
        ['Working days', result.workingDays],
        ['Start', result.startDate],
        ['End', result.endDate]
      ]);
    },
    onProcess: ({ startDate, endDate, holidays }) => calculateWorkingDays(startDate, endDate, holidays)
  },
  percentage: {
    title: 'Percentage Calculator',
    description: 'Find percentages and compare values quickly.',
    fields: [
      {
        name: 'value',
        label: 'Value',
        type: 'number',
        defaultValue: 100,
        step: 'any'
      },
      {
        name: 'percent',
        label: 'Percent',
        type: 'number',
        defaultValue: 15,
        step: 'any'
      }
    ],
    outputLabel: 'Percentage result',
    outputDescription: 'See the percentage breakdown.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a value and percentage.</p>;
      }
      return renderSummaryCards([
        ['Percent of value', result.percentOfValue],
        ['Value + %', result.valuePlusPercent],
        ['Value - %', result.valueMinusPercent]
      ]);
    },
    onProcess: ({ value, percent }) => calculatePercentage(value, percent)
  },
  scientific: {
    title: 'Scientific Calculator',
    description: 'Run common math operations on two values.',
    fields: [
      {
        name: 'value1',
        label: 'First value',
        type: 'number',
        defaultValue: 10,
        step: 'any'
      },
      {
        name: 'operator',
        label: 'Operation',
        type: 'select',
        defaultValue: 'add',
        options: [
          { value: 'add', label: 'Add' },
          { value: 'subtract', label: 'Subtract' },
          { value: 'multiply', label: 'Multiply' },
          { value: 'divide', label: 'Divide' },
          { value: 'power', label: 'Power' },
          { value: 'sqrt', label: 'Square root' }
        ]
      },
      {
        name: 'value2',
        label: 'Second value',
        type: 'number',
        defaultValue: 5,
        step: 'any'
      }
    ],
    outputLabel: 'Result',
    outputDescription: 'The calculator output.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter values and choose an operation.</p>;
      }
      return renderSummaryCards([['Result', result]]);
    },
    onProcess: ({ value1, value2, operator }) => scientificCalculator(value1, value2, operator)
  },
  bmi: {
    title: 'BMI Calculator',
    description: 'Estimate BMI and the associated category.',
    fields: [
      {
        name: 'weightKg',
        label: 'Weight (kg)',
        type: 'number',
        defaultValue: 70,
        step: 'any'
      },
      {
        name: 'heightCm',
        label: 'Height (cm)',
        type: 'number',
        defaultValue: 175,
        step: 'any'
      }
    ],
    outputLabel: 'BMI result',
    outputDescription: 'The BMI value and category.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter the weight and height.</p>;
      }
      return renderSummaryCards([
        ['BMI', result.bmi],
        ['Category', result.category]
      ]);
    },
    onProcess: ({ weightKg, heightCm }) => calculateBMI(weightKg, heightCm)
  },
  tip: {
    title: 'Tip Calculator',
    description: 'Split a bill including tips across people.',
    fields: [
      {
        name: 'bill',
        label: 'Bill amount',
        type: 'number',
        defaultValue: 50,
        step: 'any'
      },
      {
        name: 'tipPercent',
        label: 'Tip %',
        type: 'number',
        defaultValue: 15,
        step: 'any'
      },
      {
        name: 'people',
        label: 'People',
        type: 'number',
        defaultValue: 2,
        min: 1
      }
    ],
    outputLabel: 'Tip result',
    outputDescription: 'The tip, total, and per-person split.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter bill details.</p>;
      }
      return renderSummaryCards([
        ['Tip amount', result.tipAmount],
        ['Total', result.total],
        ['Per person', result.perPerson]
      ]);
    },
    onProcess: ({ bill, tipPercent, people }) => calculateTip(bill, tipPercent, people)
  },
  'loan-emi': {
    title: 'Loan / EMI Calculator',
    description: 'Estimate EMI, total payment, and interest for a loan.',
    fields: [
      {
        name: 'principal',
        label: 'Principal',
        type: 'number',
        defaultValue: 100000,
        step: 'any'
      },
      {
        name: 'annualRate',
        label: 'Annual rate (%)',
        type: 'number',
        defaultValue: 10,
        step: 'any'
      },
      {
        name: 'years',
        label: 'Years',
        type: 'number',
        defaultValue: 5,
        min: 1
      }
    ],
    outputLabel: 'EMI result',
    outputDescription: 'Loan payment breakdown.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter loan terms.</p>;
      }
      return renderSummaryCards([
        ['EMI', result.emi],
        ['Total payment', result.totalPayment],
        ['Total interest', result.totalInterest]
      ]);
    },
    onProcess: ({ principal, annualRate, years }) => calculateLoanEmi(principal, annualRate, years)
  },
  prime: {
    title: 'Prime Number Checker',
    description: 'Check whether a number is prime.',
    fields: [
      {
        name: 'value',
        label: 'Number',
        type: 'number',
        defaultValue: 97
      }
    ],
    outputLabel: 'Prime result',
    outputDescription: 'The output tells whether the number is prime.',
    renderOutput: ({ result }) => {
      if (result === undefined || result === null) {
        return <p className="text-sm text-muted-foreground">Enter a number to check.</p>;
      }
      return renderSummaryCards([['Result', isPrime(result) ? 'Prime' : 'Not prime']]);
    },
    onProcess: ({ value }) => value
  },
  'gcd-lcm': {
    title: 'GCD & LCM Calculator',
    description: 'Calculate the greatest common divisor and least common multiple.',
    fields: [
      {
        name: 'a',
        label: 'First number',
        type: 'number',
        defaultValue: 12
      },
      {
        name: 'b',
        label: 'Second number',
        type: 'number',
        defaultValue: 18
      }
    ],
    outputLabel: 'GCD / LCM',
    outputDescription: 'The computed math values.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter two numbers.</p>;
      }
      return renderSummaryCards([
        ['GCD', result.gcd],
        ['LCM', result.lcm]
      ]);
    },
    onProcess: ({ a, b }) => calculateGcdLcm(a, b)
  },
  'random-number': {
    title: 'Random Number Generator',
    description: 'Generate one or more random integers in a range.',
    fields: [
      {
        name: 'min',
        label: 'Minimum',
        type: 'number',
        defaultValue: 1
      },
      {
        name: 'max',
        label: 'Maximum',
        type: 'number',
        defaultValue: 100
      },
      {
        name: 'count',
        label: 'How many?',
        type: 'number',
        defaultValue: 1,
        min: 1
      }
    ],
    outputLabel: 'Random numbers',
    outputDescription: 'The generated values.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Set a range to generate numbers.</p>;
      }
      return renderSummaryCards([
        ['Count', result.count],
        ['Numbers', result.numbers.join(', ')]
      ]);
    },
    onProcess: ({ min, max, count }) => generateRandomNumber(min, max, count)
  },
  area: {
    title: 'Area Calculator',
    description: 'Calculate area for common 2D shapes.',
    fields: [
      {
        name: 'shape',
        label: 'Shape',
        type: 'select',
        defaultValue: 'circle',
        options: [
          { value: 'circle', label: 'Circle' },
          { value: 'square', label: 'Square' },
          { value: 'triangle', label: 'Triangle' },
          { value: 'rectangle', label: 'Rectangle' }
        ]
      },
      { name: 'radius', label: 'Radius', type: 'number', defaultValue: 5, step: 'any' },
      { name: 'side', label: 'Side', type: 'number', defaultValue: 5, step: 'any' },
      { name: 'base', label: 'Base', type: 'number', defaultValue: 6, step: 'any' },
      { name: 'height', label: 'Height', type: 'number', defaultValue: 4, step: 'any' },
      { name: 'length', label: 'Length', type: 'number', defaultValue: 8, step: 'any' },
      { name: 'width', label: 'Width', type: 'number', defaultValue: 5, step: 'any' }
    ],
    outputLabel: 'Area result',
    outputDescription: 'The computed area and perimeter.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Choose a shape and enter the dimensions.</p>;
      }
      return renderSummaryCards([
        ['Area', result.area],
        ['Perimeter', result.perimeter ?? 'N/A']
      ]);
    },
    onProcess: ({ shape, radius, side, base, height, length, width }) =>
      calculateGeometry(shape, { radius, side, base, height, length, width })
  },
  pythagorean: {
    title: 'Pythagorean Theorem Solver',
    description: 'Solve the hypotenuse and area of a right triangle.',
    fields: [
      {
        name: 'a',
        label: 'Side A',
        type: 'number',
        defaultValue: 3,
        step: 'any'
      },
      {
        name: 'b',
        label: 'Side B',
        type: 'number',
        defaultValue: 4,
        step: 'any'
      }
    ],
    outputLabel: 'Right triangle result',
    outputDescription: 'The hypotenuse and triangle area.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter side lengths.</p>;
      }
      return renderSummaryCards([
        ['Hypotenuse', result.hypotenuse],
        ['Area', result.area]
      ]);
    },
    onProcess: ({ a, b }) => calculatePythagorean(a, b)
  },
  volume: {
    title: 'Volume Calculator',
    description: 'Calculate the volume of common 3D shapes.',
    fields: [
      {
        name: 'shape',
        label: 'Shape',
        type: 'select',
        defaultValue: 'cube',
        options: [
          { value: 'cube', label: 'Cube' },
          { value: 'cuboid', label: 'Cuboid' },
          { value: 'sphere', label: 'Sphere' },
          { value: 'cylinder', label: 'Cylinder' }
        ]
      },
      { name: 'side', label: 'Side', type: 'number', defaultValue: 5, step: 'any' },
      { name: 'length', label: 'Length', type: 'number', defaultValue: 6, step: 'any' },
      { name: 'width', label: 'Width', type: 'number', defaultValue: 4, step: 'any' },
      { name: 'height', label: 'Height', type: 'number', defaultValue: 3, step: 'any' },
      { name: 'radius', label: 'Radius', type: 'number', defaultValue: 2, step: 'any' }
    ],
    outputLabel: 'Volume result',
    outputDescription: 'The calculated volume.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Choose a shape and enter the dimensions.</p>;
      }
      return renderSummaryCards([
        ['Volume', result.volume]
      ]);
    },
    onProcess: ({ shape, side, length, width, height, radius }) =>
      calculateVolume(shape, { side, length, width, height, radius })
  },
  'ip-lookup': {
    title: 'IP Address Lookup',
    description: 'Look up your current public IP address.',
    fields: [],
    outputLabel: 'Public IP',
    outputDescription: 'The detected public IP details.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Run the lookup to see your IP details.</p>;
      }
      return renderSummaryCards([
        ['IP', result.ip]
      ]);
    },
    onProcess: async () => lookupIpAddress()
  },
  'dns-lookup': {
    title: 'DNS Lookup',
    description: 'Check DNS records for a hostname.',
    fields: [
      {
        name: 'hostname',
        label: 'Hostname',
        type: 'text',
        defaultValue: 'example.com'
      }
    ],
    outputLabel: 'DNS records',
    outputDescription: 'The DNS response details.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a hostname to query DNS.</p>;
      }
      return (
        <div className="space-y-3">
          {result.answers.map((item) => (
            <Card key={`${item.type}-${item.data}`}>
              <CardHeader className="pb-2">
                <CardDescription>{item.type} (TTL: {item.ttl})</CardDescription>
                <CardTitle className="text-sm break-all">{item.data}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      );
    },
    onProcess: ({ hostname }) => lookupDns(hostname)
  },
  'http-status': {
    title: 'HTTP Status Code Reference',
    description: 'Look up common HTTP status meanings.',
    fields: [
      {
        name: 'code',
        label: 'Status code',
        type: 'number',
        defaultValue: 200,
        min: 100,
        max: 599
      }
    ],
    outputLabel: 'Status info',
    outputDescription: 'Meaning and category for the code.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a status code.</p>;
      }
      return renderSummaryCards([
        ['Code', result.code],
        ['Message', result.message],
        ['Category', result.category]
      ]);
    },
    onProcess: ({ code }) => getHttpStatusInfo(Number(code))
  },
  'user-agent': {
    title: 'User Agent Parser',
    description: 'Inspect a user agent string and identify the browser and platform.',
    fields: [
      {
        name: 'value',
        label: 'User agent',
        type: 'text',
        defaultValue: navigator.userAgent
      }
    ],
    outputLabel: 'Parsed user agent',
    outputDescription: 'The browser and platform information.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a user agent string.</p>;
      }
      return renderSummaryCards([
        ['Browser', result.browser],
        ['Platform', result.platform],
        ['Mobile', result.isMobile ? 'Yes' : 'No']
      ]);
    },
    onProcess: ({ value }) => parseUserAgent(value)
  },
  'ssl-checker': {
    title: 'SSL Certificate Checker',
    description: 'Check whether a URL appears to use HTTPS and a secure setup.',
    fields: [
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        defaultValue: 'https://example.com'
      }
    ],
    outputLabel: 'SSL result',
    outputDescription: 'The HTTPS and hostname information.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a URL to validate.</p>;
      }
      return renderSummaryCards([
        ['URL', result.url],
        ['Hostname', result.hostname || 'N/A'],
        ['Status', result.status],
        ['Secure', result.isSecure ? 'Yes' : 'No']
      ]);
    },
    onProcess: ({ url }) => checkSslCertificate(url)
  },
  ping: {
    title: 'Ping Tool (Simulated)',
    description: 'Estimate a simulated latency for a host.',
    fields: [
      {
        name: 'hostname',
        label: 'Hostname',
        type: 'text',
        defaultValue: 'example.com'
      }
    ],
    outputLabel: 'Ping result',
    outputDescription: 'Latency and response status.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a hostname to simulate a ping.</p>;
      }
      return renderSummaryCards([
        ['Host', result.host],
        ['Latency', `${result.latency} ms`],
        ['Status', result.status]
      ]);
    },
    onProcess: ({ hostname }) => simulatePing(hostname)
  },
  'qr-code': {
    title: 'QR Code Generator',
    description: 'Generate a QR code for a given text value.',
    fields: [
      {
        name: 'value',
        label: 'Text',
        type: 'text',
        defaultValue: 'https://example.com'
      },
      {
        name: 'size',
        label: 'Size (px)',
        type: 'number',
        defaultValue: 300,
        min: 120,
        max: 800
      }
    ],
    outputLabel: 'QR code',
    outputDescription: 'The generated QR image.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter text to create a QR code.</p>;
      }
      return <img src={result.imageUrl} alt="QR code" className="max-w-full rounded-md border" />;
    },
    onProcess: async ({ value, size }) => generateQrCode(value, Number(size))
  },
  barcode: {
    title: 'Barcode Generator',
    description: 'Create a barcode image for a code value.',
    fields: [
      {
        name: 'value',
        label: 'Code',
        type: 'text',
        defaultValue: '123456789012'
      }
    ],
    outputLabel: 'Barcode',
    outputDescription: 'The generated barcode image.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a code to generate a barcode.</p>;
      }
      return <img src={result.imageUrl} alt="Barcode" className="max-w-full rounded-md border" />;
    },
    onProcess: async ({ value }) => generateBarcode(value)
  },
  'fake-data': {
    title: 'Fake Data Generator',
    description: 'Create random sample names, emails, and addresses.',
    fields: [
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All' },
          { value: 'name', label: 'Name' },
          { value: 'email', label: 'Email' },
          { value: 'address', label: 'Address' }
        ]
      }
    ],
    outputLabel: 'Generated data',
    outputDescription: 'A sample value or object.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Choose a type to generate sample data.</p>;
      }
      return <pre className="whitespace-pre-wrap text-sm">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>;
    },
    onProcess: ({ type }) => generateFakeData(type)
  },
  'invoice-number': {
    title: 'Invoice Number Generator',
    description: 'Create a formatted invoice number.',
    fields: [
      {
        name: 'prefix',
        label: 'Prefix',
        type: 'text',
        defaultValue: 'INV'
      }
    ],
    outputLabel: 'Invoice number',
    outputDescription: 'The generated number.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a prefix to generate an invoice code.</p>;
      }
      return renderSummaryCards([['Invoice', result]]);
    },
    onProcess: ({ prefix }) => generateInvoiceNumber(prefix)
  },
  'color-palette': {
    title: 'Color Palette Generator',
    description: 'Generate a small palette from a seed color.',
    fields: [
      {
        name: 'seed',
        label: 'Seed color',
        type: 'text',
        defaultValue: '#4f46e5'
      }
    ],
    outputLabel: 'Palette',
    outputDescription: 'A few generated colors.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a seed color.</p>;
      }
      return (
        <div className="flex flex-wrap gap-2">
          {result.map((color) => (
            <div key={color} className="flex items-center gap-2 rounded-md border p-2">
              <div className="h-10 w-10 rounded-md" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium">{color}</span>
            </div>
          ))}
        </div>
      );
    },
    onProcess: ({ seed }) => generatePalette(seed)
  },
  gradient: {
    title: 'Gradient Generator',
    description: 'Create a CSS gradient string from color stops.',
    fields: [
      {
        name: 'colors',
        label: 'Colors (comma separated)',
        type: 'text',
        defaultValue: '#0ea5e9, #8b5cf6'
      }
    ],
    outputLabel: 'Gradient',
    outputDescription: 'The computed gradient CSS.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter colors to build a gradient.</p>;
      }
      return (
        <div className="space-y-3">
          <div className="h-24 rounded-md border" style={{ background: result }} />
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      );
    },
    onProcess: ({ colors }) => generateGradient(String(colors).split(',').map((item) => item.trim()).filter(Boolean))
  },
  favicon: {
    title: 'Favicon Generator',
    description: 'Generate a simple favicon from short text.',
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'text',
        defaultValue: 'SU'
      }
    ],
    outputLabel: 'Generated favicon',
    outputDescription: 'The favicon preview and data URL.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter text to generate a favicon.</p>;
      }
      return (
        <div className="space-y-3">
          <img src={result} alt="Generated favicon" className="h-16 w-16 rounded-md border bg-white" />
          <pre className="whitespace-pre-wrap text-sm break-all">{result}</pre>
        </div>
      );
    },
    onProcess: ({ text }) => generateFavicon(text)
  },
  'password-strength': {
    title: 'Password Strength Checker',
    description: 'Score a password and check its complexity.',
    fields: [
      {
        name: 'password',
        label: 'Password',
        type: 'text',
        defaultValue: 'Sample@123'
      }
    ],
    outputLabel: 'Strength result',
    outputDescription: 'The password quality details.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a password to check its strength.</p>;
      }
      return renderSummaryCards([
        ['Score', result.score],
        ['Label', result.label],
        ['Uppercase', result.hasUppercase ? 'Yes' : 'No'],
        ['Lowercase', result.hasLowercase ? 'Yes' : 'No'],
        ['Number', result.hasNumber ? 'Yes' : 'No'],
        ['Symbol', result.hasSymbol ? 'Yes' : 'No']
      ]);
    },
    onProcess: ({ password }) => checkPasswordStrength(password)
  },
  hmac: {
    title: 'HMAC Generator',
    description: 'Generate a SHA-256 HMAC from a secret and message.',
    fields: [
      {
        name: 'secret',
        label: 'Secret',
        type: 'text',
        defaultValue: 'secret-key'
      },
      {
        name: 'message',
        label: 'Message',
        type: 'text',
        defaultValue: 'hello'
      }
    ],
    outputLabel: 'HMAC signature',
    outputDescription: 'The generated signature value.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a secret and message to generate an HMAC.</p>;
      }
      return renderSummaryCards([
        ['Algorithm', result.algorithm],
        ['Signature', result.signature]
      ]);
    },
    onProcess: async ({ secret, message }) => generateHmac(secret, message)
  },
  jwt: {
    title: 'JWT Generator',
    description: 'Create a signed JWT from payload and secret.',
    fields: [
      {
        name: 'payload',
        label: 'Payload (JSON)',
        type: 'textarea',
        defaultValue: '{"sub":"123","name":"Jane"}'
      },
      {
        name: 'secret',
        label: 'Secret',
        type: 'text',
        defaultValue: 'secret'
      }
    ],
    outputLabel: 'JWT token',
    outputDescription: 'The generated token and metadata.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter JSON payload and secret.</p>;
      }
      return (
        <div className="space-y-3">
          <pre className="whitespace-pre-wrap text-sm">{result.token}</pre>
          <div className="grid gap-3 sm:grid-cols-2">
            {renderSummaryCards([
              ['Algorithm', result.header.alg],
              ['Type', result.header.typ]
            ])}
          </div>
        </div>
      );
    },
    onProcess: async ({ payload, secret }) => {
      const parsed = JSON.parse(payload || '{}');
      return generateJwt(parsed, secret);
    }
  },
  'bcrypt-hash': {
    title: 'Bcrypt Hash Generator',
    description: 'Create a bcrypt hash for a secret value.',
    fields: [
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        defaultValue: 'secret'
      },
      {
        name: 'saltRounds',
        label: 'Salt rounds',
        type: 'number',
        defaultValue: 10,
        min: 4,
        max: 15
      }
    ],
    outputLabel: 'Hash result',
    outputDescription: 'The bcrypt hash and salt rounds.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a value to hash.</p>;
      }
      return renderSummaryCards([
        ['Salt rounds', result.saltRounds],
        ['Hash', result.hash]
      ]);
    },
    onProcess: async ({ value, saltRounds }) => generateBcryptHash(value, Number(saltRounds))
  },
  'rsa-keygen': {
    title: 'RSA Key Pair Generator',
    description: 'Generate RSA public and private keys.',
    fields: [],
    outputLabel: 'RSA keys',
    outputDescription: 'Public and private key values.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Generate a key pair to view the keys.</p>;
      }
      return (
        <div className="space-y-3">
          <pre className="whitespace-pre-wrap text-sm break-all">{result.publicKey}</pre>
          <pre className="whitespace-pre-wrap text-sm break-all">{result.privateKey}</pre>
        </div>
      );
    },
    onProcess: async () => generateRsaKeyPair()
  },
  'csv-to-json': {
    title: 'CSV to JSON',
    description: 'Convert CSV text into JSON objects.',
    fields: [
      {
        name: 'value',
        label: 'CSV',
        type: 'textarea',
        defaultValue: 'name,email\nJane,jane@example.com\nJohn,john@example.com'
      }
    ],
    outputLabel: 'JSON output',
    outputDescription: 'The converted JSON data.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter CSV text to convert it.</p>;
      }
      return <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>;
    },
    onProcess: ({ value }) => csvToJson(value)
  },
  'json-to-csv': {
    title: 'JSON to CSV',
    description: 'Convert a JSON array or object into CSV.',
    fields: [
      {
        name: 'value',
        label: 'JSON',
        type: 'textarea',
        defaultValue: '[{"name":"Jane","email":"jane@example.com"},{"name":"John","email":"john@example.com"}]'
      }
    ],
    outputLabel: 'CSV output',
    outputDescription: 'The converted CSV text.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter JSON to convert it.</p>;
      }
      return <pre className="whitespace-pre-wrap text-sm">{result}</pre>;
    },
    onProcess: ({ value }) => jsonToCsv(JSON.parse(value))
  },
  'xml-to-json': {
    title: 'XML to JSON',
    description: 'Convert XML markup into a JSON object.',
    fields: [
      {
        name: 'value',
        label: 'XML',
        type: 'textarea',
        defaultValue: '<root><name>Jane</name><email>jane@example.com</email></root>'
      }
    ],
    outputLabel: 'JSON output',
    outputDescription: 'The parsed XML result.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter XML to convert it.</p>;
      }
      return <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>;
    },
    onProcess: ({ value }) => xmlToJson(value)
  },
  'yaml-to-json': {
    title: 'YAML to JSON',
    description: 'Convert YAML text into a JSON object.',
    fields: [
      {
        name: 'value',
        label: 'YAML',
        type: 'textarea',
        defaultValue: 'name: Jane\nemail: jane@example.com'
      }
    ],
    outputLabel: 'JSON output',
    outputDescription: 'The parsed YAML result.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter YAML to convert it.</p>;
      }
      return <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>;
    },
    onProcess: ({ value }) => yamlToJson(value)
  },
  'word-frequency': {
    title: 'Word Frequency Analyzer',
    description: 'Count the frequency of words in text.',
    fields: [
      {
        name: 'value',
        label: 'Text',
        type: 'textarea',
        defaultValue: 'apple banana apple orange'
      }
    ],
    outputLabel: 'Word frequency',
    outputDescription: 'The most frequent words.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter text to analyze word frequency.</p>;
      }
      return (
        <div className="space-y-2">
          {result.map((item) => (
            <Card key={item.word}>
              <CardHeader className="pb-2">
                <CardDescription>{item.word}</CardDescription>
                <CardTitle>{item.count}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      );
    },
    onProcess: ({ value }) => analyzeWordFrequency(value)
  },
  'reading-time': {
    title: 'Reading Time Estimator',
    description: 'Estimate how long it will take to read text.',
    fields: [
      {
        name: 'value',
        label: 'Text',
        type: 'textarea',
        defaultValue: 'This is a sample paragraph to estimate reading time.'
      }
    ],
    outputLabel: 'Reading estimate',
    outputDescription: 'Words and estimated minutes.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter text to estimate reading time.</p>;
      }
      return renderSummaryCards([
        ['Words', result.words],
        ['Minutes', result.minutes],
        ['Words per minute', result.wordsPerMinute]
      ]);
    },
    onProcess: ({ value }) => estimateReadingTime(value)
  },
  palindrome: {
    title: 'Palindrome Checker',
    description: 'Check whether text reads the same forward and backward.',
    fields: [
      {
        name: 'value',
        label: 'Text',
        type: 'text',
        defaultValue: 'level'
      }
    ],
    outputLabel: 'Palindrome result',
    outputDescription: 'Whether the text is a palindrome.',
    renderOutput: ({ result }) => {
      if (result === undefined || result === null) {
        return <p className="text-sm text-muted-foreground">Enter text to check if it is a palindrome.</p>;
      }
      return renderSummaryCards([['Result', result ? 'Yes' : 'No']]);
    },
    onProcess: ({ value }) => isPalindrome(value)
  }
};

export function getUtilityToolPageConfig(key) {
  return utilityToolPageConfigs[key];
}
