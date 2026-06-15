import TextToolPage from '../components/TextToolPage';
import { getTextToolPageConfig } from '../lib/tool-page-configs';

export default function PasswordGeneratorPage() {
  return <TextToolPage {...getTextToolPageConfig('password')} />;
}
