import { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Search, Image as ImageIcon } from 'lucide-react';
import { mockUsers } from '../utils/mockData';

interface Message {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  replyTo?: string;
}

interface MessengerTabProps {
  teamId: string;
  user: any;
}

export default function MessengerTab({ teamId, user }: MessengerTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
    // Simulate receiving messages in real-time
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.95) { // 5% chance every second
        simulateIncomingMessage();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [teamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const savedMessages = localStorage.getItem(`messages_${teamId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with welcome message
      const welcomeMsg: Message = {
        id: 'welcome',
        teamId,
        userId: 'system',
        userName: 'TeamMatch',
        content: '팀 메신저에 오신 것을 환영합니다! 팀원들과 자유롭게 소통하세요. 💬',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages([welcomeMsg]);
      localStorage.setItem(`messages_${teamId}`, JSON.stringify([welcomeMsg]));
    }
  };

  const saveMessages = (updatedMessages: Message[]) => {
    localStorage.setItem(`messages_${teamId}`, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      userId: user.id,
      userName: user.name,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    saveMessages([...messages, newMessage]);
    setInputText('');
    inputRef.current?.focus();
  };

  const simulateIncomingMessage = () => {
    // Get team members from localStorage
    const savedTeams = localStorage.getItem('teams');
    if (!savedTeams) return;

    const teams = JSON.parse(savedTeams);
    const team = teams.find((t: any) => t.id === teamId);
    if (!team) return;

    // Get a random team member (not current user)
    const otherMembers = team.members.filter((id: string) => id !== user.id);
    if (otherMembers.length === 0) return;

    const randomMemberId = otherMembers[Math.floor(Math.random() * otherMembers.length)];
    const randomMember = mockUsers.find(u => u.id === randomMemberId);
    if (!randomMember) return;

    const sampleMessages = [
      '오늘 회의 몇 시에 하나요?',
      '문서 확인했습니다!',
      '제가 맡은 부분 내일까지 완료하겠습니다.',
      '다들 진행 상황 어떤가요?',
      '자료 공유 감사합니다 👍',
      '이번 주 금요일까지 완료 가능할까요?',
      '회의록 작성했으니 확인 부탁드립니다.',
      '좋은 아이디어네요!',
    ];

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      userId: randomMember.id,
      userName: randomMember.name,
      content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    const currentMessages = JSON.parse(localStorage.getItem(`messages_${teamId}`) || '[]');
    saveMessages([...currentMessages, newMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  const filteredMessages = searchTerm
    ? messages.filter(m => 
        m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  const messageGroups = groupMessagesByDate(filteredMessages);

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg text-gray-900">팀 메신저</h3>
          <p className="text-sm text-gray-600">{messages.length}개의 메시지</p>
        </div>

        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="메시지 검색..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="size-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Divider */}
            <div className="flex items-center justify-center mb-4">
              <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                {date}
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {msgs.map((message, index) => {
                const isOwn = message.userId === user.id;
                const isSystem = message.userId === 'system';
                const prevMessage = index > 0 ? msgs[index - 1] : null;
                const showAvatar = !prevMessage || prevMessage.userId !== message.userId;

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm max-w-md text-center">
                        {message.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                      <div className="size-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                        {message.userName[0]}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 ${isOwn ? 'flex justify-end' : ''}`}>
                      {showAvatar && !isOwn && (
                        <div className="text-sm text-gray-600 mb-1">{message.userName}</div>
                      )}
                      <div className="flex items-end gap-2">
                        {isOwn && (
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        )}
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.content}
                        </div>
                        {!isOwn && (
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="pt-4 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="이모지"
          >
            <Smile className="size-5 text-gray-600" />
          </button>
          
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="파일 첨부"
          >
            <Paperclip className="size-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <kbd className="px-2 py-0.5 bg-gray-100 rounded">Enter</kbd>
          <span>전송</span>
          <span className="mx-1">•</span>
          <kbd className="px-2 py-0.5 bg-gray-100 rounded">Shift + Enter</kbd>
          <span>줄바꿈</span>
        </div>
      </form>
    </div>
  );
}
