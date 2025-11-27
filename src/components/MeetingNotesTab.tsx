import { useState, useEffect } from 'react';
import { Plus, Clock, Users, Sparkles, FileText, Edit2, Trash2, Save, X, Download } from 'lucide-react';

interface MeetingNote {
  id: string;
  teamId: string;
  title: string;
  date: string;
  duration: string;
  attendees: string[];
  content: string;
  summary: string;
  actionItems: ActionItem[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

interface MeetingNotesTabProps {
  teamId: string;
  user: any;
}

export default function MeetingNotesTab({ teamId, user }: MeetingNotesTabProps) {
  const [meetings, setMeetings] = useState<MeetingNote[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingNote | null>(null);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, [teamId]);

  const loadMeetings = () => {
    const savedMeetings = localStorage.getItem(`meetings_${teamId}`);
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings));
    }
  };

  const saveMeetings = (updatedMeetings: MeetingNote[]) => {
    localStorage.setItem(`meetings_${teamId}`, JSON.stringify(updatedMeetings));
    setMeetings(updatedMeetings);
  };

  const generateAISummary = async (content: string): Promise<{ summary: string; actionItems: ActionItem[] }> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract key points (simple algorithm for demo)
    const lines = content.split('\n').filter(line => line.trim());
    const keyPoints = lines
      .filter(line => line.includes('결정') || line.includes('진행') || line.includes('완료') || line.includes('논의'))
      .slice(0, 3);

    const summary = keyPoints.length > 0
      ? `📌 주요 내용:\n${keyPoints.map(point => `• ${point.trim()}`).join('\n')}\n\n이번 회의에서는 ${keyPoints.length}개의 주요 안건이 논의되었으며, 각 항목에 대한 구체적인 실행 계획이 수립되었습니다.`
      : '이번 회의에서는 팀 프로젝트의 전반적인 진행 상황을 점검하고, 향후 일정에 대해 논의하였습니다.';

    // Extract action items
    const actionItems: ActionItem[] = lines
      .filter(line => line.includes('할 일') || line.includes('TODO') || line.includes('과제'))
      .slice(0, 3)
      .map((line, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        task: line.replace(/할 일|TODO|과제/gi, '').trim() || `작업 항목 ${index + 1}`,
        assignee: user.name,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false
      }));

    return { summary, actionItems };
  };

  const createMeeting = async (meeting: Omit<MeetingNote, 'id' | 'summary' | 'actionItems' | 'createdAt'>) => {
    setIsGeneratingSummary(true);

    const { summary, actionItems } = await generateAISummary(meeting.content);

    const newMeeting: MeetingNote = {
      ...meeting,
      id: Math.random().toString(36).substr(2, 9),
      summary,
      actionItems,
      createdAt: new Date().toISOString()
    };

    const updated = [...meetings, newMeeting];
    saveMeetings(updated);
    setSelectedMeeting(newMeeting);
    setShowNewMeeting(false);
    setIsGeneratingSummary(false);
  };

  const deleteMeeting = (meetingId: string) => {
    saveMeetings(meetings.filter(m => m.id !== meetingId));
    if (selectedMeeting?.id === meetingId) {
      setSelectedMeeting(null);
    }
  };

  const toggleActionItem = (meetingId: string, actionItemId: string) => {
    const updated = meetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          actionItems: meeting.actionItems.map(item =>
            item.id === actionItemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return meeting;
    });
    saveMeetings(updated);
    if (selectedMeeting?.id === meetingId) {
      setSelectedMeeting(updated.find(m => m.id === meetingId) || null);
    }
  };

  const exportMeeting = (meeting: MeetingNote) => {
    const content = `
# ${meeting.title}

**날짜:** ${new Date(meeting.date).toLocaleDateString('ko-KR')}
**소요 시간:** ${meeting.duration}
**참석자:** ${meeting.attendees.join(', ')}

## 회의 내용
${meeting.content}

## AI 요약
${meeting.summary}

## 액션 아이템
${meeting.actionItems.map(item => `- [${item.completed ? 'x' : ' '}] ${item.task} (담당: ${item.assignee}, 기한: ${item.dueDate})`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-6 h-[600px]">
      {/* Meeting List */}
      <div className="w-80 flex flex-col">
        <button
          onClick={() => setShowNewMeeting(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-4" />
          새 회의록
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {meetings.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              회의록이 없습니다
            </div>
          ) : (
            meetings.map(meeting => (
              <button
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting)}
                className={`w-full p-4 rounded-lg text-left transition-colors ${selectedMeeting?.id === meeting.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate mb-1">{meeting.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(meeting.date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="size-3" />
                  {meeting.duration}
                  <span>•</span>
                  <Users className="size-3" />
                  {meeting.attendees.length}명
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Meeting Detail */}
      <div className="flex-1 flex flex-col">
        {selectedMeeting ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-gray-900">{selectedMeeting.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportMeeting(selectedMeeting)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Download className="size-4" />
                  내보내기
                </button>
                <button
                  onClick={() => deleteMeeting(selectedMeeting.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Meeting Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">날짜</div>
                    <div className="text-gray-900">
                      {new Date(selectedMeeting.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">소요 시간</div>
                    <div className="text-gray-900">{selectedMeeting.duration}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">참석자</div>
                    <div className="text-gray-900">{selectedMeeting.attendees.join(', ')}</div>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-5 text-purple-600" />
                  <h4 className="text-gray-900">AI 자동 요약</h4>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {selectedMeeting.summary}
                </div>
              </div>

              {/* Action Items */}
              {selectedMeeting.actionItems.length > 0 && (
                <div>
                  <h4 className="text-gray-900 mb-3">액션 아이템</h4>
                  <div className="space-y-2">
                    {selectedMeeting.actionItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleActionItem(selectedMeeting.id, item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.task}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            담당: {item.assignee} • 기한: {new Date(item.dueDate).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meeting Content */}
              <div>
                <h4 className="text-gray-900 mb-3">회의 내용</h4>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {selectedMeeting.content}
                  </pre>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                작성자: {selectedMeeting.createdByName} • {new Date(selectedMeeting.createdAt).toLocaleString('ko-KR')}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">회의록을 선택하세요</h3>
              <p className="text-gray-600 mb-4">왼쪽에서 회의록을 선택하거나 새로 작성하세요</p>
              <button
                onClick={() => setShowNewMeeting(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                회의록 작성하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Meeting Modal */}
      {showNewMeeting && (
        <NewMeetingModal
          user={user}
          onClose={() => setShowNewMeeting(false)}
          onCreate={createMeeting}
          isGenerating={isGeneratingSummary}
        />
      )}
    </div>
  );
}

interface NewMeetingModalProps {
  user: any;
  onClose: () => void;
  onCreate: (meeting: Omit<MeetingNote, 'id' | 'summary' | 'actionItems' | 'createdAt'>) => void;
  isGenerating: boolean;
}

function NewMeetingModal({ user, onClose, onCreate, isGenerating }: NewMeetingModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('1시간');
  const [attendees, setAttendees] = useState<string[]>([user.name]);
  const [content, setContent] = useState('');
  const [newAttendee, setNewAttendee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onCreate({
        teamId: '',
        title,
        date,
        duration,
        attendees,
        content,
        createdBy: user.id,
        createdByName: user.name
      });
    }
  };

  const addAttendee = () => {
    if (newAttendee && !attendees.includes(newAttendee)) {
      setAttendees([...attendees, newAttendee]);
      setNewAttendee('');
    }
  };

  const removeAttendee = (name: string) => {
    setAttendees(attendees.filter(a => a !== name));
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <Sparkles className="size-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg text-gray-900 mb-2">AI가 회의록을 분석중입니다...</h3>
          <p className="text-gray-600">자동으로 요약과 액션 아이템을 생성하고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-xl text-gray-900">새 회의록 작성</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              회의 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 1차 프로젝트 기획 회의"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">소요 시간</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>30분</option>
                <option>1시간</option>
                <option>1시간 30분</option>
                <option>2시간</option>
                <option>2시간 30분</option>
                <option>3시간</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">참석자</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름 입력"
              />
              <button
                type="button"
                onClick={addAttendee}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attendees.map(name => (
                <span
                  key={name}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2"
                >
                  {name}
                  {name !== user.name && (
                    <button
                      type="button"
                      onClick={() => removeAttendee(name)}
                      className="hover:text-blue-900"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              회의 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={12}
              placeholder="회의 내용을 자유롭게 작성하세요. AI가 자동으로 요약하고 액션 아이템을 추출합니다."
              required
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="size-5 text-purple-600 mt-0.5" />
              <div className="text-sm text-purple-900">
                <p className="mb-1">AI가 자동으로 회의록을 분석합니다:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>핵심 내용 요약</li>
                  <li>액션 아이템 추출</li>
                  <li>담당자 및 기한 할당</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4" />
              AI 요약과 함께 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
