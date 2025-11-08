const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://aolang.edu.vn/tybe/api.php";
console.log("Environment check:", {
  vite: import.meta?.env?.VITE_API_BASE,
  react: process?.env?.REACT_APP_API_BASE,
  next: process?.env?.NEXT_PUBLIC_API_BASE,
  final: API_BASE,
}); // Debug log

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
