import TextToolPage from '../components/TextToolPage';
import { toCamelCase, toSnakeCase, toTitleCase } from '../lib/text-utils';

export default function TextCasePage() {
  return (
    <TextToolPage
      title="Case Converter"
      description="Switch text between UPPER, lower, Title, camelCase, and snake_case."
      liveOutput
      outputLabel="Converted Text"
      outputDescription="The result updates as you change the selected case."
      controls={[
        {
          name: 'mode',
          label: 'Case type',
          type: 'select',
          defaultValue: 'upper',
          options: [
            { value: 'upper', label: 'UPPER' },
            { value: 'lower', label: 'lower' },
            { value: 'title', label: 'Title Case' },
            { value: 'camel', label: 'camelCase' },
            { value: 'snake', label: 'snake_case' }
          ]
        }
      ]}
      onProcess={(input, controls) => {
        switch (controls.mode) {
          case 'lower':
            return input.toLowerCase();
          case 'title':
            return toTitleCase(input);
          case 'camel':
            return toCamelCase(input);
          case 'snake':
            return toSnakeCase(input);
          case 'upper':
          default:
            return input.toUpperCase();
        }
      }}
    />
  );
}
