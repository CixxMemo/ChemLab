import React from 'react';
import { LearningTopic } from '../../data/learningTopics';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useLessonSessionStore } from '../../store/useLessonSessionStore';
import { BondType } from '../../types/chemistry';
import { BUTTON, PANEL } from './lessonStyles';

export const BOND_CHOICES: readonly { value: BondType; label: string }[] = [
  { value: 'ionic', label: 'İyonik' },
  { value: 'polar-covalent', label: 'Polar kovalent' },
  { value: 'nonpolar-covalent', label: 'Apolar kovalent' },
  { value: 'no-bond', label: 'Bağ oluşmaz' }
];

export const PredictionStep: React.FC<{ topic: LearningTopic }> = ({ topic }) => {
  const scenario = useChemistryStore(state => state.scenarios.find(item => item.id === topic.experimentIds[0]));
  const analysis = useChemistryStore(state => state.bondAnalysis);
  const choice = useLessonSessionStore(state => state.choice);
  const choose = useLessonSessionStore(state => state.choose);
  const reveal = useLessonSessionStore(state => state.reveal);
  const play = useChemistryStore(state => state.setPlaybackStatus);
  if (!scenario) return null;

  const submit = () => {
    if (!choice || !analysis) return;
    reveal();
    play('playing');
  };

  return <section className={PANEL} aria-labelledby="prediction-title">
    <h2 id="prediction-title" className="text-xl font-semibold">Tahmin Et ve Gör</h2>
    <p className="mt-2 text-slate-300">{scenario.reactantKeys.join(' + ')} atomları için hangi bağ sonucu beklenir?</p>
    <fieldset className="mt-5 grid gap-2 sm:grid-cols-2">
      <legend className="sr-only">Bağ türü tahmini</legend>
      {BOND_CHOICES.map(option => <label key={option.value} className="touch-target flex cursor-pointer items-center gap-3 rounded border border-slate-700 bg-slate-950 px-4 py-3 has-[:checked]:border-chem-transition">
        <input type="radio" name="bond-prediction" value={option.value} checked={choice === option.value} onChange={() => choose(option.value)} className="accent-sky-400" />{option.label}
      </label>)}
    </fieldset>
    <button type="button" disabled={!choice || !analysis} onClick={submit} className={`${BUTTON} mt-5 disabled:cursor-not-allowed disabled:opacity-50`}>Tahmini onayla ve deneyi aç</button>
  </section>;
};
