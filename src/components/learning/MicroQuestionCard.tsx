import React from 'react';
import { LearningQuestion } from '../../data/learningTopics';
import { useLessonSessionStore } from '../../store/useLessonSessionStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { PANEL } from './lessonStyles';

export const MicroQuestionCard: React.FC<{ question: LearningQuestion; index: number; saveProgress: boolean }> = ({ question, index, saveProgress }) => {
  const selected = useLessonSessionStore(state => state.answers[question.id]);
  const answer = useLessonSessionStore(state => state.answer);
  const recordQuestionResult = useLearningProgressStore(state => state.recordQuestionResult);

  const selectAnswer = (optionIndex: number) => {
    if (selected !== undefined) return;
    answer(question.id, optionIndex);
    if (saveProgress) recordQuestionResult(question.id, optionIndex === question.correctIndex);
  };

  return <fieldset className={PANEL}>
    <legend className="font-semibold">{index + 1}. {question.prompt}</legend>
    <div className="mt-3 grid gap-2">
      {question.options.map((option, optionIndex) => <button key={option} type="button" disabled={selected !== undefined} onClick={() => selectAnswer(optionIndex)} className="touch-target rounded border border-slate-700 bg-slate-950 px-4 py-2 text-left hover:border-chem-transition disabled:cursor-default disabled:opacity-70">{option}</button>)}
    </div>
    {selected !== undefined && <p className="mt-3 text-sm text-slate-200" role="status">
      {selected === question.correctIndex ? 'Doğru.' : `Tekrar düşün: ${question.options[question.correctIndex]}.`} {question.explanation}
    </p>}
  </fieldset>;
};
