import { describe, expect, it } from 'vitest';
import { getLaboratoryPath, getModePath, resolveRoute } from './routes';

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
    expect(resolveRoute('/ogrenci/konu/iyonik-bag')).toEqual({ kind: 'reserved', mode: 'student' });
    expect(resolveRoute('/ogretmen/ders/iyonik-bag')).toEqual({ kind: 'reserved', mode: 'teacher' });
    expect(resolveRoute('/deney/%')).toEqual({ kind: 'not-found', mode: 'free' });
  });
});
