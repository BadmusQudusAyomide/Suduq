import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function JsonFormatterPage() {
  return <TextToolPage {...getTextToolPageConfig('json')} />;
}
