'use client';

import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from '@/components/ui/kibo-ui/kanban';
import { TaskPanel } from '@/components/ui/kibo-ui/kanban/TaskPanel';
import type { DragEndEvent } from '@/components/ui/kibo-ui/kanban';
import { useState } from 'react';
import { useBoards } from '../modules/boards/useBoards';
import { BoardColumnCard } from '../modules/boards/interfaces/board.interface';


const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric'
});

export const BoardPage = () => {
	const { boardData } = useBoards()
	console.log(boardData)
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
		// setFeatures(
		// 	features.map((f) => {
		// 		if (f.id === feature.id) {
		// 			return feature;
		// 		}
		// 		return f;
		// 	})
		// );
		console.log(card)
		setSelectedFeature(null);
	};

	return (
		<>
			<KanbanProvider onDragEnd={handleDragEnd} className="p-4">
				{boardData.columns.map((column) => (
					<KanbanBoard key={column.name} id={column.name}>
						<KanbanHeader name={column.name} color={'red'} />

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
										{/* {feature.owner && (
											<Avatar className="h-4 w-4 shrink-0">
												<AvatarImage src={feature.owner.image} />
												<AvatarFallback>
													{feature.owner.name?.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
										)} */}
									</div>
									<p className="m-0 text-muted-foreground text-xs">
										{shortDateFormatter.format(new Date())} -{' '}
										{dateFormatter.format(new Date())}
									</p>
								</KanbanCard>
							))}
						</KanbanCards>
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