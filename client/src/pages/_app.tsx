import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // Tambahkan API key ke pageProps jika berjalan di server
  if (typeof window === 'undefined') {
    pageProps.apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY;
  }
  
  return <Component {...pageProps} />;
}

export default MyApp;