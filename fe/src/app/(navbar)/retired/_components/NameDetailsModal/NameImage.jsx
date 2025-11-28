const NameImage = ({ src, alt, title }) => {
  return (
    <div className="shrink-0">
      <img
        src={src}
        alt={alt}
        title={title}
        className={`w-36 h-28 object-cover rounded-lg shadow-md border border-gray-200 ${
          src ? "block" : "hidden"
        }`}
      />
    </div>
  );
};

export default NameImage;
