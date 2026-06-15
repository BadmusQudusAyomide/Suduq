import ImageToolPage from '../components/ImageToolPage';
import { getImageToolPageConfig } from '../lib/tool-page-configs';

export default function ImageCompressPage() {
  return <ImageToolPage {...getImageToolPageConfig('compress')} />;
}
