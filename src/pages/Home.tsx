"use client"

import { Search, MessageSquare, User } from "lucide-react"

interface HomeProps {
  onNavigate: (page: string) => void
}

export default function Home({ onNavigate }: HomeProps) {
  const boards = [
    { name: "자유게시판", count: 1234 },
    { name: "비공개게시판", count: 567 },
    { name: "공동구매게시판", count: 89 },
    { name: "새내기게시판", count: 456 },
    { name: "시사/이슈", count: 234 },
    { name: "정보게시판", count: 890 },
    { name: "질문게시판", count: 678 },
    { name: "미테크게시판", count: 123 },
  ]

  const posts = [
    {
      id: 1,
      board: "자유게시판",
      title: "오늘 학식 진짜 맛있더라 ㅋㅋ",
      content: "2학 한식 추천",
      time: "10분 전",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      board: "비밀게시판",
      title: "솔직히 이번 중간고사 너무 어려웠음",
      content: "",
      time: "10분 전",
      likes: 5,
      comments: 0,
    },
    {
      id: 3,
      board: "자유게시판",
      title: "도서관 자리 왜이렇게 없냐ㅠㅠ",
      content: "",
      time: "10분 전",
      likes: 0,
      comments: 0,
    },
    {
      id: 4,
      board: "자유게시판",
      title: "12월에 종강이면 좋겠다",
      content: "",
      time: "11/27 23:12",
      likes: 0,
      comments: 0,
    },
    {
      id: 5,
      board: "정보게시판",
      title: "컴공 전공 수업 추천 좀",
      content: "",
      time: "11/27 23:12",
      likes: 0,
      comments: 0,
    },
  ]

  const hotPosts = [
    { title: "새벽 4시까지 과제하고 학교 왔습니다...", time: "11/27 11:01" },
    { title: "교양 추천 받아요! 꿀강의로", time: "11/27 11:01" },
    { title: "중도에서 자는 사람들 진짜 어떻게 자는거임?", time: "11/27 20:00" },
  ]

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/images/sywjqjljmbxpyruexm-zvb75g-nmiomf7t7syqem-vkvmvitc5xoyjwyspszoamjzsgd-trhc0chw-3zzxadqg.webp"
                alt="세종대 로고"
                className="size-8 rounded-full"
              />
              <span className="font-bold text-gray-900">세종대</span>
            </div>

            {/* Main Menu */}
            <nav className="flex items-center gap-8">
              <button className="text-sm text-gray-900 font-medium border-b-2 border-red-500 pb-3">게시판</button>
              <button className="text-sm text-gray-600 hover:text-gray-900 pb-3">시간표</button>
              <button className="text-sm text-gray-600 hover:text-gray-900 pb-3">강의실</button>
              <button className="text-sm text-gray-600 hover:text-gray-900 pb-3">학점계산기</button>
              <button className="text-sm text-gray-600 hover:text-gray-900 pb-3">친구</button>
              <button className="text-sm text-gray-600 hover:text-gray-900 pb-3">책방</button>
              <button
                onClick={() => onNavigate("matching")}
                className="text-sm text-gray-600 hover:text-gray-900 pb-3 font-medium hover:text-red-500 transition-colors"
              >
                팀 프로젝트
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <MessageSquare className="size-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <User className="size-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar - Boards */}
          <aside className="col-span-2">
            <div className="bg-white rounded border border-gray-200">
              {/* User Profile */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="size-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <User className="size-8 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-900 text-sm mb-1">김세종</div>
                  <div className="text-xs text-gray-500">세종대학교</div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    내 정보
                  </button>
                  <button className="flex-1 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    로그아웃
                  </button>
                </div>
              </div>

              {/* Board List */}
              <div className="py-2">
                <div className="px-3 py-2">
                  <div className="text-xs text-gray-500 font-medium mb-1">내 게시판</div>
                </div>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <span>내가 쓴 글</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <span>댓글 단 글</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <span>내 스크랩</span>
                </button>
              </div>

              <div className="border-t border-gray-200 py-2">
                {boards.map((board, idx) => (
                  <button
                    key={idx}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span>{board.name}</span>
                    <span className="text-xs text-gray-400">{board.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Posts */}
          <main className="col-span-7">
            <div className="bg-white rounded border border-gray-200">
              {/* Post List Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-gray-900">전체 게시판</h2>
                  <button className="px-3 py-1.5 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors">
                    글쓰기
                  </button>
                </div>
              </div>

              {/* Christmas Banner */}
              <div className="p-4 bg-gradient-to-r from-red-50 to-green-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">기말고사 화이팅! 🎄</div>
                    <div className="text-sm text-gray-700">다들 좋은 성적 받고 행복한 크리스마스 보내세요</div>
                    <div className="text-xs text-gray-600 mt-1">마지막까지 힘내자! 우리 모두 A+ 가즈아</div>
                  </div>
                  <div className="text-4xl">🎄🎅</div>
                </div>
              </div>

              {/* Posts */}
              <div>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-red-500 font-medium">{post.board}</span>
                          <span className="text-xs text-gray-400">{post.time}</span>
                        </div>
                        <h3 className="text-sm text-gray-900 mb-1 truncate">{post.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {post.likes > 0 && <span className="flex items-center gap-1">❤️ {post.likes}</span>}
                        {post.comments > 0 && <span className="flex items-center gap-1">💬 {post.comments}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="col-span-3">
            {/* Search */}
            <div className="bg-white rounded border border-gray-200 p-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="전체 게시판의 글을 검색하세요!"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors">
                  <Search className="size-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* HOT 게시물 */}
            <div className="bg-white rounded border border-gray-200">
              <div className="p-3 border-b border-gray-200 flex items-center gap-2">
                <span className="text-red-500 text-sm font-bold">HOT</span>
                <span className="text-sm font-medium text-gray-900">게시물</span>
              </div>
              <div className="p-3 space-y-3">
                {hotPosts.map((post, idx) => (
                  <div key={idx} className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="text-sm text-gray-900 mb-1 line-clamp-2">{post.title}</div>
                    <div className="text-xs text-gray-400">{post.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BEST 게시판 */}
            <div className="bg-white rounded border border-gray-200 mt-4">
              <div className="p-3 border-b border-gray-200 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">BEST 게시판</span>
              </div>
              <div className="p-3">
                <div className="text-sm text-gray-600 text-center py-4">인기 게시물이 없습니다</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
