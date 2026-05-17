"use client";

import { useState } from "react";
import FrownNotFound from "../../../../components/components/FrownNotFound";
import Loader from "../../../../components/components/Loader";
import PageHeader from "../../../../components/components/PageHeader";
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
