"use client";

import { useState } from "react";
import { Spin } from "antd";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import NameDetailsModal from "../../../components/ui/NameDetailsModal";
import { defaultTyphoonName } from "../../../constants";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import TagIconGrid from "./_components/TagIconGrid";
import type { TyphoonName } from "../../../types";

const NamesPage = () => {
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: allNames,
    loading: allLoading,
    error: allError,
  } = useFetchData<TyphoonName[]>("/typhoon-names");
  const {
    data: currentNames,
    loading: currentLoading,
    error: currentError,
  } = useFetchData<TyphoonName[]>("/typhoon-names?isRetired=0");

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsModalOpen(true);
  };

  if (allLoading || currentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Spin size="large" />
      </div>
    );
  }

  if (allError || currentError) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title="Names by Tag">
      <TagIconGrid
        names={allNames ?? []}
        currentNames={currentNames ?? []}
        onNameClick={handleNameClick}
      />
      <NameDetailsModal
        isOpen={isModalOpen}
        name={selectedName}
        onClose={() => setIsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default NamesPage;
