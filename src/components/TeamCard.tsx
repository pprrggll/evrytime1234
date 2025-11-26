import { Users, Calendar, ArrowRight } from 'lucide-react';
import { Team } from '../utils/mockData';

interface TeamCardProps {
  team: Team;
  onClick: () => void;
}

export default function TeamCard({ team, onClick }: TeamCardProps) {
  const createdDate = new Date(team.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
            {team.name}
          </h3>
          <p className="text-xs text-gray-600 truncate">{team.courseName}</p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0">
          <Users className="size-4 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Users className="size-3.5" />
          <span>{team.members.length}명의 팀원</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="size-3.5" />
          <span>{createdDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-indigo-600 group-hover:gap-3 transition-all">
        <span>작업공간 열기</span>
        <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}
