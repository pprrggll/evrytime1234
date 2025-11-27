import { useState, useEffect } from 'react';
import { Plus, FileText, Edit2, Trash2, Save, Users, Clock, Share2, Eye } from 'lucide-react';

interface Document {
  id: string;
  teamId: string;
  title: string;
  content: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
  collaborators: string[]; // user IDs currently viewing
  version: number;
}

interface WorkspaceTabProps {
  teamId: string;
  user: any;
}

export default function WorkspaceTab({ teamId, user }: WorkspaceTabProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [teamId]);

  const loadDocuments = () => {
    const savedDocs = localStorage.getItem(`docs_${teamId}`);
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  };

  const saveDocs = (updatedDocs: Document[]) => {
    localStorage.setItem(`docs_${teamId}`, JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const createDocument = () => {
    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      title: '새 문서',
      content: '',
      updatedBy: user.id,
      updatedByName: user.name,
      updatedAt: new Date().toISOString(),
      collaborators: [user.id],
      version: 1
    };
    const updated = [...documents, newDoc];
    saveDocs(updated);
    setSelectedDoc(newDoc);
    setEditTitle(newDoc.title);
    setEditContent(newDoc.content);
    setIsEditing(true);
  };

  const updateDocument = () => {
    if (!selectedDoc) return;

    const updated = documents.map(doc =>
      doc.id === selectedDoc.id
        ? {
          ...doc,
          title: editTitle,
          content: editContent,
          updatedBy: user.id,
          updatedByName: user.name,
          updatedAt: new Date().toISOString(),
          version: doc.version + 1
        }
        : doc
    );
    saveDocs(updated);
    setSelectedDoc(updated.find(d => d.id === selectedDoc.id) || null);
    setIsEditing(false);
  };

  const deleteDocument = (docId: string) => {
    saveDocs(documents.filter(doc => doc.id !== docId));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
    }
  };

  const startEditing = (doc: Document) => {
    setSelectedDoc(doc);
    setEditTitle(doc.title);
    setEditContent(doc.content);
    setIsEditing(true);
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="flex gap-6 h-[600px]">
      {/* Document List */}
      <div className="w-64 flex flex-col">
        <button
          onClick={createDocument}
          className="flex items-center justify-center gap-2 w-full py-2.5 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-4" />
          새 문서
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              문서가 없습니다
            </div>
          ) : (
            documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  setIsEditing(false);
                }}
                className={`w-full p-3 rounded-lg text-left transition-colors ${selectedDoc?.id === doc.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
              >
                <div className="flex items-start gap-2">
                  <FileText className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">{doc.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(doc.updatedAt).toLocaleDateString('ko-KR')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      v{doc.version} • {getWordCount(doc.content)} 단어
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Document Editor */}
      <div className="flex-1 flex flex-col">
        {selectedDoc ? (
          <>
            <div className="flex items-center justify-between mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xl text-gray-900 border-b-2 border-blue-500 focus:outline-none flex-1 mr-4"
                />
              ) : (
                <h3 className="text-xl text-gray-900">{selectedDoc.title}</h3>
              )}

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={updateDocument}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="size-4" />
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(selectedDoc.title);
                        setEditContent(selectedDoc.content);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(selectedDoc)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 className="size-4" />
                      편집
                    </button>
                    <button
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="공유"
                    >
                      <Share2 className="size-4" />
                    </button>
                    <button
                      onClick={() => deleteDocument(selectedDoc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Document Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                마지막 수정: {selectedDoc.updatedByName} · {new Date(selectedDoc.updatedAt).toLocaleString('ko-KR')}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="size-3" />
                버전 {selectedDoc.version}
              </div>
              <div>
                {getWordCount(isEditing ? editContent : selectedDoc.content)} 단어
              </div>
            </div>

            {isEditing ? (
              <div className="flex-1 flex flex-col">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                  placeholder="마크다운 형식으로 작성하세요...

예시:
# 제목
## 부제목

**굵은 글씨** _기울임_

- 목록 항목 1
- 목록 항목 2

[링크](https://example.com)"
                />

                {/* Editing Tips */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-900">
                    💡 <strong>마크다운 팁:</strong> #으로 제목, **로 굵게, *로 기울임, -로 목록을 만들 수 있습니다.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-y-auto">
                {selectedDoc.content ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{selectedDoc.content}</pre>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    내용이 비어있습니다. 편집 버튼을 눌러 작성하세요.
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">공유 문서 작성</h3>
              <p className="text-gray-600 mb-4">왼쪽에서 문서를 선택하거나 새로 만드세요</p>
              <button
                onClick={createDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                새 문서 만들기
              </button>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                <h4 className="text-sm text-blue-900 mb-2">✨ 협업 기능</h4>
                <ul className="text-xs text-blue-800 text-left space-y-1">
                  <li>• 실시간으로 팀원과 문서 공동 작성</li>
                  <li>• 버전 관리로 변경 이력 추적</li>
                  <li>• 마크다운 지원으로 깔끔한 서식</li>
                  <li>• 자동 저장으로 작업 내용 보호</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
