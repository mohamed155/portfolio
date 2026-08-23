// organisms/Capabilities/Capabilities.island.tsx — client:visible (below the
// fold on every viewport). Hand-rolls TabButton/Chip/Badge/SectionHeader
// markup rather than importing the .astro atoms/molecules, the same
// constraint Header.island.tsx works under.
import { useRef, useState } from 'react';
import { CATS } from '../../../lib/capabilities';

export default function CapabilitiesIsland() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cat = CATS[active];

  function move(delta: number) {
    const next = (active + delta + CATS.length) % CATS.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
  }

  return (
    <section id="skills" data-section="skills" className="border-t border-t-bd2 py-[84px]">
      <div data-reveal className="mb-8 flex items-baseline gap-[18px] border-b border-b-bd pb-[14px]">
        <span className="text-[11px] tracking-caps text-ac">02</span>
        <h2 className="font-display text-body-xs font-bold uppercase tracking-caps-widest text-fg">capabilities</h2>
        <span className="ml-auto text-label-sm tracking-caps text-fg3">06 domains</span>
      </div>

      <h3 data-reveal className="m-0 max-w-[24ch] font-display text-h2-tight font-bold leading-[1.14] tracking-heading text-fg">
        Specialized engineering capabilities.
      </h3>
      <p data-reveal className="mt-4 max-w-[66ch] text-body leading-[1.8] text-fg2">
        Grouped by engineering domain. Frontend architecture is the primary specialty; full-stack and AI are supporting capabilities.
      </p>

      <div className="mt-10 grid grid-cols-[284px_1fr] border border-bd to-lg:grid-cols-1">
        <div
          role="tablist"
          aria-label="Capability areas"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-col border-r border-r-bd bg-panel to-lg:flex-row to-lg:overflow-x-auto to-lg:border-r-0 to-lg:border-b to-lg:border-b-bd"
        >
          {CATS.map((c, i) => (
            <button
              key={c.name}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`cap-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`cap-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`flex min-h-[50px] w-full flex-none items-center gap-[9px] border-b border-b-bd px-[18px] py-[15px] text-left text-body-xs tracking-ui transition-colors duration-[180ms] to-lg:w-auto to-lg:border-b-0 ${
                i === active ? 'bg-ac font-semibold text-acfg' : 'text-fg2'
              }`}
            >
              <span className="w-[1em] flex-none" aria-hidden="true">{i === active ? '>' : c.primary ? '*' : ''}</span>
              <span className="flex-1">{c.name}</span>
              <span className="flex-none text-label-sm opacity-65">{String(c.skills.length).padStart(2, '0')}</span>
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`cap-panel-${active}`}
          aria-labelledby={`cap-tab-${active}`}
          className="min-h-[340px] bg-bg p-[clamp(22px,3vw,34px)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-b-bd pb-4">
            <h4 className="m-0 font-display text-h4 font-bold tracking-tight2 text-fg">{cat.name}</h4>
            <span className={`inline-flex items-center border px-2 py-[3px] text-micro uppercase tracking-[.12em] ${
              cat.primary ? 'border-ac bg-transparent text-ac' : 'border-bd bg-transparent text-fg3'
            }`}>{cat.level}</span>
          </div>

          <p className="mt-5 max-w-[66ch] text-body leading-[1.8] text-fg2">{cat.blurb}</p>

          <div key={active} className="mt-[26px] flex flex-wrap gap-2">
            {cat.skills.map((s, si) => (
              <span
                key={s}
                style={{ animation: 'rise .3s cubic-bezier(.2,.8,.2,1) both', animationDelay: `${si * 30}ms` }}
                className={`inline-flex items-center border tracking-[.04em] ${
                  si < cat.lead
                    ? 'gap-2 border-ac bg-acdim px-[13px] py-[9px] text-body-xs font-medium text-fg'
                    : 'gap-2 border-bd bg-transparent px-[11px] py-2 text-label text-fg2'
                }`}
              >{s}</span>
            ))}
          </div>

          <div className="mt-[30px] flex flex-wrap items-baseline gap-[14px] border-t border-t-bd pt-[18px]">
            <span className="text-[10px] uppercase tracking-caps-wide text-ac">applied in</span>
            <span className="text-body-xs leading-[1.7] text-fg2">{cat.applied}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
