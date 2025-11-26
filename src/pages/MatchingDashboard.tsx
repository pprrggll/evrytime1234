import { useState, useEffect } from 'react';
import { Plus, Filter, Users, TrendingUp, Search, Target, X } from 'lucide-react';
import { recommendCandidates, MatchScore } from '../utils/matchingAlgorithm';
import { mockUsers, mockTeams, Team } from '../utils/mockData';
import RecommendCard from '../components/RecommendCard';
import TeamCard from '../components/TeamCard';

interface MatchingDashboardProps {
  user: any;
  onCreateTeam: () => void;
  onTeamSelect: (teamId: string) => void;
}

export default function MatchingDashboard({ user, onCreateTeam, onTeamSelect }: MatchingDashboardProps) {
  const [recommendations, setRecommendations] = useState<MatchScore[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [filterRole, setFilterRole] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Get recommendations
    const recs = recommendCandidates(user, mockUsers, 12);
    setRecommendations(recs);

    // Load user's teams
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      const teams: Team[] = JSON.parse(savedTeams);
      const userTeams = teams.filter(t => t.members.includes(user.id));
      setMyTeams(userTeams);
    }
  }, [user]);

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesRole = filterRole === '전체' || rec.matchedOn.includes(filterRole);
    const matchesSearch = searchTerm === '' ||
      rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.major.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">팀원 매칭</h1>
          <p className="text-sm text-gray-600">
            AI가 분석한 최적의 팀원을 찾아보세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <Users className="size-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{recommendations.length}</div>
                <div className="text-sm text-gray-600">추천 팀원</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {recommendations.length > 0 ? Math.round(recommendations[0].score * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">최고 매칭률</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <Target className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{myTeams.length}</div>
                <div className="text-sm text-gray-600">참여 팀</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Teams Section */}
        {myTeams.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900">내 팀</h2>
              <button
                onClick={onCreateTeam}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="size-4" />
                새 팀 만들기
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTeams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={() => onTeamSelect(team.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름, 전공으로 검색..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${showFilters
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
            >
              <Filter className="size-4" />
              필터
              {showFilters && <X className="size-3" />}
            </button>

            {myTeams.length === 0 && (
              <button
                onClick={onCreateTeam}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="size-4" />
                팀 만들기
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {['전체', '시간대', '스킬', '관심사', '성향', '역할'].map(role => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterRole === role
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">
              추천 팀원
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredRecommendations.length})
              </span>
            </h2>
          </div>

          {filteredRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecommendations.map(rec => (
                <RecommendCard
                  key={rec.userId}
                  recommendation={rec}
                  currentUser={user}
                  onInvite={(userId) => {
                    console.log('Invite user:', userId);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center size-12 bg-gray-100 rounded-full mb-4">
                <Users className="size-6 text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-1">검색 결과가 없습니다</h3>
              <p className="text-sm text-gray-600">다른 필터나 검색어를 시도해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
