import { useRef } from 'react';
import { LandingHero } from '../landing/LandingHero';
import { LearningPath } from '../landing/LearningPath';
import { LearningModes } from '../landing/LearningModes';
import { LandingGuide } from '../landing/LandingGuide';
import { LEARNING_PATH_ID } from '../landing/landingStyles';

export function LandingPage() {
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const exploreTopics = () => {
    const container = scrollContainer.current;
    const section = container?.querySelector<HTMLElement>(`#${LEARNING_PATH_ID}`);
    if (!container || !section) return;
    // Scroll only the page pane; native fragment scrolling also displaces the fixed app header.
    container.scrollTo({
      top: container.scrollTop + section.getBoundingClientRect().top - container.getBoundingClientRect().top
    });
    section.focus({ preventScroll: true });
  };

  return (
    <div ref={scrollContainer} className="h-full overflow-y-auto bg-slate-950 text-slate-50">
      <div className="mx-auto w-full max-w-7xl space-y-16 px-5 py-8 md:space-y-20 md:px-10 md:py-12">
        <LandingHero onExploreTopics={exploreTopics} />
        <LearningPath />
        <LearningModes />
        <LandingGuide />
      </div>
    </div>
  );
}
