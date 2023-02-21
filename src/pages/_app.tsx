import type { AppProps } from 'next/app';

import Head from 'next/head';
import BaseLayout from '@/layouts/Base';
import Providers from '@/components/Providers';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <Head>
        <title>Simple Bookshelf</title>
      </Head>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </Providers>
  );
};

export default App;
