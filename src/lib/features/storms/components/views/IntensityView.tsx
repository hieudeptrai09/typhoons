import IntensityGrid from "@/lib/features/storms/components/grids/IntensityGrid";
import { getStormsByIntensity } from "@/lib/features/storms/utils/stats";
import type { DashboardParams, Storm } from "@/lib/types";
import { intensityFromSlug } from "@/lib/utils/intensity";
import StormRowsTable from "./StormRowsTable";

interface IntensityViewProps {
  params: DashboardParams;
  stormsData: Storm[];
}

const IntensityView = ({ params, stormsData }: IntensityViewProps) => {
  // The route rejects any filter that is not an intensity slug, so this only narrows the type.
  const intensity = intensityFromSlug(params.filter);
  if (!intensity) return null;

  const matches = getStormsByIntensity(stormsData, intensity);

  if (params.mode === "table") {
    return (
      <IntensityGrid stormsData={stormsData} intensityStorms={matches} intensity={intensity} />
    );
  }

  return <StormRowsTable storms={matches} tableKey={params.filter} showIntensity={false} />;
};

export default IntensityView;
