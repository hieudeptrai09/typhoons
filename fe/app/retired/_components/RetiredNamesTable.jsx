import NameRow from "./NameRow";

const RetiredNamesTable = ({ paginatedData, onNameClick }) => {
  return (
    <div className="space-y-8">
      {paginatedData.map((group, gidx) => (
        <div key={gidx}>
          {group.country && (
            <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-200">
              {group.country}
            </h2>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Meaning
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Year of last storm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {group.items?.map((name, idx) => (
                  <NameRow
                    key={idx}
                    name={name}
                    onClick={() => onNameClick(name)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RetiredNamesTable;
