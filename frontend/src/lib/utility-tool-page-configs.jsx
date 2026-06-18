import { Badge } from '../components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { convertIntegerBases, formatColorSummary, parseColorInput } from './dev-utils';
import {
  convertFileSizeValue,
  convertUnitValue,
  fetchCurrencyConversion,
  fromRoman,
  numberToWords,
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
  }
};

export function getUtilityToolPageConfig(key) {
  return utilityToolPageConfigs[key];
}
