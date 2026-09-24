export interface AboutStat {
  label: string;
  value: number;
}

// Pulled up over the hero's bottom edge, so the numbers read as part of the introduction.
const StatsStrip = ({ stats }: { stats: AboutStat[] }) => (
  <div className="relative mx-auto -mt-14 max-w-5xl px-4 sm:px-8">
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-lg md:grid-cols-4">
      {stats.map((stat) => (
        // The term comes first for screen readers; the number leads visually.
        <div key={stat.label} className="flex flex-col-reverse bg-white px-4 py-6 text-center">
          <dt className="mt-1 text-sm text-slate-500">{stat.label}</dt>
          <dd className="text-3xl font-bold text-blue-700 tabular-nums md:text-4xl">
            {stat.value.toLocaleString("en-US")}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export default StatsStrip;
