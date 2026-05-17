"use client";

import { useState } from "react";
import FrownNotFound from "../../../../components/FrownNotFound";
import Loader from "../../../../components/Loader";
import NameDetailsModal from "../../../../components/NameDetailsModal";
import PageHeader from "../../../../components/PageHeader";
import { defaultTyphoonName } from "../../../../constants";
import { useFetchData } from "../../../../containers/hooks/useFetchData";
import TyphoonNamesTable from "./_components/TyphoonNamesTable";
import type { TyphoonName } from "../../../../types";

const CurrentNamesPage = () => {
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: names, loading, error } = useFetchData<TyphoonName[]>("/typhoon-names?isRetired=0");

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title="Current Typhoon Names">
      <TyphoonNamesTable names={names || []} onNameClick={handleNameClick} />
      <NameDetailsModal
        isOpen={isModalOpen}
        name={selectedName}
        onClose={() => setIsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default CurrentNamesPage;
