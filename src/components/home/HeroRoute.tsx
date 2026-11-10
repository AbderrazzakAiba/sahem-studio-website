import { Fragment } from "react";

type Props = {
  /** The four station names (the process steps), in order. */
  stations: string[];
  rtl: boolean;
};

/*
 * Desktop band geometry from the handoff (viewBox 1320×220). The English screen is the exact mirror
 * (x → 1320 − x), so one set of numbers serves both directions.
 */
const W = 1320;
const PATH_RTL = "M1286 30H820A40 40 0 0 0 780 70V90A40 40 0 0 1 740 130H42.5A40 40 0 0 0 2.5 170V222";
const PATH_LTR = "M34 30H500A40 40 0 0 1 540 70V90A40 40 0 0 0 580 130H1277.5A40 40 0 0 1 1317.5 170V222";
const STATIONS_RTL = [
  { x: 1100, y: 30 },
  { x: 940, y: 30 },
  { x: 560, y: 130 },
  { x: 360, y: 130 },
];
/** Tablet / mobile: station positions along the straight line, from the start. */
const COMPACT = [
  { sm: "18%", md: "12%" },
  { sm: "42%", md: "36%" },
  { sm: "66%", md: "60%" },
  { sm: "90%", md: "84%" },
];

/**
 * The hero route (handoff D-023, "hero stays as designed"): the Signal dot sets off, passes the four stations
 * and turns down into the page rail. Desktop draws the stepped band; tablet a straight line with labelled
 * stations; mobile the same line without labels. Each version ends in a corner whose vertical leg runs down
 * to the bottom of the hero and meets the first section's rail. Decorative — the steps are listed in Process.
 * Static here; the draw-on animation comes with the motion phase.
 */
export function HeroRoute({ stations, rtl }: Props) {
  const x = (v: number) => (rtl ? v : W - v);

  return (
    <>
      {/* Desktop ≥1024 */}
      <div aria-hidden="true" className="relative -me-[calc(var(--page-margin)/2)] max-lg:hidden">
        <svg viewBox={`0 0 ${W} 220`} className="block w-full overflow-visible" focusable="false">
          <path
            d={rtl ? PATH_RTL : PATH_LTR}
            fill="none"
            strokeWidth={5}
            vectorEffect="non-scaling-stroke"
            className="stroke-route-line"
          />
          <circle cx={x(1306)} cy={30} r={11} className="fill-accent-signal" />
          <g strokeWidth={3} className="fill-route-node stroke-route-line">
            {STATIONS_RTL.map((s) => (
              <circle key={s.x} cx={x(s.x)} cy={s.y} r={9} />
            ))}
          </g>
          <g textAnchor="middle">
            {STATIONS_RTL.map((s, i) => (
              <Fragment key={s.x}>
                <text
                  x={x(s.x)}
                  y={s.y - 22}
                  fontSize={12}
                  letterSpacing={1.5}
                  className="fill-text-secondary font-latin"
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
                <text
                  x={x(s.x)}
                  y={s.y + 38}
                  fontSize={rtl ? 17 : 15}
                  fontWeight={rtl ? 400 : 500}
                  direction={rtl ? "rtl" : "ltr"}
                  className="fill-text-primary"
                >
                  {stations[i]}
                </text>
              </Fragment>
            ))}
          </g>
        </svg>
        <span className="absolute end-0 top-full h-[4000px] w-(--route-stroke) bg-route-line" />
      </div>

      {/* Tablet and mobile <1024 */}
      <div aria-hidden="true" className="-me-[calc(var(--page-margin)/2)] flex h-10 items-start md:h-19 lg:hidden">
        <span className="-mt-[5.5px] size-3.5 shrink-0 rounded-dot bg-accent-signal md:-mt-[7px] md:size-4.5" />
        <span className="relative ms-1.5 h-(--route-stroke) flex-1 bg-route-line md:ms-2">
          {COMPACT.map((p, i) => (
            <Fragment key={p.md}>
              <span
                style={{ "--p-sm": p.sm, "--p-md": p.md } as React.CSSProperties}
                className="absolute start-(--p-sm) -top-[5px] size-[13px] rounded-dot border-[2.5px] border-route-line bg-route-node md:start-(--p-md) md:-top-1.5 md:size-[15px] md:border-[3px]"
              />
              <span
                style={{ "--p-md": `calc(${p.md} + 7.5px)` } as React.CSSProperties}
                className="absolute start-(--p-md) top-[22px] flex flex-col items-center gap-0.5 text-[14px] whitespace-nowrap max-md:hidden ltr:-translate-x-1/2 rtl:translate-x-1/2"
              >
                <span lang="en" className="font-latin text-[11px] tracking-[0.12em]! text-text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {stations[i]}
              </span>
            </Fragment>
          ))}
        </span>
        <span className="relative size-(--route-corner) shrink-0 rounded-se-(--route-corner) border-e-(length:--route-stroke) border-t-(length:--route-stroke) border-route-line">
          <span className="absolute -end-(--route-stroke) top-full h-[4000px] w-(--route-stroke) bg-route-line" />
        </span>
      </div>
    </>
  );
}
