"use client";

import { useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import Waiting from "../../../../components/Waiting";
import { useFetchData } from "../../../../containers/hooks/useFetchData";
import HistoryNamesTable from "./_components/HistoryNamesTable";
import HistoryModal from "./_components/HistoryModal";
import type { TyphoonName } from "../../../../types";

const HistoryNamesPage = () => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [selectedPositionNames, setSelectedPositionNames] = useState<TyphoonName[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: names, loading, error } = useFetchData<TyphoonName[]>("/typhoon-names");

  const handleCellClick = (position: number, positionNames: TyphoonName[]) => {
    setSelectedPosition(position);
    setSelectedPositionNames(positionNames);
    setIsModalOpen(true);
  };

  if (loading) {
    return <Waiting content="Loading Name History..." />;
  }

  if (error) {
    return <Waiting content="There are some errors during loading data..." />;
  }

  return (
    <PageHeader title="Typhoon Name History">
      <HistoryNamesTable names={names || []} onCellClick={handleCellClick} />

      {selectedPosition !== null && (
        <HistoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          position={selectedPosition}
          positionNames={selectedPositionNames}
        />
      )}
    </PageHeader>
  );
};

export default HistoryNamesPage;
