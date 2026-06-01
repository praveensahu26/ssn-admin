import RightPanel from '@/components/details/RightPanel';
import SupportMessageItem from '@/components/campaigns/SupportMessageItem';

interface SupportMessage {
  userProfilePic: string;
  userName: string;
  donatedAmount: string;
  words: string;
}

interface WordsOfSupportPanelProps {
  messages: SupportMessage[];
}

export function WordsOfSupportPanel({ messages }: WordsOfSupportPanelProps) {
  const repeatedMessages = messages.length ? Array.from({ length: 3 }, () => messages).flat() : [];

  return (
    <RightPanel title="Words of Support">
      <div className="space-y-2">
        {repeatedMessages.map((message, index) => (
          <SupportMessageItem
            key={`${message.userName}-${index}`}
            image={message.userProfilePic}
            name={message.userName}
            donatedAmount={message.donatedAmount}
            words={message.words}
          />
        ))}
      </div>
    </RightPanel>
  );
}

export default WordsOfSupportPanel;
