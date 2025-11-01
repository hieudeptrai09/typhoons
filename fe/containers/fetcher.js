const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost/typhoon/be/api.php"
    : "http://typhoons-catfish.atwebpages.com/api.php";

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
