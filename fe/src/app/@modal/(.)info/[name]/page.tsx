import InfoModal from "./InfoModal";

interface InfoModalPageProps {
  params: Promise<{ name: string }>;
}

export default async function InfoModalPage({ params }: InfoModalPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return <InfoModal name={decodedName} />;
}
