import { useCurrentUserQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useIsAuth = () => {
  const router = useRouter();
  const { data, loading } = useCurrentUserQuery();

  useEffect(() => {
    if (!loading && !data?.currentUser) {
      router.replace('/login?next=' + router.query);
    }
  }, [loading, data, router]);
};
