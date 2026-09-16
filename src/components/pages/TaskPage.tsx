import React from 'react';
import { getLearningTask, LearningTask, LearningTaskOption } from '../../data/learningTasks';
import { isCorrectTaskChoice, TaskEvaluationContext } from '../../lib/chemistry/taskEvaluation';
import { resolveBond } from '../../lib/chemistry/bondResolver';
import { getLaboratoryPath, getTaskListPath } from '../../navigation/routes';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { useTaskSessionStore } from '../../store/useTaskSessionStore';
import { ElementData, ReactionScenario } from '../../types/chemistry';
import { AppLink } from '../navigation/AppLink';
import { NotFoundPage } from './NotFoundPage';

interface TaskPageProps { taskId: string }

const REACTANT_PAIR_SIZE = 2; // A task evaluates the same two selected reactants as the simulator.

function getTaskContext(
  task: LearningTask,
  scenarios: readonly ReactionScenario[],
  elements: Readonly<Record<string, ElementData>>
): TaskEvaluationContext | null {
  const scenario = scenarios.find(item => item.id === task.scenarioId);
  if (!scenario) return null;
  const atoms = scenario.reactantKeys.slice(0, REACTANT_PAIR_SIZE).map(symbol =>
    Object.values(elements).find(element => element.symbol === symbol));
  const [first, second] = atoms;
  if (!first || !second) return null;
  return { analysis: resolveBond(first, second), elements: Object.values(elements) };
}

const TaskAnswers: React.FC<{ task: LearningTask; context: TaskEvaluationContext }> = ({ task, context }) => {
  const session = useTaskSessionStore();
  const completeTask = useLearningProgressStore(state => state.completeTask);
  const current = session.taskId === task.id ? session : null;
  const selected = task.options.find(option => option.value === current?.selectedValue);

  const answer = (option: LearningTaskOption) => {
    const correct = isCorrectTaskChoice(task, option, context);
    session.answer(task.id, option.value, correct);
    if (correct) completeTask(task.id);
  };

  return <section className="mt-6 rounded border border-slate-700 bg-slate-900 p-5" aria-labelledby="task-question">
    <h2 id="task-question" className="text-xl font-semibold">{task.prompt}</h2>
    <p className="mt-2 text-sm text-slate-400">İpucu: {task.hint}</p>
    <div className="mt-5 grid gap-3">
      {task.options.map(option => <button key={option.value} type="button" disabled={current?.correct} onClick={() => answer(option)} className="touch-target rounded border border-slate-700 bg-slate-950 px-4 py-3 text-left hover:border-chem-transition disabled:cursor-default disabled:opacity-70">{option.label}</button>)}
    </div>
    {selected && <div role="status" className={`mt-5 rounded border p-4 text-sm ${current?.correct ? 'border-chem-nonmetal' : 'border-chem-alkaline'}`}>
      <p className="font-semibold">{current?.correct ? 'Doğru! Görev tamamlandı.' : 'Henüz değil. Yeniden deneyebilirsin.'}</p>
      <p className="mt-2">{current?.correct ? task.successExplanation : selected.misconception}</p>
    </div>}
    {current?.correct && <AppLink to={getLaboratoryPath('student', task.scenarioId)} className="touch-target mt-5 inline-flex items-center rounded border border-chem-transition px-4 text-chem-transition hover:bg-slate-800">İlgili deneyi incele →</AppLink>}
  </section>;
};

export const TaskPage: React.FC<TaskPageProps> = ({ taskId }) => {
  const task = getLearningTask(taskId);
  const scenarios = useChemistryStore(state => state.scenarios);
  const elements = useChemistryStore(state => state.elements);
  const context = task ? getTaskContext(task, scenarios, elements) : null;
  if (!task || !context) return <NotFoundPage reason="content" />;

  return <div className="h-full overflow-y-auto bg-slate-950 text-slate-50">
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10">
      <AppLink to={getTaskListPath()} className="touch-target inline-flex items-center text-sm text-chem-transition">← Görev listesine dön</AppLink>
      <p className="mt-5 font-mono text-xs text-chem-transition">Rehberli görev</p>
      <h1 id="route-heading" tabIndex={-1} className="mt-2 text-3xl font-semibold outline-none">{task.title}</h1>
      <TaskAnswers task={task} context={context} />
    </div>
  </div>;
};
