import React, { useEffect, useMemo, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AccountsHeader,
  type AccountTab,
} from '@/components/accounts/AccountsHeader';
import { AccountsOverview } from '@/components/accounts/AccountsOverview';
import MainLayout from '@/components/layout/MainLayout';
import ModerationActionDrawer, {
  moderationActionConfigs,
  type ModerationActionType,
} from '@/components/profile/ModerationActionDrawer';
import DataTable, {
  type ActionConfig,
  type BulkActionConfig,
  type ColumnConfig,
} from '@/components/ui/DataTable';
import {
  accountServices,
  type AccountListMeta,
  type AccountListTab,
  type AdminAccount,
} from '@/services/accountServices';
import {
  adminReporterServices,
  type AdminReporterUser,
} from '@/services/adminReporterServices';
import { getProfilePath } from '@/utils/profileRoutes';
import { toast } from '@/lib/toast';

const EyeIcon = () => <img src="/icons/table/eye.svg" alt="view" />;
const DeleteIcon = () => <img src="/icons/table/delete.svg" alt="delete" />;
const InfoIcon = () => <img src="/icons/table/info.svg" alt="info" />;
const DotsIcon = () => <img src="/icons/table/dots.svg" alt="more" />;
const RestoreIcon = () => <img src="/icons/table/restore.svg" alt="restore" />;
const CheckIcon = (props: React.ComponentProps<typeof Check>) => (
  <Check className="h-5 w-5" {...props} />
);

const MenuIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="h-5 w-5 object-contain" />
);

interface AccountsTemplateProps {
  role: 'user' | 'reporter';
}

type BaseAccount = AdminAccount;

function mapReporterRequest(reporter: AdminReporterUser): BaseAccount {
  return {
    id: reporter.id,
    name: reporter.name,
    username: reporter.username ?? '',
    email: reporter.email,
    phoneNumber: reporter.phoneNumber ?? reporter.mobile ?? '-',
    profilePicture: reporter.avatar ?? undefined,
    role: 'reporter_pending',
    status: { value: 'active', reasonTitle: null, reasonDescription: null },
    newsReportCount: 0,
    activeCampaignCount: 0,
    isReported: false,
    gender: reporter.gender ?? null,
    journalistId: reporter.reporterProfile?.journalistId ?? '-',
    verificationRequest: reporter.reporterProfile?.approvalStatus === 'approved'
      ? 'verified'
      : reporter.reporterProfile?.approvalStatus ?? 'pending',
    createdAt: reporter.createdAt ?? '',
    updatedAt: reporter.updatedAt ?? '',
  };
}

const accountTabs: AccountTab[] = [
  'overview',
  'all',
  'active',
  'inactive',
  'reported',
  'blocked',
  'suspended',
  'verification',
];

function isAccountTab(value: string | null): value is AccountTab {
  return Boolean(value && accountTabs.includes(value as AccountTab));
}

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

