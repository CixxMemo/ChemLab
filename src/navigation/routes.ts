export type ExperienceMode = 'free' | 'student' | 'teacher';

export type AppRoute =
  | { kind: 'home'; mode: 'free' }
  | { kind: 'mode'; mode: 'student' | 'teacher' }
  | { kind: 'laboratory'; mode: ExperienceMode; scenarioId: string | null }
  | { kind: 'reserved'; mode: 'student' | 'teacher' }
  | { kind: 'not-found'; mode: 'free' };

const MODE_SLUGS = {
  student: 'ogrenci',
  teacher: 'ogretmen'
} as const;

const STATIC_ROUTES: Readonly<Record<string, AppRoute>> = {
  '/': { kind: 'home', mode: 'free' },
  '/ogrenci': { kind: 'mode', mode: 'student' },
  '/ogretmen': { kind: 'mode', mode: 'teacher' }
};

const LABORATORY_ROUTE = /^\/(?:(?<mode>ogrenci|ogretmen)\/)?laboratuvar$/;
const EXPERIMENT_ROUTE = /^\/(?:(?<mode>ogrenci|ogretmen)\/)?deney\/(?<scenarioId>[a-z0-9_-]+)$/;
const STUDENT_TOPIC_ROUTE = /^\/ogrenci\/konu\/[a-z0-9_-]+$/;
const TEACHER_LESSON_ROUTE = /^\/ogretmen\/ders\/[a-z0-9_-]+$/;

function parseMode(segment: string | undefined): ExperienceMode {
  const modes: Readonly<Record<string, ExperienceMode>> = {
    ogrenci: 'student',
    ogretmen: 'teacher'
  };
  return segment ? modes[segment] ?? 'free' : 'free';
}

export function resolveRoute(pathname: string): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const staticRoute = STATIC_ROUTES[normalized];
  if (staticRoute) return staticRoute;
  if (STUDENT_TOPIC_ROUTE.test(normalized)) return { kind: 'reserved', mode: 'student' };
  if (TEACHER_LESSON_ROUTE.test(normalized)) return { kind: 'reserved', mode: 'teacher' };

  const laboratoryMatch = normalized.match(LABORATORY_ROUTE);
  if (laboratoryMatch) {
    return { kind: 'laboratory', mode: parseMode(laboratoryMatch.groups?.mode), scenarioId: null };
  }

  const experimentMatch = normalized.match(EXPERIMENT_ROUTE);
  if (experimentMatch) {
    return {
      kind: 'laboratory',
      mode: parseMode(experimentMatch.groups?.mode),
      scenarioId: experimentMatch.groups?.scenarioId ?? null
    };
  }

  return { kind: 'not-found', mode: 'free' };
}

export function getModePath(mode: 'student' | 'teacher'): string {
  return `/${MODE_SLUGS[mode]}`;
}

export function getLaboratoryPath(mode: ExperienceMode, scenarioId?: string): string {
  const prefix = mode === 'free' ? '' : getModePath(mode);
  return scenarioId ? `${prefix}/deney/${scenarioId}` : `${prefix}/laboratuvar`;
}
