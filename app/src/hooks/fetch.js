import { replaceIPFS } from '@src/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';

export const DEFAULT_IPFS_RESOLVER_OPTIONS = {
  gatewayUrl: 'https://gateway.ipfs.io/ipfs/',
};

export const fetchMediaType = async (url) => {
  if (typeof url === 'undefined') return Promise.reject(new Error('Invalid id'));
  // const { data, headers } = await axios.head(url.startsWith?.('ipfs://') ? replaceIPFS(url) : url, {
  //   headers: {
  //     'Cache-Control': 'no-cache',
  //   },
  // });

  const { data, headers } = await axios.get(url.startsWith?.('ipfs://') ? replaceIPFS(url) : url, {
    responseType: 'blob',
    headers: {
      Range: 'bytes=1-10',
      'Cache-Control': 'no-cache',
    },
  });
  return { data, type: headers['content-type'] };
};

export function resolveIpfsUri(uri, options = DEFAULT_IPFS_RESOLVER_OPTIONS) {
  if (!uri) {
    return '';
  }
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', options.gatewayUrl);
  }
  return uri;
}

export const useFetchMediaType = (key, _url) => {
  const [type, setType] = useState();
  const [isGif, setIsGif] = useState(false);
  const { data, isLoading, refetch } = useQuery(key, () => fetchMediaType(_url), {
    onSuccess: (data) => {
      if (data && data.type && typeof data.type === 'string') {
        setType(data.type.split('/')[0]);
      }
    },
  });

  useEffect(() => {
    if (data && data.type) {
      const types = data.type.split('/');
      setType(types[0]);
      if (types[1] === 'gif') {
        setIsGif(true);
      } else {
        setIsGif(false);
      }
    }
  }, [data]);

  return {
    type: type ?? 'image',
    isLoading,
    reload: refetch,
    isGif,
    url: _url ? (typeof _url === 'string' ? replaceIPFS(_url) : URL.createObjectURL(_url)) : '/images/no-image.png',
    mime: data?.type,
  };
};

export function useResolvedMediaType(uri, mimeType) {
  const [type, setType] = useState();

  const resolvedUrl = useMemo(() => resolveIpfsUri(uri), [uri]);
  const { data: resolvedMimeType, isLoading } = useQuery(
    ['mime-type', resolvedUrl],
    () => fetchMediaType(resolvedUrl),
    {
      enabled: !!resolvedUrl && !mimeType,
      onSuccess: (data) => {
        if (data && data.type && typeof data.type === 'string') {
          setType(data.type.split('/')[0]);
        }
      },
    }
  );
  const _type = useMemo(
    () => (resolvedMimeType ? resolvedMimeType.type?.split('/')[0] : type),
    [resolvedMimeType, type]
  );
  const isGif = useMemo(() => resolvedMimeType?.type?.split('/')[1] === 'gif', [resolvedMimeType]);

  return {
    url: resolvedUrl,
    mimeType: resolvedMimeType?.type,
    type: _type,
    isGif,
    isLoading,
  };
}

export default useFetchMediaType;
