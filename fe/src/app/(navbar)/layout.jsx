import Navbar from "../../components/NavBar";

export default function WithNavbarLayout({ children }) {
  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      {children}
    </div>
  );
}
