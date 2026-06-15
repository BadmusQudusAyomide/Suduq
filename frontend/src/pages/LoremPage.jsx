import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function LoremPage() {
  return <TextToolPage {...getTextToolPageConfig('lorem')} />;
}
