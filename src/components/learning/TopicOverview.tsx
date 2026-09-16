import React from 'react';
import { LearningTopic, getLearningTopic } from '../../data/learningTopics';
import { getTopicPath } from '../../navigation/routes';
import { AppLink } from '../navigation/AppLink';
import { PANEL } from './lessonStyles';

export const TopicOverview: React.FC<{ topic: LearningTopic; mode: 'student' | 'teacher' }> = ({ topic, mode }) => (
  <section className={PANEL}>
    <p className="text-xs font-mono text-chem-transition">Öğrenme hedefi</p>
    <p className="mt-2 text-slate-100">{topic.objective}</p>
    <p className="mt-5 leading-relaxed text-slate-300">{topic.summary}</p>
    {topic.prerequisiteId && <AppLink to={getTopicPath(mode, topic.prerequisiteId)} className="touch-target mt-4 inline-flex items-center text-sm text-chem-transition">Ön koşul: {getLearningTopic(topic.prerequisiteId)?.title}</AppLink>}
    <p className="mt-5 text-xs text-slate-400">İçerik dayanağı: {topic.source} · Son kontrol: {topic.checkedAt}</p>
  </section>
);
