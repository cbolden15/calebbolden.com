'use client';

import DemoEnhancement from '../DemoEnhancement';
import type { CenterFixtureDTO } from '@/lib/work/demos/control-center';

const loadControlCenter = () => import('./ControlCenterInteractive');

export default function ControlCenterDemo({ fixture }: { fixture: CenterFixtureDTO }) {
  return <DemoEnhancement load={loadControlCenter} componentProps={{ fixture }} />;
}
