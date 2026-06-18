import { useParams } from 'react-router-dom';
import DevToolPage from '../components/DevToolPage';
import { getUtilityToolPageConfig } from '../lib/utility-tool-page-configs';

export default function UtilityToolPage() {
  const { toolKey } = useParams();
  const config = getUtilityToolPageConfig(toolKey);

  if (!config) {
    return null;
  }

  return <DevToolPage {...config} categoryLabel="Utility tools" />;
}
