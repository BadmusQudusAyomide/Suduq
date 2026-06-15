import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function UrlToolsPage() {
  return <TextToolPage {...getTextToolPageConfig('url')} />;
}
