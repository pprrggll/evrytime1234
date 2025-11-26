import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Trash2, Edit2, Calendar as CalendarIcon } from 'lucide-react';

interface Task {
  id: string;
  teamId: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  status: 'todo' | 'inprogress' | 'done';
  dueDate: string;
  createdAt: string;
}

interface TaskKanbanProps {
  teamId: string;
  user: any;
}

const COLUMNS = [
  { id: 'todo' as const, label: '할 일', color: 'bg-gray-100' },
  { id: 'inprogress' as const, label: '진행 중', color: 'bg-blue-50' },
  { id: 'done' as const, label: '완료', color: 'bg-green-50' }
];

export default function TaskKanban({ teamId, user }: TaskKanbanProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<'todo' | 'inprogress' | 'done'>('todo');

  useEffect(() => {
    loadTasks();
  }, [teamId]);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem(`tasks_${teamId}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem(`tasks_${teamId}`, JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const addTask = (title: string, description: string, dueDate: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      title,
      description,
      assigneeId: user.id,
      assigneeName: user.name,
      status: newTaskColumn,
      dueDate,
      createdAt: new Date().toISOString()
    };
    saveTasks([...tasks, newTask]);
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    saveTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, status);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-gray-900">작업 보드</h2>
        <button
          onClick={() => {
            setNewTaskColumn('todo');
            setShowNewTask(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-4" />
          새 작업
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(task => task.status === column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} rounded-lg p-3 mb-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">{column.label}</h3>
                  <span className="text-sm text-gray-600">{columnTasks.length}</span>
                </div>
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className="flex-1 space-y-3 min-h-[200px]"
              >
                {columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    onDragStart={handleDragStart}
                  />
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    작업이 없습니다
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setNewTaskColumn(column.id);
                  setShowNewTask(true);
                }}
                className="mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                + 작업 추가
              </button>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <NewTaskModal
          columnId={newTaskColumn}
          onClose={() => setShowNewTask(false)}
          onAdd={addTask}
        />
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

function TaskCard({ task, onDelete, onDragStart }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white p-4 rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-gray-900 flex-1">{task.title}</h4>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="size-4 text-gray-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="size-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
            {task.assigneeName[0]}
          </div>
          <span className="text-gray-600">{task.assigneeName}</span>
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            <CalendarIcon className="size-3" />
            <span>{new Date(task.dueDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface NewTaskModalProps {
  columnId: string;
  onClose: () => void;
  onAdd: (title: string, description: string, dueDate: string) => void;
}

function NewTaskModal({ columnId, onClose, onAdd }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onAdd(title, description, dueDate);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg text-gray-900 mb-4">새 작업 추가</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="작업 제목"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="작업 내용 (선택사항)"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">마감일</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
