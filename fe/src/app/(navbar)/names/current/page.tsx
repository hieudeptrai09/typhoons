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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData<TyphoonName[]>("/typhoon-names?isRetired=0").then((data) => {
      if (data) setNames(data.data);
    });
  }, []);

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsModalOpen(true);
  };

  return (
    <PageHeader title="Current Typhoon Names">
      <TyphoonNamesTable names={names} onNameClick={handleNameClick} />
      <TyphoonNameModal
        isOpen={isModalOpen}
        selectedName={selectedName}
        onClose={() => setIsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default CurrentNamesPage;
