import { getSale } from '@src/api/nfts.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const TokenDetailContext = createContext(null);

const TokenDetailProvider = ({ children }) => {
  const qc = useQueryClient();
  const { hash } = useParams();

  const { data, isLoading } = useQuery(['saleInfo', hash], () => getSale(hash), { enabled: !!hash });

  const token = useMemo(() => (data ? { ...JSON.parse(data.metadata ?? ''), ...data } : {}), [data]);

  const reloadToken = () => qc.invalidateQueries(['saleInfo', hash]);

  return (
    <TokenDetailContext.Provider value={{ token, isLoading, reloadToken }}>{children}</TokenDetailContext.Provider>
  );
};

export default TokenDetailProvider;
