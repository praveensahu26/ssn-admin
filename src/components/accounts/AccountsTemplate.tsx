import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AccountsHeader, type AccountTab } from '@/components/accounts/AccountsHeader';
import { AccountsOverview } from '@/components/accounts/AccountsOverview';
import DataTable, { type ColumnConfig, type ActionConfig } from '@/components/ui/DataTable';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – dummyData is a plain JS module with no type declarations
import { users as _initialUsers, reporters as _initialReporters } from '@/dummyData/dummyData';
import { Check } from 'lucide-react';


const EyeIcon = () => <img src="/icons/table/eye.svg" alt="view" className="w-[22px] h-[22px] object-contain" />;
const DeleteIcon = () => <img src="/icons/table/delete.svg" alt="delete" className="w-[22px] h-[22px] object-contain" />;
const InfoIcon = () => <img src="/icons/table/info.svg" alt="info" className="w-[22px] h-[22px] object-contain" />;
const DotsIcon = () => <img src="/icons/table/dots.svg" alt="more" className="w-[22px] h-[22px] object-contain" />;
const RestoreIcon = () => <img src="/icons/table/restore.svg" alt="restore" className="w-[22px] h-[22px] object-contain" />;
const CheckIcon = (props: React.ComponentProps<typeof Check>) => <Check className="w-5 h-5" {...props} />;



interface AccountsTemplateProps {
  role: 'user' | 'reporter';
}

interface BaseAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  newsReportCount: number;
  activeCampaignCount: number;
  status: {
    value: string;
    reason?: string;
  };
  isReported: boolean;
  gender?: 'Male' | 'Female';
  journalistId?: string;
  verificationRequest?: string;
}



const initialUsers = _initialUsers as BaseAccount[];
const initialReporters = _initialReporters as BaseAccount[];



function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase() || '??';
  }
  const mainPart = parts[0] ?? '';
  return mainPart.slice(0, 2).toUpperCase() || '??';
}

