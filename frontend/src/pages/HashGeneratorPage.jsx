import TextToolPage from '../components/TextToolPage';
import { md5Hash, sha256Hash } from '../lib/text-utils';

export default function HashGeneratorPage() {
  return (
    <TextToolPage
      title="Hash Generator"
      description="Generate MD5 and SHA-256 hashes from text input."
      inputLabel="Text"
      inputPlaceholder="Enter the text you want to hash..."
      controls={[
        {
          name: 'algorithm',
          label: 'Algorithm',
          type: 'select',
          defaultValue: 'sha256',
          options: [
            { value: 'md5', label: 'MD5' },
            { value: 'sha256', label: 'SHA-256' }
          ]
        }
      ]}
      primaryActionLabel="Generate hash"
      secondaryActionLabel="Reset"
      outputLabel="Hash output"
      outputDescription="The selected algorithm runs when you press the button."
      onProcess={async (input, controls) => {
        if (controls.algorithm === 'md5') {
          return md5Hash(input);
        }

        return sha256Hash(input);
      }}
    />
  );
}
