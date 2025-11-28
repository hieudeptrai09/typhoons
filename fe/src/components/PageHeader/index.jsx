const PageHeader = ({ title, children }) => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h1>
      {children}
    </div>
  );
};

export default PageHeader;
