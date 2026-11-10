/**
 * Where the route starts on an inner page (handoff services / service screens): the Signal dot sets off, a
 * straight line runs to the inline end, then turns down into the page rail of the next section. It sits in the
 * page hero (a section without its own rail); the corner's vertical leg runs to the hero's bottom edge.
 * Motion (styles/motion.css, CSS from first paint): the dot pops, the line grows, the turn appears and grows down.
 * Decorative only.
 */
export function RouteStart() {
  return (
    <div aria-hidden="true" className="-me-[calc(var(--page-margin)/2)] mt-2 flex h-12 items-start">
      <span className="hero-route-dot -mt-[calc((var(--dot)-var(--route-stroke))/2)] size-(--dot) shrink-0 rounded-dot bg-accent-signal [--dot:14px] md:[--dot:18px] lg:[--dot:22px]" />
      <span className="hero-route-line ms-2 h-(--route-stroke) flex-1 bg-route-line lg:ms-3" />
      <span className="hero-route-turn relative size-(--route-corner) shrink-0 rounded-se-(--route-corner) border-e-(length:--route-stroke) border-t-(length:--route-stroke) border-route-line">
        <span className="hero-route-ext absolute -end-(--route-stroke) top-full h-[4000px] w-(--route-stroke) bg-route-line" />
      </span>
    </div>
  );
}
