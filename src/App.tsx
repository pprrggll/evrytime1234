"use client"

import { useState } from "react"
import { Users, Home, CheckSquare, Menu, X, Bell, Search } from "lucide-react"
import HomePage from "./pages/Home"
import MatchingDashboard from "./pages/MatchingDashboard"
import TeamDashboard from "./pages/TeamDashboard"
import TeamCreation from "./pages/TeamCreation"

type Page = "home" | "matching" | "team-creation" | "team-dashboard"

// Default user - no login needed
const defaultUser = {
  id: "user123",
  email: "demo@university.ac.kr",
  name: "김세종",
  university: "세종대학교",
  major: "컴퓨터공학",
  year: 3,
  skills: ["React", "TypeScript", "Node.js"],
  interests: ["웹 개발", "AI", "디자인"],
  timePref: { morning: true, afternoon: true, evening: false, night: false },
  rolePref: "개발자",
  personality: { agreeableness: 0.7, conscientiousness: 0.8, openness: 0.6 },
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [currentUser, setCurrentUser] = useState<any>(defaultUser)
  const [currentTeam, setCurrentTeam] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleTeamSelect = (teamId: string) => {
    setCurrentTeam(teamId)
    setCurrentPage("team-dashboard")
  }

  // Show home page without sidebar
  if (currentPage === "home") {
    return <HomePage onNavigate={(page) => setCurrentPage(page as Page)} />
  }

  // Sidebar Navigation - Notion style
  const Sidebar = () => {
    return (
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-gray-900/50 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed top-0 left-0 bottom-0 w-64 bg-[#f9fafb] border-r border-gray-200 z-50
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="size-7 bg-indigo-600 rounded-md flex items-center justify-center">
                  <Users className="size-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">TeamMatch</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X className="size-4 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              <button
                onClick={() => setCurrentPage("home")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Home className="size-4 flex-shrink-0" />
                <span>메인으로</span>
              </button>

              <button
                onClick={() => setCurrentPage("matching")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${currentPage === "matching" ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Users className="size-4 flex-shrink-0" />
                <span>팀원 매칭</span>
              </button>

              {currentTeam && (
                <button
                  onClick={() => setCurrentPage("team-dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${currentPage === "team-dashboard"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <CheckSquare className="size-4 flex-shrink-0" />
                  <span>팀 작업공간</span>
                </button>
              )}

              <div className="pt-4 pb-2 px-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">빠른 액션</div>
              </div>

              <button
                onClick={() => setCurrentPage("team-creation")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <div className="size-4 flex items-center justify-center">
                  <div className="size-3 border-2 border-gray-400 rounded"></div>
                </div>
                <span>새 팀 만들기</span>
              </button>
            </nav>

            {/* User Profile */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer group">
                <div className="size-8 bg-indigo-600 rounded-md flex items-center justify-center text-white text-sm">
                  {currentUser.name?.[0] || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</div>
                  <div className="text-xs text-gray-500 truncate">{currentUser.university}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </>
    )
  }

  // Top bar for main content area
  const TopBar = () => {
    return (
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="size-5 text-gray-600" />
          </button>

          <div className="hidden md:flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors relative">
            <Bell className="size-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-indigo-600 rounded-full"></span>
          </button>
        </div>
      </header>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="lg:pl-64">
        <TopBar />

        <main className="min-h-[calc(100vh-3.5rem)]">
          {currentPage === "matching" && (
            <MatchingDashboard
              user={currentUser}
              onCreateTeam={() => setCurrentPage("team-creation")}
              onTeamSelect={handleTeamSelect}
            />
          )}

          {currentPage === "team-creation" && (
            <TeamCreation
              user={currentUser}
              onTeamCreated={handleTeamSelect}
              onCancel={() => setCurrentPage("matching")}
            />
          )}

          {currentPage === "team-dashboard" && currentTeam && (
            <TeamDashboard teamId={currentTeam} user={currentUser} onBack={() => setCurrentPage("matching")} />
          )}
        </main>
      </div>
    </div>
  )
}
