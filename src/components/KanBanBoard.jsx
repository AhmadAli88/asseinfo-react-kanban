import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Plus, MoreVertical } from 'lucide-react';

const KanbanBoard = () => {
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: 'To Do',
      cards: [
        { id: 1, title: 'Research competitors', description: 'Analyze market competitors' },
        { id: 2, title: 'Design mockups', description: 'Create initial UI designs' }
      ]
    },
    {
      id: 2,
      title: 'In Progress',
      cards: [
        { id: 3, title: 'Build API', description: 'Implement REST endpoints' },
        { id: 4, title: 'Setup CI/CD', description: 'Configure deployment pipeline' }
      ]
    },
    {
      id: 3,
      title: 'Done',
      cards: [
        { id: 5, title: 'Project setup', description: 'Initialize repository' }
      ]
    }
  ]);

  const [draggedCard, setDraggedCard] = useState(null);

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
            cards: [...board.cards, { id: draggedCard.id, title: draggedCard.title, description: draggedCard.description }]
          };
        }
        return board;
      });

      setBoards(newBoards);
    }
    setDraggedCard(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="d-flex gap-4 overflow-auto pb-4">
        {boards.map(board => (
          <div
            key={board.id}
            className="flex-shrink-0" // Adjust width of the board container
            style={{ minWidth: '300px' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, board.id)}
          >
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center p-3">
                <h5>{board.title}</h5>
                <Button variant="link">
                  <Plus className="w-4 h-4" />
                </Button>
              </Card.Header>
              <Card.Body className="p-2">
                <div className="d-flex flex-column gap-2">
                  {board.cards.map(card => (
                    <div
                      key={card.id}
                      className="bg-white p-3 rounded shadow border cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, card, board.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <h6>{card.title}</h6>
                        <Button variant="link" className="p-1">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-muted mt-2">{card.description}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
