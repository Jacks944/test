// components/TopLoadingBar.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const LoadingBar = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      NProgress.start();
    };

    const handleRouteChangeComplete = () => {
      NProgress.done();
    };

    const handleRouteChangeError = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return null;
};

export default LoadingBar;
