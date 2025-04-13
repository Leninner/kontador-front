'use client';

import {
	KanbanBoard,
	KanbanCards,
	KanbanProvider,
} from '@/components/ui/kibo-ui/kanban';
import { TaskPanel } from '@/components/ui/kibo-ui/kanban/TaskPanel';
import type { DragEndEvent } from '@/components/ui/kibo-ui/kanban';
import { useState } from 'react';
import { useBoards } from '../modules/boards/useBoards';
import { BoardColumnCard } from '../modules/boards/interfaces/board.interface';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { KanbanHeader } from '../components/ui/kibo-ui/kanban/kanban-header';
import { KanbanCard } from '../components/ui/kibo-ui/kanban/kanban-card';
import { DateFormatter } from '@/lib/date-formatters';
import { CreateColumnDialog } from '@/components/ui/kibo-ui/kanban/create-column-dialog';
import { useCards } from '@/modules/boards/useCard';

const dateFormatter = DateFormatter.getInstance();

export const BoardPage = () => {
	const { boardData, createColumn, updateColumn } = useBoards();
	const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
	const { updateCard } = useCards(selectedCardId || '');
	const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

	const handleDragEnd = (event: DragEndEvent) => {
		const { over, active } = event;

		if (!over) {
			return;
		}

		const column = boardData.columns.find((column) => column.name === over.id);
		const card = column?.cards.find((card) => card.id === active.id);

		// If the card is in the same column, do nothing
		if (!column || card) {
			return;
		}

		setSelectedCardId(active.id as string);

		updateCard.mutate({
			columnId: column.id
		});
	};

	const handleCardClick = (card: BoardColumnCard) => {
		setSelectedCardId(card.id);
		setIsTaskPanelOpen(true);
	};

	const handleAddColumn = (name: string) => {
		createColumn.mutate({
			name,
			boardId: boardData.id || ''
		});
	};

	const handleUpdateColumnName = (columnId: string, newName: string) => {
		updateColumn.mutate({
			id: columnId,
			data: {
				name: newName
			}
		});
	};

	const handleCloseTaskPanel = () => {
		setIsTaskPanelOpen(false);
	};

	return (
		<>
			<KanbanProvider onDragEnd={handleDragEnd} className="p-4">
				{boardData.columns.map((column) => (
					<KanbanBoard key={column.name} id={column.name}>
						{column.id ? (
							<>
								<KanbanHeader
									name={column.name}
									color={column.color || 'yellow'}
									cardCount={column.cards.length}
									onAddCard={() => setSelectedCardId(null)}
									onUpdateName={(newName) => handleUpdateColumnName(column.id, newName)}
								/>
								<KanbanCards>
									{column.cards.map((card, index) => (
										<KanbanCard
											key={card.id}
											id={card.id}
											name={card.name}
											parent={column.name}
											index={index}
											onClick={() => handleCardClick(card)}
										>
											<div className="flex items-start justify-between gap-2">
												<div className="flex flex-col gap-1">
													<p className="m-0 flex-1 font-medium text-sm">
														{card.name}
													</p>

													<p className="m-0 text-muted-foreground text-xs">
														{card.description}
													</p>
												</div>
											</div>
											<div className="flex flex-col items-start gap-1">
												<p className={`m-0 text-xs ${dateFormatter.isOverdue(new Date(card.dueDate)) ? 'text-red-500' : 'text-muted-foreground'}`}>
													{dateFormatter.format(new Date(card.dueDate))}
												</p>
											</div>
										</KanbanCard>
									))}
									<Button variant="outline" className="w-full">
										<Plus />
										Nueva tarjeta
									</Button>
								</KanbanCards>
							</>
						) : (
							<CreateColumnDialog onSave={handleAddColumn} />
						)}
					</KanbanBoard>
				))}
			</KanbanProvider>

			<TaskPanel
				cardId={selectedCardId || ''}
				isOpen={isTaskPanelOpen}
				onClose={handleCloseTaskPanel}
			/>
		</>
	);
};