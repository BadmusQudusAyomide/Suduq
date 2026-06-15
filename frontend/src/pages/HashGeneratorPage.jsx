import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function HashGeneratorPage() {
  return <TextToolPage {...getTextToolPageConfig('hash')} />;
}
