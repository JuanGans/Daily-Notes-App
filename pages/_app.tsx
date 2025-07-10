// _app.tsx
import '../styles/globals.css'; // ✅ global stylesheet
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </>
  );
}
