import ShowUsers from "@/features/show user following/pages/ShowUsers";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  const { id, type } = await params;

  return (
    <div>
      <ShowUsers id={Number(id)} type={type} />
    </div>
  );
}
