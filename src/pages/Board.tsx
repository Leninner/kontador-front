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

const dateFormatter = DateFormatter.getInstance();

export const BoardPage = () => {
	const { boardData, createColumn, updateColumn } = useBoards();
	const [features, setFeatures] = useState(boardData.columns);
	const [selectedFeature, setSelectedFeature] = useState<BoardColumnCard | null>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) {
			return;
		}

		const column = boardData.columns.find((column) => column.name === over.id);

		if (!column) {
			return;
		}

		setFeatures(
			features.map((feature) => {
				if (feature.id === active.id) {
					return { ...feature, status: column };
				}

				return feature;
			})
		);
	};

	const handleCardClick = (card: BoardColumnCard) => {
		setSelectedFeature(card);
	};

	const handleSave = (card: BoardColumnCard) => {
		console.log(card);
		setSelectedFeature(null);
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
									onAddCard={() => setSelectedFeature(null)}
									onUpdateName={(newName) => handleUpdateColumnName(column.id, newName)}
								/>
								<KanbanCards>
									{column.cards.map((card, index) => (
										<KanbanCard
											key={card.id}
											id={card.id}
											name={card.name}
											description={card.description || ''}
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
											<p className="m-0 text-muted-foreground text-xs">
												{dateFormatter.format(new Date())}
											</p>
										</KanbanCard>
									))}
									<Button>
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
				card={selectedFeature}
				isOpen={!!selectedFeature}
				onClose={() => setSelectedFeature(null)}
				onSave={handleSave}
			/>
		</>
	);
};