import ImageToolPage from '../components/ImageToolPage';
import { getImageToolPageConfig } from '../lib/tool-page-configs';

export default function ImageYoutubeBannerPage() {
  return <ImageToolPage {...getImageToolPageConfig('youtube-banner')} />;
}
