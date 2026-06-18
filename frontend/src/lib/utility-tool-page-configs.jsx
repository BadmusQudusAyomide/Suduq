import { Badge } from '../components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { convertIntegerBases, formatColorSummary, parseColorInput } from './dev-utils';
import {
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
  convertFileSizeValue,
  convertTimezone,
  convertUnitValue,
  fetchCurrencyConversion,
  fromRoman,
  generateRandomNumber,
  isPrime,
  numberToWords,
  scientificCalculator,
  toRoman,
  getUnitGroups
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
  }
};

export function getUtilityToolPageConfig(key) {
  return utilityToolPageConfigs[key];
}
