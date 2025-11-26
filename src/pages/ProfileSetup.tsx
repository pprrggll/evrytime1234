import { useState } from 'react';
import { User, BookOpen, Code, Clock, Users, Sparkles } from 'lucide-react';

interface ProfileSetupProps {
  user: any;
  onComplete: (profile: any) => void;
}

const SKILLS = [
  'React', 'TypeScript', 'Python', 'Java', 'C++',
  'Node.js', 'Spring', 'Django', 'Flutter', 'Swift',
  'UI/UX', '기획', '디자인', '마케팅', '데이터분석'
];

const INTERESTS = [
  '웹개발', '앱개발', '머신러닝', 'AI', '게임개발',
  '블록체인', 'IoT', '보안', '클라우드', '데이터사이언스',
  '창업', '경진대회', '연구', '프로토타입', '오픈소스'
];

const ROLES = ['기획', '개발', '디자인', '마케팅', '데이터분석'];

export default function ProfileSetup({ user, onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    major: '',
    year: 1,
    intro: '',
    skills: [] as string[],
    interests: [] as string[],
    timePref: {
      morning: false,
      afternoon: false,
      evening: false,
      night: false
    },
    rolePref: '',
    personality: {
      agreeableness: 0.5,
      conscientiousness: 0.5,
      openness: 0.5
    }
  });

  const toggleSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleTime = (time: keyof typeof profile.timePref) => {
    setProfile(prev => ({
      ...prev,
      timePref: { ...prev.timePref, [time]: !prev.timePref[time] }
    }));
  };

  const handleComplete = () => {
    onComplete(profile);
  };

  const canProceed = () => {
    if (step === 1) return profile.major && profile.year && profile.intro;
    if (step === 2) return profile.skills.length > 0 && profile.interests.length > 0;
    if (step === 3) return Object.values(profile.timePref).some(v => v) && profile.rolePref;
    return true;
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">프로필 설정</span>
            <span className="text-sm text-gray-600">{step}/4</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="size-6 text-blue-600" />
                <h2 className="text-xl text-blue-600">기본 정보</h2>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">전공</label>
                <input
                  type="text"
                  value={profile.major}
                  onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="컴퓨터공학"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">학년</label>
                <select
                  value={profile.year}
                  onChange={(e) => setProfile({ ...profile, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1학년</option>
                  <option value={2}>2학년</option>
                  <option value={3}>3학년</option>
                  <option value={4}>4학년</option>
                  <option value={5}>5학년 이상</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">자기소개</label>
                <textarea
                  value={profile.intro}
                  onChange={(e) => setProfile({ ...profile, intro: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="팀원들에게 자신을 소개해주세요"
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Code className="size-6 text-blue-600" />
                <h2 className="text-xl text-blue-600">스킬 & 관심사</h2>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-3">보유 스킬 (최대 5개)</label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      disabled={!profile.skills.includes(skill) && profile.skills.length >= 5}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        profile.skills.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-3">관심 분야 (최대 5개)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      disabled={!profile.interests.includes(interest) && profile.interests.length >= 5}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        profile.interests.includes(interest)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="size-6 text-blue-600" />
                <h2 className="text-xl text-blue-600">활동 선호도</h2>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-3">선호 작업 시간대</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'morning' as const, label: '오전 (9-12시)', icon: '🌅' },
                    { key: 'afternoon' as const, label: '오후 (12-18시)', icon: '☀️' },
                    { key: 'evening' as const, label: '저녁 (18-22시)', icon: '🌆' },
                    { key: 'night' as const, label: '밤 (22시 이후)', icon: '🌙' }
                  ].map(time => (
                    <button
                      key={time.key}
                      onClick={() => toggleTime(time.key)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        profile.timePref[time.key]
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{time.icon}</div>
                      <div className="text-sm">{time.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-3">선호 역할</label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => setProfile({ ...profile, rolePref: role })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        profile.rolePref === role
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Personality */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="size-6 text-blue-600" />
                <h2 className="text-xl text-blue-600">성향 분석</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-700">협동성</label>
                    <span className="text-sm text-blue-600">{Math.round(profile.personality.agreeableness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={profile.personality.agreeableness}
                    onChange={(e) => setProfile({
                      ...profile,
                      personality: { ...profile.personality, agreeableness: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>독립적</span>
                    <span>협동적</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-700">성실성</label>
                    <span className="text-sm text-blue-600">{Math.round(profile.personality.conscientiousness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={profile.personality.conscientiousness}
                    onChange={(e) => setProfile({
                      ...profile,
                      personality: { ...profile.personality, conscientiousness: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>유연함</span>
                    <span>계획적</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-700">개방성</label>
                    <span className="text-sm text-blue-600">{Math.round(profile.personality.openness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={profile.personality.openness}
                    onChange={(e) => setProfile({
                      ...profile,
                      personality: { ...profile.personality, openness: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>보수적</span>
                    <span>혁신적</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  이 정보는 최적의 팀원을 매칭하는데 사용됩니다.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                완료
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
