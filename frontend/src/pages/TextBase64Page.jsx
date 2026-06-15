import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function TextBase64Page() {
  return <TextToolPage {...getTextToolPageConfig('base64')} />;
}
