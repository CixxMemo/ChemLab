import { describe, expect, it } from 'vitest';
import { getLaboratoryPath, getModePath, getSharedExperimentPath, getTaskListPath, getTaskPath, getTopicPath, resolveRoute } from './routes';

describe('client-side routes', () => {
  it('opens the landing page at the root', () => {
    expect(resolveRoute('/')).toEqual({ kind: 'home', mode: 'free' });
  });

  it('opens distinct student and teacher entries', () => {
    expect(resolveRoute(getModePath('student'))).toEqual({ kind: 'mode', mode: 'student' });
    expect(resolveRoute(getModePath('teacher'))).toEqual({ kind: 'mode', mode: 'teacher' });
  });

  it('supports direct sandbox and role-aware experiment links', () => {
    expect(resolveRoute(getLaboratoryPath('free'))).toEqual({ kind: 'laboratory', mode: 'free', scenarioId: null });
    expect(resolveRoute(getLaboratoryPath('student', 'hf'))).toEqual({ kind: 'laboratory', mode: 'student', scenarioId: 'hf' });
    expect(resolveRoute(getLaboratoryPath('teacher', 'nacl'))).toEqual({ kind: 'laboratory', mode: 'teacher', scenarioId: 'nacl' });
  });

  it('normalizes trailing slashes and rejects unavailable routes', () => {
    expect(resolveRoute('/ogrenci/')).toEqual({ kind: 'mode', mode: 'student' });
    expect(resolveRoute(getTopicPath('student', 'iyonik-bag'))).toEqual({ kind: 'topic', mode: 'student', topicId: 'iyonik-bag' });
    expect(resolveRoute(getTopicPath('teacher', 'iyonik-bag'))).toEqual({ kind: 'topic', mode: 'teacher', topicId: 'iyonik-bag' });
    expect(resolveRoute('/deney/%')).toEqual({ kind: 'not-found', mode: 'free' });
  });

  it('opens student-only guided task routes', () => {
    expect(resolveRoute(getTaskListPath())).toEqual({ kind: 'task-list', mode: 'student' });
    expect(resolveRoute(getTaskPath('hf-yanilgisi'))).toEqual({ kind: 'task', mode: 'student', taskId: 'hf-yanilgisi' });
    expect(resolveRoute('/ogretmen/gorevler')).toEqual({ kind: 'not-found', mode: 'free' });
  });

  it('routes shared experiments to the student prediction flow', () => {
    expect(resolveRoute(getSharedExperimentPath('hf'))).toEqual({ kind: 'shared-experiment', mode: 'student', scenarioId: 'hf', taskId: null });
    expect(resolveRoute(getSharedExperimentPath('hf', 'hf-yanilgisi'))).toEqual({ kind: 'shared-experiment', mode: 'student', scenarioId: 'hf', taskId: 'hf-yanilgisi' });
    expect(resolveRoute('/ogrenci/rehberli-deney/hf/gorev/')).toEqual({ kind: 'not-found', mode: 'free' });
    expect(resolveRoute('/ogrenci/rehberli-deney/hf/gorev/%')).toEqual({ kind: 'not-found', mode: 'free' });
  });
});
