'use client';

import DemoEnhancement from '../DemoEnhancement';
import type { AgentTeamFixtureDTO } from '@/lib/work/demos/agent-team';

const loadAgentTeam = () => import('./AgentTeamInteractive');

export default function AgentTeamDemo({ fixture }: { fixture: AgentTeamFixtureDTO }) {
  return <DemoEnhancement load={loadAgentTeam} componentProps={{ fixture }} />;
}
