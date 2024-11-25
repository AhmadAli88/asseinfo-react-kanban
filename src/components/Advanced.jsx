import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const AdvancedKanbanBoard = () => {
  const initialBoards = [
    {
      id: 1,
      title: 'To Do',
      cards: [
        { 
          id: 1, 
          title: 'Research competitors',
          description: 'Analyze market competitors',
          priority: 'high',
          dueDate: '2024-12-01',
          assignee: 'John Doe',
          tags: ['research', 'marketing']
        },
        { 
          id: 2, 
          title: 'Design mockups',
          description: 'Create initial UI designs',
          priority: 'medium',
          dueDate: '2024-12-15',
          assignee: 'Jane Smith',
          tags: ['design', 'ui']
        }
      ]
    },
    {
      id: 2,
      title: 'In Progress',
      cards: [
        { 
          id: 3, 
          title: 'Build API',
          description: 'Implement REST endpoints',
          priority: 'high',
          dueDate: '2024-11-30',
          assignee: 'Mike Johnson',
          tags: ['backend', 'api']
        }
      ]
    },
    {
      id: 3,
      title: 'Done',
      cards: []
    }
  ];

  const [boards, setBoards] = useState(initialBoards);
  const [draggedCard, setDraggedCard] = useState(null);
  const [showNewCardForm, setShowNewCardForm] = useState({ visible: false, boardId: null });
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  const handleDragStart = (e, card, boardId) => {
    setDraggedCard({ ...card, boardId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetBoardId) => {
    e.preventDefault();
    
    if (draggedCard && draggedCard.boardId !== targetBoardId) {
      const newBoards = boards.map(board => {
        if (board.id === draggedCard.boardId) {
          return {
            ...board,
            cards: board.cards.filter(card => card.id !== draggedCard.id)
          };
        }
        if (board.id === targetBoardId) {
          return {
            ...board,
            cards: [...board.cards, { ...draggedCard }]
          };
        }
        return board;
      });
      
      setBoards(newBoards);
    }
    setDraggedCard(null);
  };

  const handleDeleteCard = (boardId, cardId) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.filter(card => card.id !== cardId)
        };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const handleAddCard = (boardId) => {
    if (!newCard.title.trim()) return;

    const newCardWithId = {
      ...newCard,
      id: Date.now(),
      tags: newCard.tags
    };

    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: [...board.cards, newCardWithId]
        };
      }
      return board;
    });

    setBoards(newBoards);
    setNewCard({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      tags: []
    });
    setShowNewCardForm({ visible: false, boardId: null });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !newCard.tags.includes(newTag.trim())) {
      setNewCard({
        ...newCard,
        tags: [...newCard.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted';
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex gap-4 overflow-auto pb-4">
        {boards.map(board => (
          <div
            key={board.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, board.id)}
          >
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{board.title}</h5>
                <button 
                  className="btn btn-link"
                  onClick={() => setShowNewCardForm({ visible: true, boardId: board.id })}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-2">
                  {showNewCardForm.visible && showNewCardForm.boardId === board.id && (
                    <div className="bg-light p-3 rounded shadow border">
                      <input
                        type="text"
                        placeholder="Task title"
                        className="form-control mb-2"
                        value={newCard.title}
                        onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                      />
                      <textarea
                        placeholder="Description"
                        className="form-control mb-2"
                        value={newCard.description}
                        onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                      />
                      <select
                        className="form-control mb-2"
                        value={newCard.priority}
                        onChange={(e) => setNewCard({ ...newCard, priority: e.target.value })}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <input
                        type="date"
                        className="form-control mb-2"
                        value={newCard.dueDate}
                        onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Assignee"
                        className="form-control mb-2"
                        value={newCard.assignee}
                        onChange={(e) => setNewCard({ ...newCard, assignee: e.target.value })}
                      />
                      <div className="d-flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Add tag"
                          className="form-control flex-grow-1"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={handleAddTag}
                        >
                          Add Tag
                        </button>
                      </div>
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {newCard.tags.map((tag, index) => (
                          <span key={index} className="badge bg-secondary">
                            {tag}
                            <button
                              className="ms-1 text-danger"
                              onClick={() => setNewCard({
                                ...newCard,
                                tags: newCard.tags.filter((_, i) => i !== index)
                              })}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowNewCardForm({ visible: false, boardId: null })}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAddCard(board.id)}
                        >
                          Add Task
                        </button>
                      </div>
                    </div>
                  )}
                  {board.cards.map(card => (
                    <div
                      key={card.id}
                      className="card mb-2"
                      draggable
                      onDragStart={(e) => handleDragStart(e, card, board.id)}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="card-title">{card.title}</h6>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-link text-danger"
                              onClick={() => handleDeleteCard(board.id, card.id)}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="card-text">{card.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className={`text-muted ${getPriorityColor(card.priority)}`}>
                            <strong>Priority:</strong> {card.priority}
                          </div>
                          <div className="d-flex gap-1">
                            <span className="badge bg-primary">{card.assignee}</span>
                            {card.dueDate && (
                              <span className="badge bg-info">{card.dueDate}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedKanbanBoard;
