import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function UuidGeneratorPage() {
  return <TextToolPage {...getTextToolPageConfig('uuid')} />;
}
