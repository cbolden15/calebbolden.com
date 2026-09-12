'use client';

import DemoEnhancement from '../DemoEnhancement';
import type { AgentConfigFixtureDTO } from '@/lib/work/demos/agent-config';

const loadAgentConfig = () => import('./AgentConfigInteractive');

export default function AgentConfigDemo({ fixture }: { fixture: AgentConfigFixtureDTO }) {
  return <DemoEnhancement load={loadAgentConfig} componentProps={{ fixture }} />;
}
