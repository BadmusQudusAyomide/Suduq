import TextToolPage from '../components/TextToolPage';
import { decodeUrl, encodeUrl } from '../lib/text-utils';

export default function UrlToolsPage() {
  return (
    <TextToolPage
      title="URL Encode / Decode"
      description="Encode text for URLs or decode a URL-encoded string back to plain text."
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
      primaryActionLabel="Process URL"
      outputLabel="Result"
      outputDescription="The output changes based on the selected mode."
      onProcess={(input, controls) =>
        controls.mode === 'decode' ? decodeUrl(input) : encodeUrl(input)
      }
    />
  );
}
