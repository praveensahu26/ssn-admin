import FundraisingTeamItem from '@/components/campaigns/FundraisingTeamItem';

interface FundraisingMember {
  profilePic: string;
  name: string;
  amountRaised: string;
}

interface FundraisingTeamProps {
  members?: FundraisingMember[];
}

export function FundraisingTeam({ members = [] }: FundraisingTeamProps) {
  if (!members.length) return null;

  return (
    <div>
      <h2 className="text-md-custom font-medium leading-5 text-text-primary">Fundraising Team</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {members.map((member) => (
          <FundraisingTeamItem
            key={`${member.name}-${member.amountRaised}`}
            image={member.profilePic}
            name={member.name}
            amountRaised={member.amountRaised}
          />
        ))}
      </div>
    </div>
  );
}

export default FundraisingTeam;
