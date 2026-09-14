import StormStatistics from "@/lib/components/StormStatistics";
import type { Storm } from "@/lib/types";

interface StatisticsSectionProps {
  storms: Storm[];
  showRecurrence?: boolean;
}

/** The full page's Statistics card; the detail modals show the same content in their Stats tab. */
const StatisticsSection = ({ storms, showRecurrence = true }: StatisticsSectionProps) => {
  if (storms.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">Statistics</h2>
      <StormStatistics storms={storms} showGap={showRecurrence} idPrefix="statistics-tab" />
    </section>
  );
};

export default StatisticsSection;
