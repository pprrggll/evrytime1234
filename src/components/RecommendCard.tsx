import { useState } from 'react';
import { Star, Code, UserPlus, X, Award } from 'lucide-react';
import { MatchScore } from '../utils/matchingAlgorithm';
import { mockUsers } from '../utils/mockData';

interface RecommendCardProps {
  recommendation: MatchScore;
  currentUser: any;
  onInvite: (userId: string) => void;
}

export default function RecommendCard({ recommendation, currentUser, onInvite }: RecommendCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const candidate = mockUsers.find(u => u.id === recommendation.userId);
  if (!candidate) return null;

  const scorePercentage = Math.round(recommendation.score * 100);
  const isHighMatch = scorePercentage >= 80;

  return (
    <>
      <div
        className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="size-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              {candidate.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{candidate.name}</h3>
              <p className="text-xs text-gray-600 truncate">{candidate.major} · {candidate.year}학년</p>
            </div>
          </div>

          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${isHighMatch
            ? 'bg-green-50 text-green-700'
            : 'bg-indigo-50 text-indigo-700'
            }`}>
            {isHighMatch && <Award className="size-3" />}
            <Star className="size-3 fill-current" />
            {scorePercentage}%
          </div>
        </div>

        {/* Match Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {recommendation.matchedOn.slice(0, 3).map(match => (
            <span
              key={match}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {match}
            </span>
          ))}
          {recommendation.matchedOn.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              +{recommendation.matchedOn.length - 3}
            </span>
          )}
        </div>

        {/* Skills Preview */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <Code className="size-3.5 flex-shrink-0" />
          <span className="truncate">{candidate.skills.slice(0, 3).join(', ')}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInvite(candidate.id);
          }}
          className="w-full py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="size-4" />
          초대하기
        </button>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                  {candidate.name[0]}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{candidate.name}</h2>
                  <p className="text-sm text-gray-600">{candidate.major} · {candidate.year}학년</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Match Score */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">매칭 점수</h3>
                  <div className="text-2xl font-semibold text-indigo-600">
                    {scorePercentage}%
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: '시간대 호환성', value: recommendation.details.timeCompat, color: 'bg-blue-600' },
                    { label: '스킬 중복도', value: recommendation.details.skillOverlap, color: 'bg-green-600' },
                    { label: '관심사 유사도', value: recommendation.details.interestSimilarity, color: 'bg-purple-600' },
                    { label: '성향 호환성', value: recommendation.details.personalityCompat, color: 'bg-orange-600' }
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium text-gray-900">{Math.round(item.value * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.value * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Introduction */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">자기소개</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{candidate.intro}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">보유 스킬</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(skill => {
                    const isCommon = currentUser.skills?.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium ${isCommon
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {skill}
                        {isCommon && ' ✓'}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">관심 분야</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.interests.map(interest => {
                    const isCommon = currentUser.interests?.includes(interest);
                    return (
                      <span
                        key={interest}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium ${isCommon
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {interest}
                        {isCommon && ' ✓'}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Time Preference */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">활동 시간대</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'morning' as const, label: '오전', icon: '🌅' },
                    { key: 'afternoon' as const, label: '오후', icon: '☀️' },
                    { key: 'evening' as const, label: '저녁', icon: '🌆' },
                    { key: 'night' as const, label: '밤', icon: '🌙' }
                  ].map(time => (
                    <div
                      key={time.key}
                      className={`p-3 rounded-lg border text-sm ${candidate.timePref[time.key]
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                    >
                      <span className="mr-2">{time.icon}</span>
                      <span>{time.label}</span>
                      {candidate.timePref[time.key] && currentUser.timePref?.[time.key] && (
                        <span className="ml-2 text-indigo-600">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Preference */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">선호 역할</h3>
                <span className="inline-block px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-md border border-purple-100">
                  {candidate.rolePref}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onInvite(candidate.id);
                  setShowDetails(false);
                }}
                className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="size-4" />
                팀에 초대하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
