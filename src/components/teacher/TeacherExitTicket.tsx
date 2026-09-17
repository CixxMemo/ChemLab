import React from 'react';
import { LearningQuestion } from '../../data/learningTopics';

interface TeacherExitTicketProps {
  questions: readonly LearningQuestion[];
  revealed: boolean;
}

export const TeacherExitTicket: React.FC<TeacherExitTicketProps> = ({ questions, revealed }) => (
  <section aria-label="Üç soruluk çıkış bileti" className="mt-4 rounded border border-slate-600 bg-slate-950 p-4">
    <h3 className="text-lg font-semibold">Üç soruluk çıkış bileti</h3>
    <ol className="mt-3 grid gap-3 md:grid-cols-3">
      {questions.map(question => <li key={question.id} className="rounded border border-slate-700 p-3">
        <p className="font-semibold">{question.prompt}</p>
        <ol className="mt-2 list-inside list-[upper-alpha] text-slate-200">
          {question.options.map(option => <li key={option}>{option}</li>)}
        </ol>
        {revealed && <p className="mt-2 border-t border-slate-600 pt-2 text-slate-100">
          Yanıt: {question.options[question.correctIndex]}. {question.explanation}
        </p>}
      </li>)}
    </ol>
  </section>
);
