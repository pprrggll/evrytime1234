import { useState, useEffect } from 'react';
import { ArrowLeft, CheckSquare, FileText, Calendar, FolderOpen, Users, MessageSquare, ClipboardList } from 'lucide-react';
import { Team } from '../utils/mockData';
import TaskKanban from '../components/TaskKanban';
import WorkspaceTab from '../components/WorkspaceTab';
import CalendarTab from '../components/CalendarTab';
import FilesTab from '../components/FilesTab';
import MembersTab from '../components/MembersTab';
import MessengerTab from '../components/MessengerTab';
import MeetingNotesTab from '../components/MeetingNotesTab';

interface TeamDashboardProps {
  teamId: string;
  user: any;
  onBack: () => void;
}

type Tab = 'tasks' | 'workspace' | 'calendar' | 'files' | 'members' | 'messenger' | 'meetings';

export default function TeamDashboard({ teamId, user, onBack }: TeamDashboardProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('messenger');
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    // Load team from localStorage
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      const teams: Team[] = JSON.parse(savedTeams);
      const foundTeam = teams.find(t => t.id === teamId);
      setTeam(foundTeam || null);
    }
  }, [teamId]);

  useEffect(() => {
    // Check for unread messages
    if (activeTab !== 'messenger') {
      const messages = localStorage.getItem(`messages_${teamId}`);
      if (messages) {
        const parsed = JSON.parse(messages);
        const lastRead = localStorage.getItem(`lastRead_${teamId}_${user.id}`);
        if (lastRead) {
          const unread = parsed.filter((m: any) =>
            new Date(m.timestamp) > new Date(lastRead) && m.userId !== user.id
          ).length;
          setUnreadMessages(unread);
        }
      }
    } else {
      setUnreadMessages(0);
      localStorage.setItem(`lastRead_${teamId}_${user.id}`, new Date().toISOString());
    }
  }, [activeTab, teamId, user.id]);

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-600">팀을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'messenger' as Tab, label: '메신저', icon: MessageSquare, badge: unreadMessages },
    { id: 'tasks' as Tab, label: '할 일', icon: CheckSquare },
    { id: 'workspace' as Tab, label: '문서', icon: FileText },
    { id: 'meetings' as Tab, label: '회의록', icon: ClipboardList },
    { id: 'calendar' as Tab, label: '일정', icon: Calendar },
    { id: 'files' as Tab, label: '파일', icon: FolderOpen },
    { id: 'members' as Tab, label: '팀원', icon: Users }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="size-5" />
          매칭 대시보드로
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl text-gray-900 mb-1">{team.name}</h1>
              <p className="text-gray-600">{team.courseName}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="size-5" />
              <span>{team.members.length}명</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Icon className="size-5" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'messenger' && <MessengerTab teamId={teamId} user={user} />}
          {activeTab === 'tasks' && <TaskKanban teamId={teamId} user={user} />}
          {activeTab === 'workspace' && <WorkspaceTab teamId={teamId} user={user} />}
          {activeTab === 'meetings' && <MeetingNotesTab teamId={teamId} user={user} />}
          {activeTab === 'calendar' && <CalendarTab teamId={teamId} user={user} />}
          {activeTab === 'files' && <FilesTab teamId={teamId} user={user} />}
          {activeTab === 'members' && <MembersTab team={team} currentUser={user} />}
        </div>
      </div>
    </div>
  );
}
