import "@/styles/globals.css";
import { usePreload } from '../hooks/usePreload';
import PreloadStatus from '../components/PreloadStatus';

export default function App({ Component, pageProps }) {
  // Initialize preloading
  usePreload();

  return (
    <>
      <Component {...pageProps} />
      <PreloadStatus />
    </>
  );
}
