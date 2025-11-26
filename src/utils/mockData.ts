import { UserProfile } from './matchingAlgorithm';

export const mockUsers: UserProfile[] = [
  {
    id: 'user1',
    name: '이지민',
    major: '컴퓨터공학',
    year: 3,
    intro: '웹 개발에 관심이 많고, 팀 프로젝트 경험이 풍부합니다.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    interests: ['웹개발', '머신러닝', '오픈소스'],
    timePref: { morning: true, afternoon: true, evening: false, night: false },
    rolePref: '개발',
    personality: { agreeableness: 0.8, conscientiousness: 0.9, openness: 0.7 }
  },
  {
    id: 'user2',
    name: '박서연',
    major: '산업디자인',
    year: 2,
    intro: 'UI/UX 디자인을 전공하고 있으며, 사용자 경험에 집중합니다.',
    skills: ['UI/UX', '디자인', 'Figma', 'Adobe XD'],
    interests: ['디자인', '프로토타입', '창업'],
    timePref: { morning: false, afternoon: true, evening: true, night: false },
    rolePref: '디자인',
    personality: { agreeableness: 0.9, conscientiousness: 0.8, openness: 0.9 }
  },
  {
    id: 'user3',
    name: '정우진',
    major: '경영학',
    year: 4,
    intro: '비즈니스 기획과 마케팅 전략 수립에 강점이 있습니다.',
    skills: ['기획', '마케팅', '데이터분석', 'Excel'],
    interests: ['창업', '마케팅', '경진대회'],
    timePref: { morning: true, afternoon: true, evening: true, night: false },
    rolePref: '기획',
    personality: { agreeableness: 0.7, conscientiousness: 0.9, openness: 0.8 }
  },
  {
    id: 'user4',
    name: '최민수',
    major: '컴퓨터공학',
    year: 3,
    intro: '백엔드 개발과 데이터베이스 설계를 주로 합니다.',
    skills: ['Java', 'Spring', 'MySQL', 'Node.js'],
    interests: ['웹개발', '클라우드', '보안'],
    timePref: { morning: false, afternoon: true, evening: true, night: true },
    rolePref: '개발',
    personality: { agreeableness: 0.6, conscientiousness: 0.9, openness: 0.6 }
  },
  {
    id: 'user5',
    name: '김하늘',
    major: '통계학',
    year: 3,
    intro: '데이터 분석과 머신러닝 모델 구축 경험이 있습니다.',
    skills: ['Python', 'R', '데이터분석', 'TensorFlow'],
    interests: ['머신러닝', 'AI', '데이터사이언스'],
    timePref: { morning: true, afternoon: true, evening: false, night: false },
    rolePref: '데이터분석',
    personality: { agreeableness: 0.7, conscientiousness: 0.8, openness: 0.9 }
  },
  {
    id: 'user6',
    name: '윤서현',
    major: '컴퓨터공학',
    year: 2,
    intro: '모바일 앱 개발에 관심이 많습니다. Flutter로 여러 프로젝트를 진행했습니다.',
    skills: ['Flutter', 'Dart', 'Firebase', 'React'],
    interests: ['앱개발', '웹개발', 'IoT'],
    timePref: { morning: false, afternoon: true, evening: true, night: false },
    rolePref: '개발',
    personality: { agreeableness: 0.8, conscientiousness: 0.7, openness: 0.9 }
  },
  {
    id: 'user7',
    name: '장민지',
    major: '시각디자인',
    year: 3,
    intro: '브랜딩과 그래픽 디자인을 전문으로 합니다.',
    skills: ['디자인', 'Photoshop', 'Illustrator', 'UI/UX'],
    interests: ['디자인', '브랜딩', '마케팅'],
    timePref: { morning: false, afternoon: false, evening: true, night: true },
    rolePref: '디자인',
    personality: { agreeableness: 0.9, conscientiousness: 0.6, openness: 0.9 }
  },
  {
    id: 'user8',
    name: '강태우',
    major: '경제학',
    year: 4,
    intro: '데이터 기반 의사결정과 비즈니스 전략에 관심있습니다.',
    skills: ['데이터분석', 'Excel', 'Python', '기획'],
    interests: ['데이터사이언스', '창업', '경진대회'],
    timePref: { morning: true, afternoon: true, evening: false, night: false },
    rolePref: '기획',
    personality: { agreeableness: 0.8, conscientiousness: 0.9, openness: 0.7 }
  },
  {
    id: 'user9',
    name: '송유진',
    major: '컴퓨터공학',
    year: 2,
    intro: '프론트엔드 개발을 좋아하고, 사용자 인터페이스에 관심이 많습니다.',
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
    interests: ['웹개발', '디자인', '오픈소스'],
    timePref: { morning: false, afternoon: true, evening: true, night: true },
    rolePref: '개발',
    personality: { agreeableness: 0.8, conscientiousness: 0.8, openness: 0.8 }
  },
  {
    id: 'user10',
    name: '임도현',
    major: '인공지능학',
    year: 3,
    intro: '딥러닝과 컴퓨터 비전 연구를 하고 있습니다.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'C++'],
    interests: ['AI', '머신러닝', '연구', '데이터사이언스'],
    timePref: { morning: true, afternoon: true, evening: true, night: true },
    rolePref: '개발',
    personality: { agreeableness: 0.6, conscientiousness: 0.9, openness: 0.9 }
  },
  {
    id: 'user11',
    name: '한지우',
    major: '경영학',
    year: 2,
    intro: '스타트업에 관심이 많고, 마케팅 전략을 공부하고 있습니다.',
    skills: ['마케팅', '기획', 'SNS 마케팅'],
    interests: ['창업', '마케팅', '경진대회'],
    timePref: { morning: false, afternoon: true, evening: true, night: false },
    rolePref: '마케팅',
    personality: { agreeableness: 0.9, conscientiousness: 0.7, openness: 0.9 }
  },
  {
    id: 'user12',
    name: '배준호',
    major: '게임공학',
    year: 3,
    intro: '게임 개발과 그래픽스 프로그래밍에 관심있습니다.',
    skills: ['C++', 'Unity', 'C#', 'OpenGL'],
    interests: ['게임개발', 'AI', '그래픽스'],
    timePref: { morning: false, afternoon: false, evening: true, night: true },
    rolePref: '개발',
    personality: { agreeableness: 0.5, conscientiousness: 0.7, openness: 0.8 }
  }
];

export interface Team {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  ownerId: string;
  members: string[]; // user IDs
  createdAt: string;
}

export const mockTeams: Team[] = [];
