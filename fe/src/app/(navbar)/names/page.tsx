"use client";

import { useState } from "react";
import { Spin } from "antd";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import NameDetailsModal from "../../../components/ui/NameDetailsModal";
import HistoryModal from "../../../components/ui/HistoryModal";
import { defaultTyphoonName } from "../../../constants";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import TagIconGrid from "./_components/TagIconGrid";
import type { TyphoonName } from "../../../types";

const NamesPage = () => {
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  const [historyPosition, setHistoryPosition] = useState<number>(0);
  const [historyPositionNames, setHistoryPositionNames] = useState<TyphoonName[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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
    setIsNameModalOpen(true);
  };

  const handleCellClick = (
    position: number,
    currentName: TyphoonName | undefined,
    historyNames: TyphoonName[],
    showHistory: boolean,
  ) => {
    if (showHistory) {
      setHistoryPosition(position);
      setHistoryPositionNames(historyNames);
      setIsHistoryModalOpen(true);
    } else if (currentName) {
      setSelectedName(currentName);
      setIsNameModalOpen(true);
    }
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
        onCellClick={handleCellClick}
      />
      <NameDetailsModal
        isOpen={isNameModalOpen}
        name={selectedName}
        onClose={() => setIsNameModalOpen(false)}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        position={historyPosition}
        positionNames={historyPositionNames}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </PageHeader>
  );
};

export default NamesPage;
