import { Suspense } from 'react';
import { FullScreenLoader } from './ProtectedRoute';

export default function Lazy({ children }) {
  return <Suspense fallback={<FullScreenLoader />}>{children}</Suspense>;
}