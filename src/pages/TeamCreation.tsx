import { useState } from 'react';
import { ArrowLeft, Users, BookOpen } from 'lucide-react';
import { Team } from '../utils/mockData';

interface TeamCreationProps {
  user: any;
  onTeamCreated: (teamId: string) => void;
  onCancel: () => void;
}

export default function TeamCreation({ user, onTeamCreated, onCancel }: TeamCreationProps) {
  const [teamName, setTeamName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const newTeam: Team = {
      id: Math.random().toString(36).substr(2, 9),
      name: teamName,
      courseId,
      courseName,
      ownerId: user.id,
      members: [user.id],
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const savedTeams = localStorage.getItem('teams');
    const teams: Team[] = savedTeams ? JSON.parse(savedTeams) : [];
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));

    onTeamCreated(newTeam.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="size-5" />
        뒤로가기
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="size-8 text-blue-600" />
          <h1 className="text-2xl text-gray-900">새 팀 만들기</h1>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              팀 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 캡스톤 디자인 A조"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                과목명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 캡스톤 디자인"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                과목 코드
              </label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: CS401"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              팀 소개
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              placeholder="팀의 목표나 프로젝트 내용을 간단히 설명해주세요"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm text-blue-900 mb-2">💡 팀 생성 후 할 수 있는 것</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• AI 추천을 통해 최적의 팀원 초대</li>
              <li>• 할 일 관리 및 칸반 보드 활용</li>
              <li>• 공동 문서 작성 및 파일 공유</li>
              <li>• 팀 일정 관리</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              팀 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
