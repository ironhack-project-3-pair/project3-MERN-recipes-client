parent component is rendered first, then children components
but if both have a useEffect hook to make axios requests, requests from children are made first
