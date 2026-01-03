"use client";

import { useState, useEffect } from "react";
import PageHeader from "../../../../components/PageHeader";
import fetchData from "../../../../containers/utils/fetcher";
import TyphoonNameModal from "./_components/TyphoonNamesModal";
import TyphoonNamesTable from "./_components/TyphoonNamesTable";
import { TyphoonName } from "../../../../types";

const CurrentNamesPage = () => {
  const [names, setNames] = useState<TyphoonName[]>([]);
  const [selectedName, setSelectedName] = useState<TyphoonName | null>(null);

  useEffect(() => {
    fetchData<TyphoonName[]>("/typhoon-names?isRetired=0").then((data) => {
      if (data) setNames(data.data);
    });
  }, []);

  return (
    <PageHeader title="Current Typhoon Names">
      <TyphoonNamesTable names={names} onNameClick={setSelectedName} />
      <TyphoonNameModal
        isOpen={!!selectedName}
        selectedName={selectedName}
        onClose={() => setSelectedName(null)}
      />
    </PageHeader>
  );
};

export default CurrentNamesPage;
