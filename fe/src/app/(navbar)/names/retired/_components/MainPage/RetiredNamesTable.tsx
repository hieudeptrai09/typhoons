import FrownNotFound from "../../../../../../components/components/FrownNotFound";
import SortableTable from "../../../../../../components/components/SortableTable";
import { createRenderCell } from "../../../../../../containers/utils/cellRenderers";
import type { RetiredName, TableColumn } from "../../../../../../types";

interface RetiredNamesTableProps {
  paginatedData: RetiredName[];
  onNameClick: (name: RetiredName) => void;
}

const RetiredNamesTable = ({ paginatedData, onNameClick }: RetiredNamesTableProps) => {
  if (!paginatedData || paginatedData.length === 0) {
    return <FrownNotFound />;
  }

  const columns: TableColumn<RetiredName>[] = [
    { key: "name", label: "Name", isSortable: true },
    { key: "meaning", label: "Meaning", isSortable: false },
    { key: "country", label: "Country", isSortable: true },
    { key: "position", label: "Position", isSortable: true },
    { key: "note", label: "Note", isSortable: false },
    { key: "lastYear", label: "Year of last storm", isSortable: true },
  ];

  const getCellConfig = (row: RetiredName, key: keyof RetiredName) => {
    if (key === "name") {
      let colorClass = "text-red-600";

      switch (row.isLanguageProblem) {
        case 0:
          colorClass = "text-red-600";
          break;
        case 1:
          colorClass = "text-green-600";
          break;
        case 2:
          colorClass = "text-amber-500";
          break;
        case 3:
          colorClass = "text-purple-600";
          break;
      }

      return { className: `font-semibold ${colorClass}` };
    }

    return {};
  };

  const renderCell = createRenderCell<RetiredName>(getCellConfig);

  return (
    <SortableTable
      data={paginatedData}
      columns={columns}
      onRowClick={onNameClick}
      renderCell={renderCell}
    />
  );
};

export default RetiredNamesTable;
