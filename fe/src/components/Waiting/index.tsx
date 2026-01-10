const Waiting = ({ content }: { content: string }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100">
      <div className="text-xl text-red-600">{content}</div>
    </div>
  );
};

export default Waiting;
