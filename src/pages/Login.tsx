import { useState } from 'react';
import { Users, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      // Signup flow
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        university,
        profileComplete: false,
        createdAt: new Date().toISOString()
      };
      onLogin(newUser);
    } else {
      // Login flow - for demo, use mock user
      const mockUser = {
        id: 'user123',
        email,
        name: '김세종',
        university: '서울대학교',
        profileComplete: true,
        major: '컴퓨터공학',
        year: 3,
        skills: ['React', 'TypeScript', 'Node.js'],
        interests: ['웹개발', '머신러닝'],
        timePref: { morning: true, afternoon: true, evening: false, night: false },
        rolePref: '개발',
        personality: { agreeableness: 0.7, conscientiousness: 0.9, openness: 0.8 }
      };
      onLogin(mockUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="size-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Users className="size-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">TeamMatch</span>
          </div>
          <p className="text-sm text-gray-600">
            AI 기반 팀 매칭 및 협업 플랫폼
          </p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isSignup
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              로그인
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isSignup
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    이름
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    대학교
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="서울대학교"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="example@university.ac.kr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors mt-6 flex items-center justify-center gap-2 group"
            >
              {isSignup ? '계정 만들기' : '로그인'}
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {!isSignup && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="text-sm text-gray-600 hover:text-gray-900 w-full text-center transition-colors">
                비밀번호를 잊으셨나요?
              </button>
            </div>
          )}
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 데모 모드: 아무 이메일/비밀번호로 로그인할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
