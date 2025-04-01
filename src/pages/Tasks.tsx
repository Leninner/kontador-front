'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from '@/components/ui/kibo-ui/kanban';
import { TaskPanel } from '@/components/ui/kibo-ui/kanban/TaskPanel';
import type { DragEndEvent, Feature } from '@/components/ui/kibo-ui/kanban';
import { useState } from 'react';
import {
	endOfMonth,
	startOfMonth,
	subDays,
	subMonths,
} from 'date-fns';

const today = new Date();

const exampleStatuses = [
	{ id: '1', name: 'Planned', color: '#6B7280' },
	{ id: '2', name: 'In Progress', color: '#F59E0B' },
	{ id: '3', name: 'Done', color: '#10B981' },
];

const exampleFeatures = [
	{
		id: '1',
		name: 'AI Scene Analysis',
		startAt: startOfMonth(subMonths(today, 6)),
		endAt: subDays(endOfMonth(today), 5),
		status: exampleStatuses[0],
		group: { id: '1', name: 'Core AI Features' },
		product: { id: '1', name: 'Video Editor Pro' },
		owner: {
			id: '1',
			image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1',
			name: 'Alice Johnson',
		},
		initiative: { id: '1', name: 'AI Integration' },
		release: { id: '1', name: 'v1.0' },
	}
];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric'
});

export const TasksPage = () => {
	const [features, setFeatures] = useState(exampleFeatures);
	const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) {
			return;
		}

		const status = exampleStatuses.find((status) => status.name === over.id);

		if (!status) {
			return;
		}

		setFeatures(
			features.map((feature) => {
				if (feature.id === active.id) {
					return { ...feature, status };
				}

				return feature;
			})
		);
	};

	const handleCardClick = (feature: Feature) => {
		setSelectedFeature(feature);
	};

	const handleSave = (feature: Feature) => {
		setFeatures(
			features.map((f) => {
				if (f.id === feature.id) {
					return feature;
				}
				return f;
			})
		);
		setSelectedFeature(null);
	};

	return (
		<>
			<KanbanProvider onDragEnd={handleDragEnd} className="p-4">
				{exampleStatuses.map((status) => (
					<KanbanBoard key={status.name} id={status.name}>
						<KanbanHeader name={status.name} color={status.color} />
						<KanbanCards>
							{features
								.filter((feature) => feature.status.name === status.name)
								.map((feature, index) => (
									<KanbanCard
										key={feature.id}
										id={feature.id}
										name={feature.name}
										parent={status.name}
										index={index}
										onClick={() => handleCardClick(feature)}
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex flex-col gap-1">
												<p className="m-0 flex-1 font-medium text-sm">
													{feature.name}
												</p>
												<p className="m-0 text-muted-foreground text-xs">
													{feature.initiative.name}
												</p>
											</div>
											{feature.owner && (
												<Avatar className="h-4 w-4 shrink-0">
													<AvatarImage src={feature.owner.image} />
													<AvatarFallback>
														{feature.owner.name?.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
											)}
										</div>
										<p className="m-0 text-muted-foreground text-xs">
											{shortDateFormatter.format(feature.startAt)} -{' '}
											{dateFormatter.format(feature.endAt)}
										</p>
									</KanbanCard>
								))}
						</KanbanCards>
					</KanbanBoard>
				))}
			</KanbanProvider>

			<TaskPanel
				feature={selectedFeature}
				isOpen={!!selectedFeature}
				onClose={() => setSelectedFeature(null)}
				onSave={handleSave}
			/>
		</>
	);
};