function UserCell({ row }: { row: BaseAccount }) {
  const [imgError, setImgError] = React.useState(false);
  const initials = getInitials(row.name);
  const showImage = row.profilePicture && !imgError;

  return (
    <div className="flex items-center gap-3">
      {showImage ? (
        <img
          src={row.profilePicture ?? undefined}
          alt={row.name}
          className="h-10 w-10 shrink-0 rounded-full border border-[#F1F5F9] object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="font-poppins text-base-custom text-text-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] font-medium">
          {initials}
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <span className="text-md-custom text-text-primary truncate font-medium">
          {row.name}
        </span>
        <span className="text-md-custom text-text-secondary truncate">
          {row.email}
        </span>
      </div>
    </div>
  );
}

function renderUserCell(row: BaseAccount) {
  return <UserCell row={row} />;
}

function renderStatusBadge(status: string) {
  let bg = 'bg-[#F1F5F9]';
  let textColor = 'text-[#64748B]';
  let dot = 'bg-[#64748B]';
  let borderColor = 'border-[#E2E8F0]';
  let label = status.charAt(0).toUpperCase() + status.slice(1);

  if (status === 'active' || status === 'verified' || status === 'approved') {
    bg = 'bg-[#ECFDF3]';
    textColor = 'text-[#067647]';
    dot = 'bg-[#17B26A]';
    borderColor = 'border-[#ABEFC6]';
    label =
      status === 'active'
        ? 'Active'
        : status === 'approved'
          ? 'Approved'
          : 'Verified';
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
    <div
      className={`text-sm-custom inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 font-medium ${borderColor} ${bg} ${textColor}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
      <span className="text-nowrap">{label}</span>
    </div>
  );
}

const defaultColumns: ColumnConfig<BaseAccount>[] = [
  {
    key: 'name',
    header: 'User name',
    render: renderUserCell,
    csvValue: row => row.name,
  },
  {
    key: 'email',
    header: 'Email',
    hidden: true,
    csvValue: row => row.email,
  },
  {
    key: 'phoneNumber',
    header: 'Phone number',
    csvValue: row => {
      const num = row.phoneNumber;
      if (!num || num === '-') return '';
      return `\t${num}`;
    },
  },
  { key: 'newsReportCount', header: 'News report count' },
  { key: 'activeCampaignCount', header: 'Active campaign' },
  {
    key: 'status',
    header: 'Status',
    render: row => renderStatusBadge(row.status.value),
    csvValue: row => {
      const val = row.status.value;
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
  },
];

const reporterDefaultColumns: ColumnConfig<BaseAccount>[] = defaultColumns.map(
  col => (col.key === 'name' ? { ...col, header: 'Reporter name' } : col)
);

const verificationColumns: ColumnConfig<BaseAccount>[] = [
  {
    key: 'name',
    header: 'Reporter name',
    render: renderUserCell,
    csvValue: row => row.name,
  },
  {
    key: 'email',
    header: 'Email',
    hidden: true,
    csvValue: row => row.email,
  },
  {
    key: 'phoneNumber',
    header: 'Phone number',
    csvValue: row => {
      const num = row.phoneNumber;
      if (!num || num === '-') return '';
      return `\t${num}`;
    },
  },
  { key: 'gender', header: 'Gender' },
  { key: 'journalistId', header: 'Journalist ID' },
  {
    key: 'verificationRequest',
    header: 'Status',
    render: row => renderStatusBadge(row.verificationRequest ?? 'pending'),
    csvValue: row => {
      const val = row.verificationRequest ?? 'pending';
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
  },
];

export const AccountsTemplate: React.FC<AccountsTemplateProps> = ({ role }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [moderationAction, setModerationAction] = useState<{
    type: Extract<ModerationActionType, 'warning' | 'block' | 'suspend'>;
    account: BaseAccount | null;
    accountIds: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<AccountTab>(() => {
    const tab = searchParams.get('tab');

    if (isAccountTab(tab) && (role === 'reporter' || tab !== 'verification')) {
      return tab;
    }

    return 'overview';
  });
  const [accounts, setAccounts] = useState<BaseAccount[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [meta, setMeta] = useState<AccountListMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<BaseAccount[]>([]);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const isReporter = role === 'reporter';
  const cols = isReporter ? reporterDefaultColumns : defaultColumns;
  const labelSuffix = isReporter ? 'reporters' : 'users';

  useEffect(() => {
    if (activeTab === 'verification') return;

    let isMounted = true;
    const requestTab: AccountListTab =
      activeTab === 'overview' ? 'all' : activeTab;
    const limit = activeTab === 'overview' ? 7 : 100;

    async function loadAccounts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await accountServices.listAccounts({
          role,
          tab: requestTab,
          page: 1,
          limit,
        });

        if (isMounted) {
          setAccounts(response.data?.accounts ?? []);
          setMeta(response.data?.meta ?? null);
        }
      } catch (err) {
        if (isMounted) {
          setAccounts([]);
          setMeta(null);
          setError(
            err instanceof Error ? err.message : `Unable to load ${labelSuffix}`
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAccounts();

    return () => {
      isMounted = false;
    };
  }, [activeTab, labelSuffix, role, refreshKey]);

  useEffect(() => {
    if (!isReporter || activeTab !== 'verification') return;

    let isMounted = true;

    async function fetchVerificationRequests() {
      setVerificationLoading(true);
      setVerificationError(null);

      try {
        const reporters = await adminReporterServices.listAllVerificationReporters();

        if (isMounted) {
          setVerificationRequests(reporters.map(mapReporterRequest));
        }
      } catch (err) {
        if (isMounted) {
          setVerificationRequests([]);
          setVerificationError(
            err instanceof Error
              ? err.message
              : 'Unable to fetch verification requests'
          );
        }
      } finally {
        if (isMounted) {
          setVerificationLoading(false);
        }
      }
    }

    fetchVerificationRequests();

    return () => {
      isMounted = false;
    };
  }, [activeTab, isReporter]);

  const tableData = useMemo(
    () => (activeTab === 'verification' ? verificationRequests : accounts),
    [accounts, activeTab, verificationRequests]
  );

  const handleDelete = async (row: BaseAccount) => {
    setError(null);

    try {
      await accountServices.deleteAccount(row.id);
      setAccounts(prev => prev.filter(item => item.id !== row.id));
      setMeta(current =>
        current
          ? { ...current, total: Math.max(current.total - 1, 0) }
          : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete account');
    }
  };

  const handleViewProfile = (row: BaseAccount) => {
    navigate(getProfilePath(role, row.name), {
      state: { returnTab: activeTab, accountId: row.id },
    });
  };

  const handleModerationAction = (
    type: Extract<ModerationActionType, 'warning' | 'block' | 'suspend'>,
    row: BaseAccount
  ) => {
    setModerationAction({ type, account: row, accountIds: [row.id] });
  };

  const handleModerationSubmit = async (payload: {
    reasons: string[];
    description: string;
    notifyUser: boolean;
    duration?: string;
  }) => {
    if (!moderationAction) return;

    const statusValue = moderationAction.type === 'block' ? 'blocked' : 'suspended';

    try {
      if (moderationAction.account === null || moderationAction.accountIds.length > 1) {
        // Handle bulk operations
        await accountServices.bulkUpdateStatus(moderationAction.accountIds, statusValue);
        toast.success(`Selected accounts status updated to ${statusValue} successfully`);
      } else if (moderationAction.account) {
        // Handle single account operation
        if (statusValue === 'blocked') {
          await accountServices.blockAccount(moderationAction.account.id, payload);
          toast.success('Account blocked successfully');
        } else if (statusValue === 'suspended') {
          await accountServices.suspendAccount(moderationAction.account.id, payload);
          toast.success('Account suspended successfully');
        }
      }
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to update account status to ${statusValue}`);
    } finally {
      setModerationAction(null);
    }
  };

  const handleTabChange = (tab: AccountTab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'overview' ? {} : { tab });
  };

  const handleRestore = async (row: BaseAccount) => {
    setError(null);

    try {
      const response = await accountServices.restoreAccount(row.id);
      const restoredAccount = response.data?.account;

      setAccounts(prev =>
        activeTab === 'suspended'
          ? prev.filter(item => item.id !== row.id)
          : prev.map(item =>
              item.id === row.id
                ? {
                    ...item,
                    status: restoredAccount?.status ?? {
                      value: 'active',
                      reasonTitle: null,
                      reasonDescription: null,
                    },
                  }
                : item
            )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to restore account'
      );
    }
  };

  const handleVerify = async (row: BaseAccount) => {
    setVerificationError(null);

    try {
      const response = await adminReporterServices.approveReporter(row.id);
      const updatedReporter = response.data?.user;

      setVerificationRequests(prev =>
        prev.map(item =>
          item.id === row.id
            ? updatedReporter
              ? mapReporterRequest(updatedReporter)
              : { ...item, role: 'reporter', verificationRequest: 'verified' }
            : item
        )
      );
    } catch (err) {
      setVerificationError(
        err instanceof Error ? err.message : 'Unable to approve reporter'
      );
    }
  };

  const handleRejectVerification = async (row: BaseAccount) => {
    setVerificationError(null);

    try {
      const response = await adminReporterServices.rejectReporter(row.id, 'Rejected by admin');
      const updatedReporter = response.data?.user;

      setVerificationRequests(prev =>
        prev.map(item =>
          item.id === row.id
            ? updatedReporter
              ? mapReporterRequest(updatedReporter)
              : { ...item, role: 'reporter_pending', verificationRequest: 'rejected' }
            : item
        )
      );
    } catch (err) {
      setVerificationError(
        err instanceof Error ? err.message : 'Unable to reject reporter'
      );
    }
  };
  const handleApproveSelected = (selectedIds: string[]) => {
    selectedIds.forEach(id => {
      const request = verificationRequests.find(item => item.id === id);
      if (request && !isApproveDisabled(request)) void handleVerify(request);
    });
  };

  const handleRejectSelected = (selectedIds: string[]) => {
    selectedIds.forEach(id => {
      const request = verificationRequests.find(item => item.id === id);
      if (!request || isRejectDisabled(request)) return;

      void adminReporterServices
        .rejectReporter(id, 'Rejected by admin')
        .then(response => {
          const updatedReporter = response.data?.user;

          setVerificationRequests(prev =>
            prev.map(item =>
              item.id === id
                ? updatedReporter
                  ? mapReporterRequest(updatedReporter)
                  : { ...item, role: 'reporter_pending', verificationRequest: 'rejected' }
                : item
            )
          );
        })
        .catch(err => {
          setVerificationError(
            err instanceof Error ? err.message : 'Unable to reject reporter'
          );
        });
    });
  };

  const isApproveDisabled = (row: BaseAccount) => row.verificationRequest === 'verified';

  const isRejectDisabled = (row: BaseAccount) => row.verificationRequest === 'rejected';

  const renderReportCount = (row: BaseAccount) => (
    <span>{row.reportCount ?? 0} reports</span>
  );

  const renderStatusReason = (fallback: string) => (row: BaseAccount) => (
    <div className="flex flex-col gap-1">
      {row.status.reasonTitle && (
        <span className="font-medium text-white">{row.status.reasonTitle}</span>
      )}
      {row.status.reasonDescription && (
        <span className="text-sm text-white">{row.status.reasonDescription}</span>
      )}
      {!row.status.reasonTitle && !row.status.reasonDescription && (
        <span className="text-white">{fallback}</span>
      )}
    </div>
  );

  const handleBulkStatusUpdate = (selectedIds: string[], status: string) => {
    if (status === 'blocked') {
      setModerationAction({ type: 'block', account: null, accountIds: selectedIds });
    } else if (status === 'suspended') {
      setModerationAction({ type: 'suspend', account: null, accountIds: selectedIds });
    } else {
      // For active/inactive, directly call API without drawer
      void (async () => {
        setError(null);
        try {
          await accountServices.bulkUpdateStatus(selectedIds, status);
          setRefreshKey(prev => prev + 1);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Unable to update status for selected accounts'
          );
        }
      })();
    }
  };

  const getBulkActionsForTab = (): BulkActionConfig[] => {
    const allActions: BulkActionConfig[] = [
      { label: 'Mark as Active', onClick: (ids) => void handleBulkStatusUpdate(ids, 'active') },
      { label: 'Mark as In-active', onClick: (ids) => void handleBulkStatusUpdate(ids, 'inactive') },
      { label: 'Mark as Blocked', onClick: (ids) => void handleBulkStatusUpdate(ids, 'blocked') },
      { label: 'Mark as Suspend', onClick: (ids) => void handleBulkStatusUpdate(ids, 'suspended') },
    ];

    switch (activeTab) {
      case 'active':
        // Do NOT show "Mark as Active"
        return allActions.filter(action => action.label !== 'Mark as Active');
      case 'inactive':
        // Do NOT show "Mark as In-active"
        return allActions.filter(action => action.label !== 'Mark as In-active');
      case 'blocked':
        // Show ONLY "Mark as Active"
        return allActions.filter(action => action.label === 'Mark as Active');
      case 'suspended':
        // Do NOT show "Mark as In-active" or "Suspend"
        return allActions.filter(action => action.label !== 'Mark as In-active' && action.label !== 'Mark as Suspend');
      default:
        return allActions;
    }
  };

  const baseActions: ActionConfig<BaseAccount>[] = [
    { icon: EyeIcon, onClick: handleViewProfile, tooltip: 'View Profile' },
    { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
    {
      icon: DotsIcon,
      onClick: () => {},
      tooltip: 'More Options',
      menuItems: [
        {
          label: isReporter ? 'Block Reporter' : 'Block User',
          icon: <MenuIcon src="/icons/table/remove.svg" alt="block" />,
          onClick: row => handleModerationAction('block', row),
        },
        {
          label: isReporter ? 'Suspend Reporter' : 'Suspend User',
          icon: <MenuIcon src="/icons/table/warning.svg" alt="suspend" />,
          onClick: row => handleModerationAction('suspend', row),
        },
      ],
    },
  ];

  const reportedActions: ActionConfig<BaseAccount>[] = [
    {
      icon: InfoIcon,
      onClick: () => {},
      tooltip: 'Info',
      detailTitle: () => 'Report Count',
      detailContent: renderReportCount,
    },
    { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
    {
      icon: DotsIcon,
      onClick: () => {},
      tooltip: 'More Options',
      menuItems: [
        {
          label: 'View Profile & Activities',
          icon: <MenuIcon src="/icons/table/view.svg" alt="view" />,
          onClick: handleViewProfile,
        },
        {
          label: 'Issue Warning',
          icon: <MenuIcon src="/icons/table/warning.svg" alt="warning" />,
          onClick: row => handleModerationAction('warning', row),
        },
        {
          label: isReporter ? 'Block Reporter' : 'Block User',
          icon: <MenuIcon src="/icons/table/remove.svg" alt="block" />,
          onClick: row => handleModerationAction('block', row),
        },
        {
          label: 'Dismiss Report',
          icon: <MenuIcon src="/icons/table/dismis.svg" alt="dismiss" />,
        },
      ],
    },
  ];

  const blockedActions: ActionConfig<BaseAccount>[] = [
    {
      icon: InfoIcon,
      onClick: () => {},
      tooltip: 'Info',
      detailTitle: () => 'Reason for Blocked',
      detailContent: renderStatusReason('No block reason provided.'),
    },
    { icon: EyeIcon, onClick: handleViewProfile, tooltip: 'View Profile' },
    { icon: DeleteIcon, onClick: handleDelete, tooltip: 'Delete' },
  ];

  const suspendedActions: ActionConfig<BaseAccount>[] = [
    {
      icon: InfoIcon,
      onClick: () => {},
      tooltip: 'Info',
      detailTitle: () => 'Reason for Suspended',
      detailContent: renderStatusReason('No suspend reason provided.'),
    },
    { icon: EyeIcon, onClick: handleViewProfile, tooltip: 'View Profile' },
    { icon: RestoreIcon, onClick: handleRestore, tooltip: 'Restore' },
  ];

  const verificationActions: ActionConfig<BaseAccount>[] = [
    {
      icon: CheckIcon,
      onClick: handleVerify,
      disabled: isApproveDisabled,
      tooltip: 'Approve Verification',
      className: 'text-[#067647]',
    },
    {
      icon: DeleteIcon,
      onClick: handleRejectVerification,
      disabled: isRejectDisabled,
      tooltip: 'Reject Verification',
      className: 'text-[#D80027]',
    },
  ];

  const getTableTitle = () => {
    if (activeTab === 'overview') return isReporter ? 'Reporters' : 'Users';
    if (activeTab === 'all') return isReporter ? 'All Reporters' : 'All Users';
    if (activeTab === 'active')
      return isReporter ? 'Active Reporters' : 'Active Users';
    if (activeTab === 'inactive')
      return isReporter ? 'In-active Reporters' : 'In-active Users';
    if (activeTab === 'reported')
      return isReporter ? 'Reported Reporters' : 'Reported Users';
    if (activeTab === 'blocked')
      return isReporter ? 'Blocked Reporters' : 'Blocked Users';
    if (activeTab === 'suspended')
      return isReporter ? 'Suspended Reporters' : 'Suspended Users';
    return 'Verification Requests';
  };

  const getTableActions = () => {
    if (activeTab === 'reported') return reportedActions;
    if (activeTab === 'blocked') return blockedActions;
    if (activeTab === 'suspended') return suspendedActions;
    if (activeTab === 'verification') return verificationActions;
    return baseActions;
  };

  const getTableColumns = () => {
    if (activeTab === 'verification') return verificationColumns;
    return cols;
  };

  const renderError = (message: string) => (
    <div className="font-poppins text-sm-custom rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700">
      {message}
    </div>
  );

  const renderAccountTable = () => {
    if (activeTab !== 'verification' && error) {
      return renderError(error);
    }

    return (
      <div className="flex flex-col gap-3">
        {activeTab === 'verification' && verificationError &&
          renderError(verificationError)}
        {activeTab === 'verification' && verificationLoading && (
          <div className="flex items-center justify-center rounded-lg border border-[#DCE5EF] bg-white px-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#007AFF]" />
          </div>
        )}
        {activeTab !== 'verification' && isLoading && (
          <div className="flex items-center justify-center rounded-lg border border-[#DCE5EF] bg-white px-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#007AFF]" />
          </div>
        )}
        {!isLoading && (!verificationLoading || activeTab !== 'verification') && (
          <DataTable
            title={getTableTitle()}
            label={
              activeTab === 'overview'
                ? `${tableData.length} recent ${labelSuffix}`
                : activeTab === 'verification'
                  ? `${tableData.length} verification requests`
                  : meta
                    ? `${meta.total} ${labelSuffix}`
                    : undefined
            }
            data={tableData}
            columns={getTableColumns()}
            actions={getTableActions()}
            bulkActions={
              activeTab === 'verification'
                ? [
                    { label: 'Approve All', onClick: handleApproveSelected },
                    { label: 'Reject All', onClick: handleRejectSelected },
                  ]
                : getBulkActionsForTab()
            }
            searchKeys={
              activeTab === 'verification'
                ? ['name', 'email', 'phoneNumber', 'journalistId']
                : ['name', 'email', 'phoneNumber']
            }
            itemsPerPage={12}
          />
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="mt-2 flex flex-col gap-6">
          <AccountsOverview role={role} refreshKey={refreshKey} />
          {renderAccountTable()}
        </div>
      );
    }

    if (activeTab === 'verification' && !isReporter) return null;

    return renderAccountTable();
  };

  return (
    <>
      <MainLayout>
        <div className="flex w-full flex-col gap-1">
          <AccountsHeader
            role={role}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="w-full">{renderTabContent()}</div>
        </div>
      </MainLayout>

      {moderationAction && (
        <ModerationActionDrawer
          isOpen={Boolean(moderationAction)}
          config={moderationActionConfigs[moderationAction.type]}
          profileRole={role}
          onClose={() => setModerationAction(null)}
          onSubmit={handleModerationSubmit}
        />
      )}
    </>
  );
};

export default AccountsTemplate;