import { getLearningTask, LearningTask } from './learningTasks';
import { ReactionScenario } from '../types/chemistry';

interface SharedExperiment {
  readonly scenario: ReactionScenario;
  readonly task: LearningTask | null;
}

export function resolveSharedExperiment(
  scenarios: readonly ReactionScenario[],
  scenarioId: string,
  taskId: string | null
): SharedExperiment | null {
  const scenario = scenarios.find(item => item.id === scenarioId);
  if (!scenario) return null;
  const task = taskId ? getLearningTask(taskId) ?? null : null;
  if (taskId && task?.scenarioId !== scenarioId) return null;
  return { scenario, task };
}
