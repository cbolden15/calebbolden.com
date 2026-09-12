'use client';

import DemoEnhancement from '../DemoEnhancement';
import type { PrismFixtureDTO } from '@/lib/work/demos/prism';

const loadPrism = () => import('./PrismInteractive');

export default function PrismDemo({ fixture }: { fixture: PrismFixtureDTO }) {
  return <DemoEnhancement load={loadPrism} componentProps={{ fixture }} />;
}
