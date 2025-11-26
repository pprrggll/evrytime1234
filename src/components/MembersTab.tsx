import { useState } from 'react';
import { UserPlus, MoreVertical, Crown, Mail, Calendar } from 'lucide-react';
import { Team, mockUsers } from '../utils/mockData';

interface MembersTabProps {
  team: Team;
  currentUser: any;
}

export default function MembersTab({ team, currentUser }: MembersTabProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const members = mockUsers.filter(u => team.members.includes(u.id));
  const isOwner = team.ownerId === currentUser.id;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg text-gray-900 mb-1">팀원</h2>
          <p className="text-sm text-gray-600">{members.length}명의 멤버</p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="size-4" />
            팀원 초대
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {members.map(member => {
          const isMemberOwner = team.ownerId === member.id;
          
          return (
            <div
              key={member.id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-900">{member.name}</h3>
                      {isMemberOwner && (
                        <Crown className="size-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{member.major}</p>
                  </div>
                </div>

                {isOwner && !isMemberOwner && (
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical className="size-4 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="size-4" />
                  <span>{member.email || `${member.name.toLowerCase()}@university.ac.kr`}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4" />
                  <span>{member.year}학년</span>
                </div>
              </div>

              {member.skills && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {member.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          team={team}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

interface InviteModalProps {
  team: Team;
  onClose: () => void;
}

function InviteModal({ team, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send an invitation email
      alert(`${email}로 초대 이메일을 발송했습니다!`);
      onClose();
    }
  };

  const availableUsers = mockUsers.filter(u => !team.members.includes(u.id));

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <h3 className="text-xl text-gray-900">팀원 초대</h3>
        </div>

        <div className="p-6">
          {/* Email Invite */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">이메일로 초대</label>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@university.ac.kr"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                초대
              </button>
            </form>
          </div>

          {/* Suggested Members */}
          <div>
            <h4 className="text-sm text-gray-700 mb-3">추천 팀원</h4>
            <div className="space-y-2">
              {availableUsers.slice(0, 5).map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-sm text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-600">{user.major} · {user.year}학년</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert(`${user.name}님에게 초대를 보냈습니다!`);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    초대
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
