import { useState, useEffect } from 'react';
import { Upload, FileText, Image, File, Download, Trash2, Search } from 'lucide-react';

interface FileItem {
  id: string;
  teamId: string;
  name: string;
  type: string;
  size: number;
  uploaderId: string;
  uploaderName: string;
  uploadedAt: string;
  url?: string;
}

interface FilesTabProps {
  teamId: string;
  user: any;
}

export default function FilesTab({ teamId, user }: FilesTabProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'other'>('all');

  useEffect(() => {
    loadFiles();
  }, [teamId]);

  const loadFiles = () => {
    const savedFiles = localStorage.getItem(`files_${teamId}`);
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  };

  const saveFiles = (updatedFiles: FileItem[]) => {
    localStorage.setItem(`files_${teamId}`, JSON.stringify(updatedFiles));
    setFiles(updatedFiles);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileItem[] = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploaderId: user.id,
      uploaderName: user.name,
      uploadedAt: new Date().toISOString()
    }));

    saveFiles([...files, ...newFiles]);
  };

  const deleteFile = (fileId: string) => {
    saveFiles(files.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="size-8 text-blue-500" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="size-8 text-red-500" />;
    return <File className="size-8 text-gray-500" />;
  };

  const getFileTypeCategory = (type: string): 'image' | 'document' | 'other' => {
    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    return 'other';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || getFileTypeCategory(file.type) === filterType;
    return matchesSearch && matchesType;
  });

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg text-gray-900 mb-1">파일</h2>
          <p className="text-sm text-gray-600">
            {files.length}개 파일 · {formatFileSize(totalSize)}
          </p>
        </div>

        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <Upload className="size-4" />
          파일 업로드
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="파일 이름으로 검색..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all' as const, label: '전체' },
            { id: 'image' as const, label: '이미지' },
            { id: 'document' as const, label: '문서' },
            { id: 'other' as const, label: '기타' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${filterType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-gray-900 truncate mb-1">{file.name}</h4>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="size-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                  {file.uploaderName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 truncate">{file.uploaderName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="size-4" />
                  다운로드
                </button>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          {files.length === 0 ? (
            <>
              <Upload className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">파일이 없습니다</h3>
              <p className="text-gray-600 mb-4">팀원들과 파일을 공유해보세요</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="size-4" />
                첫 파일 업로드
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          ) : (
            <>
              <Search className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 검색어나 필터를 시도해보세요</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
