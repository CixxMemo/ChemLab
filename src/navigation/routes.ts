export type ExperienceMode = 'free' | 'student' | 'teacher';

export type AppRoute =
  | { kind: 'home'; mode: 'free' }
  | { kind: 'mode'; mode: 'student' | 'teacher' }
  | { kind: 'laboratory'; mode: ExperienceMode; scenarioId: string | null }
  | { kind: 'topic'; mode: 'student' | 'teacher'; topicId: string }
  | { kind: 'task-list'; mode: 'student' }
  | { kind: 'task'; mode: 'student'; taskId: string }
  | { kind: 'not-found'; mode: 'free' };

const MODE_SLUGS = {
  student: 'ogrenci',
  teacher: 'ogretmen'
} as const;

const STATIC_ROUTES: Readonly<Record<string, AppRoute>> = {
  '/': { kind: 'home', mode: 'free' },
  '/ogrenci': { kind: 'mode', mode: 'student' },
  '/ogretmen': { kind: 'mode', mode: 'teacher' },
  '/ogrenci/gorevler': { kind: 'task-list', mode: 'student' }
};

const LABORATORY_ROUTE = /^\/(?:(?<mode>ogrenci|ogretmen)\/)?laboratuvar$/;
const EXPERIMENT_ROUTE = /^\/(?:(?<mode>ogrenci|ogretmen)\/)?deney\/(?<scenarioId>[a-z0-9_-]+)$/;
const STUDENT_TOPIC_ROUTE = /^\/ogrenci\/konu\/(?<topicId>[a-z0-9_-]+)$/;
const TEACHER_LESSON_ROUTE = /^\/ogretmen\/ders\/(?<topicId>[a-z0-9_-]+)$/;
const STUDENT_TASK_ROUTE = /^\/ogrenci\/gorev\/(?<taskId>[a-z0-9_-]+)$/;

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
  const studentTopic = normalized.match(STUDENT_TOPIC_ROUTE);
  if (studentTopic) return { kind: 'topic', mode: 'student', topicId: studentTopic.groups?.topicId ?? '' };
  const teacherLesson = normalized.match(TEACHER_LESSON_ROUTE);
  if (teacherLesson) return { kind: 'topic', mode: 'teacher', topicId: teacherLesson.groups?.topicId ?? '' };
  const studentTask = normalized.match(STUDENT_TASK_ROUTE);
  if (studentTask) return { kind: 'task', mode: 'student', taskId: studentTask.groups?.taskId ?? '' };

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

export function getTopicPath(mode: 'student' | 'teacher', topicId: string): string {
  return `${getModePath(mode)}/${mode === 'student' ? 'konu' : 'ders'}/${topicId}`;
}

export function getTaskListPath(): string {
  return '/ogrenci/gorevler';
}

export function getTaskPath(taskId: string): string {
  return `/ogrenci/gorev/${taskId}`;
}

export function getLaboratoryPath(mode: ExperienceMode, scenarioId?: string): string {
  const prefix = mode === 'free' ? '' : getModePath(mode);
  return scenarioId ? `${prefix}/deney/${scenarioId}` : `${prefix}/laboratuvar`;
}
