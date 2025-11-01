const API_BASE =
  import.meta?.env?.VITE_API_BASE ||
  process?.env?.REACT_APP_API_BASE ||
  process?.env?.NEXT_PUBLIC_API_BASE ||
  "https://aolang.edu.vn/tybe/api.php";

const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default fetchData;
