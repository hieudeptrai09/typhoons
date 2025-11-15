const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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
