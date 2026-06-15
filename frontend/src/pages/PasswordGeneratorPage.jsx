import TextToolPage from '../components/TextToolPage';
import { generatePassword } from '../lib/text-utils';

export default function PasswordGeneratorPage() {
  return (
    <TextToolPage
      title="Password Generator"
      description="Create strong passwords with the character sets you want."
      inputLabel="Result"
      inputPlaceholder="Use the controls to generate a password."
      initialInput=""
      controls={[
        {
          name: 'length',
          label: 'Length',
          type: 'number',
          min: 8,
          max: 64,
          step: 1,
          defaultValue: 16,
          placeholder: '16'
        },
        {
          name: 'lowercase',
          label: 'Lowercase',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'uppercase',
          label: 'Uppercase',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'numbers',
          label: 'Numbers',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'symbols',
          label: 'Symbols',
          type: 'checkbox',
          defaultValue: true
        }
      ]}
      primaryActionLabel="Generate password"
      secondaryActionLabel="Reset"
      onProcess={(_, controls) =>
        generatePassword(Number(controls.length || 16), {
          lowercase: Boolean(controls.lowercase),
          uppercase: Boolean(controls.uppercase),
          numbers: Boolean(controls.numbers),
          symbols: Boolean(controls.symbols)
        })
      }
      outputLabel="Generated Password"
      outputDescription="Copy the generated password and keep it safe."
    />
  );
}
