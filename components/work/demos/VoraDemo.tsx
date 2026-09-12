'use client';

import DemoEnhancement from '../DemoEnhancement';
import type { VoraFixtureDTO } from '@/lib/work/demos/vora';

const loadVora = () => import('./VoraInteractive');
export default function VoraDemo({ fixture }: { fixture: VoraFixtureDTO }) {
  return <DemoEnhancement load={loadVora} componentProps={{ fixture }} />;
}