function renderUserCell(row: BaseAccount) {
  const initials = getInitials(row.name);
  return (
    <div className="flex items-center gap-3">
      {row.profilePicture ? (
        <img
          src={row.profilePicture}
          alt={row.name}
          className="w-10 h-10 rounded-full object-cover border border-[#F1F5F9] shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] border border-[#DCE5EF] flex items-center justify-center text-text-secondary font-medium text-md-custom shrink-0 font-poppins">
          {initials}
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-text-primary text-md-custom truncate">{row.name}</span>
        <span className="text-text-secondary text-md-custom truncate">{row.email}</span>
      </div>
    </div>
  );
}

function renderStatusBadge(status: string) {
  let bg = 'bg-[#F1F5F9]';
  let textColor = 'text-[#64748B]';
  let dot = 'bg-[#64748B]';
  let borderColor = 'border-[#E2E8F0]';
  let label = status.charAt(0).toUpperCase() + status.slice(1);

  if (status === 'active' || status === 'verified') {
    bg = 'bg-[#ECFDF3]';
    textColor = 'text-[#067647]';
    dot = 'bg-[#17B26A]';
    borderColor = 'border-[#ABEFC6]';
    label = status === 'active' ? 'Active' : 'Verified';
  } else if (status === 'inactive' || status === 'in-active') {
    label = 'In-active';
  } else if (status === 'blocked' || status === 'rejected') {
    bg = 'bg-[#FDF2FA]';
    textColor = 'text-[#D80027]';
    dot = 'bg-[#D80027]';
    borderColor = 'border-[#FFA8A9]';
    label = status === 'blocked' ? 'Blocked' : 'Rejected';
  } else if (status === 'suspended' || status === 'pending') {
    bg = 'bg-[#FDF2FA]';
    textColor = 'text-[#D80027]';
    dot = 'bg-[#D80027]';
    borderColor = 'border-[#FFA8A9]';
    label = status === 'suspended' ? 'Suspended' : 'Pending';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm-custom font-medium border ${borderColor} ${bg} ${textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className='text-nowrap'>{label}</span>
    </div>
  );
}



const defaultColumns: ColumnConfig<BaseAccount>[] = [
  {
    key: 'name',
    header: 'User name',
    render: renderUserCell,
  },
  { key: 'phoneNumber', header: 'Phone number' },
  { key: 'newsReportCount', header: 'News report count' },
  { key: 'activeCampaignCount', header: 'Active campaign' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => renderStatusBadge(row.status.value),
  },
];

const reporterDefaultColumns: ColumnConfig<BaseAccount>[] = defaultColumns.map((col) =>
  col.key === 'name' ? { ...col, header: 'Reporter name' } : col
);

const verificationColumns: ColumnConfig<BaseAccount>[] = [
  {
    key: 'name',
    header: 'Reporter name',
    render: renderUserCell,
  },
  { key: 'phoneNumber', header: 'Phone number' },
  { key: 'gender', header: 'Gender' },
  { key: 'journalistId', header: 'Journalist ID' },
  {
    key: 'verificationRequest',
    header: 'Status',
    render: (row) => renderStatusBadge(row.verificationRequest ?? 'pending'),
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const AccountsTemplate: React.FC<AccountsTemplateProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<AccountTab>('overview');

  const [usersList, setUsersList] = useState<BaseAccount[]>(() =>
    initialUsers.map((u) => ({
      ...u,
      status: { value: u.status.value, reason: u.status.reason },
    }))
  );

  const [reportersList, setReportersList] = useState<BaseAccount[]>(() =>
    initialReporters.map((r, idx) => ({
      ...r,
      status: { value: r.status.value, reason: r.status.reason },
      gender: r.gender ?? (idx % 2 === 0 ? 'Male' : 'Female'),
      journalistId: r.journalistId ?? String(654612621621 + idx),
    }))
  );

  const isReporter = role === 'reporter';
  const currentList = isReporter ? reportersList : usersList;
  const setList = isReporter ? setReportersList : setUsersList;

  const overviewList = useMemo(() => currentList.slice(0, 7), [currentList]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleDelete = (row: BaseAccount) => {
    setList((prev) => prev.filter((item) => item.id !== row.id));
  };

  const handleRestore = (row: BaseAccount) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, status: { value: 'active' } } : item
      )
    );
  };

  const handleVerify = (row: BaseAccount) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, verificationRequest: 'verified' } : item
      )
    );
  };

  // ─── Column set (user vs reporter) ─────────────────────────────────────────

  const cols = isReporter ? reporterDefaultColumns : defaultColumns;
  const labelSuffix = isReporter ? 'reporters' : 'users';

  // ─── Tab Content ───────────────────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': {
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: EyeIcon, onClick: () => { }, tooltip: 'View Profile' },
          { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
        ];
        return (
          <div className="flex flex-col gap-6 mt-2">
            <AccountsOverview role={role} />
            <DataTable
              title={isReporter ? 'Reporters' : 'Users'}
              label={`7 new ${labelSuffix}`}
              data={overviewList}
              columns={cols}
              actions={actions}
              searchKeys={['name', 'email', 'phoneNumber']}
              itemsPerPage={12}
            />
          </div>
        );
      }

      case 'all': {
        const data = currentList.filter((x) => x.status.value !== 'suspended');
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: EyeIcon, onClick: () => { }, tooltip: 'View Profile' },
          { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
        ];
        return (
          <DataTable
            title={isReporter ? 'All Reporters' : 'All Users'}
            data={data}
            columns={cols}
            actions={actions}
            searchKeys={['name', 'email', 'phoneNumber']}
            itemsPerPage={12}
          />
        );
      }

      case 'active': {
        const data = currentList.filter((x) => x.status.value === 'active');
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: EyeIcon, onClick: () => { }, tooltip: 'View Profile' },
          { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
        ];
        return (
          <DataTable
            title={isReporter ? 'Active Reporters' : 'Active Users'}
            data={data}
            columns={cols}
            actions={actions}
            searchKeys={['name', 'email', 'phoneNumber']}
            itemsPerPage={12}
          />
        );
      }

      case 'inactive': {
        const data = currentList.filter(
          (x) => x.status.value === 'inactive' || x.status.value === 'in-active'
        );
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: EyeIcon, onClick: () => { }, tooltip: 'View Profile' },
          { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
        ];
        return (
          <DataTable
            title={isReporter ? 'In-active Reporters' : 'In-active Users'}
            data={data}
            columns={cols}
            actions={actions}
            searchKeys={['name', 'email', 'phoneNumber']}
            itemsPerPage={12}
          />
        );
      }

      case 'reported': {
        const data = currentList.filter(
          (x) => x.status.value === 'active' || x.status.value === 'inactive' || x.status.value === 'in-active'
        );
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: InfoIcon, onClick: () => { }, tooltip: 'Info' },
          { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
          { icon: DotsIcon, onClick: () => { }, tooltip: 'More Options' },
        ];
        return (
          <DataTable
            title={isReporter ? 'Reported Reporters' : 'Reported Users'}
            data={data}
            columns={cols}
            actions={actions}
            searchKeys={['name', 'email', 'phoneNumber']}
            itemsPerPage={12}
          />
        );
      }

      case 'blocked': {
        const data = currentList.filter((x) => x.status.value === 'blocked');
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: InfoIcon, onClick: () => { }, tooltip: 'Info' },
          { icon: EyeIcon, onClick: () => { }, tooltip: 'View Profile' },
          { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
        ];
        return (
          <DataTable
            title={isReporter ? 'Blocked Reporters' : 'Blocked Users'}
            data={data}
            columns={cols}
            actions={actions}
            searchKeys={['name', 'email', 'phoneNumber']}
            itemsPerPage={12}
          />
        );
      }

      case 'suspended': {
        const data = currentList.filter((x) => x.status.value === 'suspended');
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: InfoIcon, onClick: () => { }, tooltip: 'Info' },
          { icon: EyeIcon, onClick: () => { }, tooltip: 'View Profile' },
          { icon: RestoreIcon, onClick: handleRestore, tooltip: 'Restore' },
        ];
        return (
          <DataTable
            title={isReporter ? 'Suspended Reporters' : 'Suspended Users'}
            data={data}
            columns={cols}
            actions={actions}
            searchKeys={['name', 'email', 'phoneNumber']}
            itemsPerPage={12}
          />
        );
      }

      case 'verification': {
        if (!isReporter) return null;
        const actions: ActionConfig<BaseAccount>[] = [
          { icon: CheckIcon, onClick: handleVerify, tooltip: 'Approve Verification', className: 'text-[#067647]' },
          { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
        ];
        return (
          <DataTable
            title="Verification Requests"
            data={currentList}
            columns={verificationColumns}
            actions={actions}
            searchKeys={['name', 'email', 'phoneNumber', 'journalistId']}
            itemsPerPage={12}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-1 w-full">
        <AccountsHeader role={role} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="w-full">{renderTabContent()}</div>
      </div>
    </MainLayout>
  );
};

export default AccountsTemplate;
