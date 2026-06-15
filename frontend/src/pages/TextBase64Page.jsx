import TextToolPage from '../components/TextToolPage';
import { decodeBase64, encodeBase64 } from '../lib/text-utils';

export default function TextBase64Page() {
  return (
    <TextToolPage
      title="Base64 Encode / Decode"
      description="Turn plain text into Base64 or convert Base64 back to readable text."
      controls={[
        {
          name: 'mode',
          label: 'Mode',
          type: 'select',
          defaultValue: 'encode',
          options: [
            { value: 'encode', label: 'Encode' },
            { value: 'decode', label: 'Decode' }
          ]
        }
      ]}
      primaryActionLabel="Process Base64"
      outputLabel="Result"
      outputDescription="Convert text in either direction."
      onProcess={(input, controls) =>
        controls.mode === 'decode' ? decodeBase64(input) : encodeBase64(input)
      }
    />
  );
}
