import { useParams } from 'react-router-dom';
import DevToolPage from '../components/DevToolPage';
import { getDevToolPageConfig } from '../lib/dev-tool-page-configs';

export default function DevToolPageRoute() {
  const { toolKey } = useParams();
  const config = getDevToolPageConfig(toolKey);

  if (!config) {
    return null;
  }

  return <DevToolPage {...config} />;
}
