import ConnectionListItem, { type ConnectionProfile } from '@/components/connections/ConnectionListItem';

interface ConnectionsListProps {
  data: ConnectionProfile[];
  query: string;
}

export default function ConnectionsList({ data, query }: ConnectionsListProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredData = normalizedQuery
    ? data.filter((profile) => {
        const name = profile.name.toLowerCase();
        return name.includes(normalizedQuery);
      })
    : data;

  if (filteredData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-[#DCE5EF] px-6 text-center text-sm-custom font-medium text-text-secondary">
        No profiles found.
      </div>
    );
  }

  return (
    <div>
      {filteredData.map((profile, index) => (
        <ConnectionListItem key={`${profile.name}-${index}`} profile={profile} />
      ))}
    </div>
  );
}
