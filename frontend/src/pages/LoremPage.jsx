import TextToolPage from '../components/TextToolPage';
import { generateLorem } from '../lib/text-utils';

export default function LoremPage() {
  return (
    <TextToolPage
      title="Lorem Ipsum Generator"
      description="Generate placeholder paragraphs for layouts, demos, and mockups."
      inputLabel="Controls"
      inputPlaceholder="Use the controls below to generate placeholder copy."
      initialInput=""
      controls={[
        {
          name: 'paragraphs',
          label: 'Paragraphs',
          type: 'number',
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 3,
          placeholder: '3'
        }
      ]}
      primaryActionLabel="Generate lorem ipsum"
      secondaryActionLabel="Clear"
      onProcess={(_, controls) => generateLorem(Number(controls.paragraphs || 3))}
      outputLabel="Generated Text"
      outputDescription="Use the copy button or regenerate as needed."
    />
  );
}
