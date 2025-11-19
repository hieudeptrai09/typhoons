"use client";

import { useState, useEffect } from "react";
import fetchData from "../../../containers/utils/fetcher";
import TyphoonNamesTable from "./_components/TyphoonNamesTable";
import TyphoonNameModal from "./_components/TyphoonNamesModal";

const CurrentNamesPage = () => {
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    fetchData("/typhoon-names?isRetired=0").then((data) => {
      if (data) setNames(data.data);
    });
  }, []);

  return (
    <>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Current Typhoon Names
        </h1>
        <TyphoonNamesTable names={names} onNameClick={setSelectedName} />
      </div>

      <TyphoonNameModal
        selectedName={selectedName}
        onClose={() => setSelectedName(null)}
      />
    </>
  );
};

export default CurrentNamesPage;
