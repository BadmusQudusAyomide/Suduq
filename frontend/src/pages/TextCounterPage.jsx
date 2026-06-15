import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function TextCounterPage() {
  return <TextToolPage {...getTextToolPageConfig('counter')} />;
}
