"use client";

import { useMemo } from "react";
import TyphoonSpinner from "../../../components/components/TyphoonSpinner";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import { INTENSITY_RANK } from "../../../constants";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import AverageCountryChart from "./_components/AverageCountryChart";
import AverageYearChart from "./_components/AverageYearChart";
import HighlightsByCountryChart from "./_components/HighlightsByCountryChart";
import NamesByCountryChart from "./_components/NamesByCountryChart";
import NamesByTagChart from "./_components/NamesByTagChart";
import NamesByLetterChart from "./_components/NamesByLetterChart";
import RetiredByReasonChart from "./_components/RetiredByReasonChart";
import RetiredByYearChart from "./_components/RetiredByYearChart";
import type { Storm, RetiredName } from "../../../types";

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
    <h3 className="mb-4 text-center text-lg font-bold text-gray-700">{title}</h3>
    {children}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="col-span-1 md:col-span-2">
    <h2 className="border-b border-stone-300 pb-2 text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

export default function ChartsPageContent() {
  const {
    data: stormsData,
    loading: stormsLoading,
    error: stormsError,
  } = useFetchData<Storm[]>("/storms");
  const {
    data: namesData,
    loading: namesLoading,
    error: namesError,
  } = useFetchData<RetiredName[]>("/typhoon-names");

  const loading = stormsLoading || namesLoading;
  const error = stormsError || namesError;

  const storms = stormsData || [];
  const allNames = namesData || [];
  const retiredNames = useMemo(() => allNames.filter((n) => n.isRetired), [allNames]);

  const yearChartData = useMemo(() => {
    const yearMap: Record<number, { count: number; sum: number }> = {};
    storms
      .filter((s) => s.year >= 2000)
      .forEach((s) => {
        if (!yearMap[s.year]) yearMap[s.year] = { count: 0, sum: 0 };
        yearMap[s.year].count += 1;
        yearMap[s.year].sum += INTENSITY_RANK[s.intensity];
      });
    return Object.entries(yearMap).map(([year, { count, sum }]) => ({
      year: Number(year),
      count,
      avgNumber: sum / count,
    }));
  }, [storms]);

  const strongestStorms = useMemo(() => storms.filter((s) => s.isStrongest), [storms]);
  const firstStorms = useMemo(() => storms.filter((s) => s.isFirst), [storms]);
  const lastStorms = useMemo(() => storms.filter((s) => s.isLast), [storms]);

  const highlightCountries = useMemo(() => {
    const countries = new Set<string>();
    [...strongestStorms, ...firstStorms, ...lastStorms].forEach((s) => countries.add(s.country));
    return [...countries].sort((a, b) => a.localeCompare(b));
  }, [strongestStorms, firstStorms, lastStorms]);

  const countryChartData = useMemo(() => {
    const countryMap: Record<string, { count: number; sum: number }> = {};
    storms
      .filter((s) => s.position !== 143)
      .forEach((s) => {
        if (!countryMap[s.country]) countryMap[s.country] = { count: 0, sum: 0 };
        countryMap[s.country].count += 1;
        countryMap[s.country].sum += INTENSITY_RANK[s.intensity];
      });
    return Object.entries(countryMap).map(([country, { count, sum }]) => ({
      country,
      count,
      avgNumber: sum / count,
    }));
  }, [storms]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <TyphoonSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title="Charts">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        <SectionHeader title="Storms" />

        <ChartCard title="Storm Count & Avg Intensity by Year">
          <AverageYearChart data={yearChartData} />
        </ChartCard>

        <ChartCard title="Storm Count & Avg Intensity by Country">
          <AverageCountryChart data={countryChartData} />
        </ChartCard>

        <ChartCard title="Strongest Storms by Country">
          <HighlightsByCountryChart storms={strongestStorms} allCountries={highlightCountries} color="#dc2626" />
        </ChartCard>

        <ChartCard title="First Storms of Season by Country">
          <HighlightsByCountryChart storms={firstStorms} allCountries={highlightCountries} color="#3b82f6" />
        </ChartCard>

        <ChartCard title="Last Storms of Season by Country">
          <HighlightsByCountryChart storms={lastStorms} allCountries={highlightCountries} color="#f97316" />
        </ChartCard>

        <SectionHeader title="Names" />

        <ChartCard title="Names by Country">
          <NamesByCountryChart names={allNames} />
        </ChartCard>

        <ChartCard title="Names by Tag">
          <NamesByTagChart names={allNames} />
        </ChartCard>

        <ChartCard title="Names by First Letter">
          <NamesByLetterChart names={allNames} />
        </ChartCard>

        <ChartCard title="Retired Names by Reason">
          <RetiredByReasonChart retiredNames={retiredNames} />
        </ChartCard>

        <ChartCard title="Retired Names by Year">
          <RetiredByYearChart retiredNames={retiredNames} />
        </ChartCard>
      </div>
    </PageHeader>
  );
}
