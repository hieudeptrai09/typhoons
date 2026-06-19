interface NameStatus {
  isRetired: boolean;
  isLanguageProblem: number;
}

export const getNameStatusColor = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "#f59e0b";
  if (Boolean(name.isRetired)) return "#dc2626";
  return "#16a34a";
};

export const getNameStatusColorClass = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "text-amber-500";
  if (Boolean(name.isRetired)) return "text-red-600";
  return "text-green-600";
};

export const getNameStatusBgClass = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "bg-amber-100";
  if (Boolean(name.isRetired)) return "bg-red-100";
  return "bg-emerald-100";
};

export const getRetiredReasonColorClass = (isLanguageProblem: number): string => {
  switch (isLanguageProblem) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-green-600";
    case 2:
      return "text-amber-500";
    case 3:
      return "text-purple-600";
    default:
      return "text-red-600";
  }
};
