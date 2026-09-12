import { prismFixtureSchema } from './demos/prism';

const expectedEvents = [
  'goal.accepted',
  'provider.tool-requested',
  'policy.allowed',
  'tool.completed',
  'provider.finalized',
  'run.completed',
] as const;

const expectedPlugins = ['local-scripted', 'allow-text-stats', 'text-stats', 'local-scripted'] as const;

/** Pinned source facts stay on the server trust boundary, outside the client-safe model. */
export const prismContractFixtureSchema = prismFixtureSchema.superRefine((fixture, context) => {
  const scenario = fixture.scenarios[0];
  if (!scenario) return;
  const reject = (message: string) => context.addIssue({ code: 'custom', message: `Prism v0.1.0 contract: ${message}` });

  if (scenario.prompt !== 'Count the words in: one two three') reject('prompt changed');
  if (scenario.result !== '3 words') reject('result changed');
  if (scenario.receipt.terminal.answer !== '3 words') reject('terminal answer changed');

  for (const [index, expected] of expectedEvents.entries()) {
    if (scenario.events[index]?.type !== expected) reject(`event ${index + 1} must be ${expected}`);
  }

  if (scenario.receipt.limits.providerTurns !== 2) reject('providerTurns limit must be 2');
  if (scenario.receipt.limits.toolCalls !== 1) reject('toolCalls limit must be 1');

  if (scenario.lifecycleContract.plugins.length !== expectedPlugins.length) reject('lifecycle plugin count must be 4');
  for (const [index, expected] of expectedPlugins.entries()) {
    const plugin = scenario.lifecycleContract.plugins[index];
    if (!plugin) continue;
    if (plugin.pluginId !== expected) reject(`lifecycle plugin ${index + 1} must be ${expected}`);
    if (!plugin.confirmedAbsent) reject(`lifecycle plugin ${index + 1} must be confirmed absent`);
    if (plugin.cleanupErrors.length !== 0) reject(`lifecycle plugin ${index + 1} must have no cleanup errors`);
    if (plugin.exitCode !== 0) reject(`lifecycle plugin ${index + 1} must have exit code 0`);
    if (plugin.oomKilled === true) reject(`lifecycle plugin ${index + 1} must not be OOM-killed`);
  }
});
