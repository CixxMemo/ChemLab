import React from 'react';
import { LearningTopic } from '../../data/learningTopics';
import { TeacherFlow } from '../../data/teacherFlows';
import { RevealPolicy } from '../../presentation/revealPolicy';
import { ReactionScenario } from '../../types/chemistry';
import { TeacherExitTicket } from './TeacherExitTicket';

interface TeacherLessonGuideProps {
  topic: LearningTopic;
  flow: TeacherFlow;
  scenario: ReactionScenario;
  reveal: RevealPolicy;
}

export const TeacherLessonGuide: React.FC<TeacherLessonGuideProps> = ({ topic, flow, scenario, reveal }) => (
  <details className="shrink-0 border-b border-slate-700 bg-slate-900 px-5 py-2 text-base text-slate-50">
    <summary className="touch-target flex cursor-pointer items-center text-lg font-semibold">Öğretmen ders planı · aç/kapat</summary>
    <h2 className="mt-2 text-xl font-semibold">{topic.title}</h2>
    <ol className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      <li><strong>1. Hedef:</strong> {topic.objective}</li>
      <li><strong>2. Başlangıç sorusu:</strong> {flow.openingQuestion}</li>
      <li><strong>3. Deney:</strong> {scenario.reactantKeys.join(' + ')}</li>
      <li><strong>4. Tahmin:</strong> {flow.predictionPrompt}</li>
      <li><strong>5. Açıklama:</strong> {flow.explanationPrompt}{reveal.explanation ? ` Sık karıştırılan: ${topic.misconception}` : ' Kavram yanılgısı perde arkasında.'}</li>
      <li><strong>6. Çıkış bileti:</strong> {flow.exitTicket}</li>
    </ol>
    <TeacherExitTicket questions={topic.questions} revealed={reveal.explanation} />
  </details>
);
