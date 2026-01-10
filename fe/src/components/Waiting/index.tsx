const Waiting = ({ content }: { content: string }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100">
      <div className="text-xl text-gray-700">{content}</div>
    </div>
  );
};

export default Waiting;
