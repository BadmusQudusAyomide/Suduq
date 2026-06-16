import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import ImageCompressPage from './pages/ImageCompressPage';
import ImageResizePage from './pages/ImageResizePage';
import ImageConvertPage from './pages/ImageConvertPage';
import ImageBase64Page from './pages/ImageBase64Page';
import ImageRemoveBackgroundPage from './pages/ImageRemoveBackgroundPage';
import ImageColorPickerPage from './pages/ImageColorPickerPage';
import TextCounterPage from './pages/TextCounterPage';
import TextCasePage from './pages/TextCasePage';
import LoremPage from './pages/LoremPage';
import JsonFormatterPage from './pages/JsonFormatterPage';
import TextBase64Page from './pages/TextBase64Page';
import UrlToolsPage from './pages/UrlToolsPage';
import PasswordGeneratorPage from './pages/PasswordGeneratorPage';
import UuidGeneratorPage from './pages/UuidGeneratorPage';
import HashGeneratorPage from './pages/HashGeneratorPage';
import VideoDownloaderPage from './pages/VideoDownloaderPage';
import CategoryPage from './pages/CategoryPage';
import CreatorToolPage from './pages/CreatorToolPage';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="tools">
            <Route index element={<Navigate to="/tools/images" replace />} />
            <Route path="images">
              <Route index element={<CategoryPage categoryKey="images" />} />
              <Route path="compress" element={<ImageCompressPage />} />
              <Route path="resize" element={<ImageResizePage />} />
              <Route path="convert" element={<ImageConvertPage />} />
              <Route path="base64" element={<ImageBase64Page />} />
              <Route path="remove-bg" element={<ImageRemoveBackgroundPage />} />
              <Route path="color-picker" element={<ImageColorPickerPage />} />
            </Route>
            <Route path="text">
              <Route index element={<CategoryPage categoryKey="text" />} />
              <Route path="counter" element={<TextCounterPage />} />
              <Route path="case" element={<TextCasePage />} />
              <Route path="lorem" element={<LoremPage />} />
              <Route path="json" element={<JsonFormatterPage />} />
              <Route path="base64" element={<TextBase64Page />} />
              <Route path="url" element={<UrlToolsPage />} />
              <Route path="password" element={<PasswordGeneratorPage />} />
              <Route path="uuid" element={<UuidGeneratorPage />} />
              <Route path="hash" element={<HashGeneratorPage />} />
            </Route>
            <Route path="video">
              <Route index element={<CategoryPage categoryKey="video" />} />
              <Route path=":platform" element={<VideoDownloaderPage />} />
            </Route>
            <Route path="creators">
              <Route index element={<CategoryPage categoryKey="creators" />} />
              <Route path=":toolKey" element={<CreatorToolPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
