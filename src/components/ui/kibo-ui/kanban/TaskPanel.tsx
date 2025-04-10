import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BoardColumnCard } from '@/modules/boards/interfaces/board.interface';

interface TaskPanelProps {
	card: BoardColumnCard | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (card: BoardColumnCard) => void;
}

export const TaskPanel = ({ card, isOpen, onClose, onSave }: TaskPanelProps) => {
	if (!isOpen || !card) return null;

	return (
		<div className="fixed inset-0 z-50">
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black/50 z-40"
				onClick={onClose}
			/>

			{/* Panel */}
			<div className="fixed right-0 top-0 h-screen w-[700px] bg-background border-l shadow-lg z-50 flex flex-col">
				{/* Header */}
				<div className="border-b p-6 flex-shrink-0">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">{card.name}</h2>
						<Button variant="ghost" size="sm" onClick={onClose}>
							Close
						</Button>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					<div className="space-y-6">
						{/* Owner */}
						<div className="flex items-center gap-2">
							<Avatar className="h-8 w-8">
								<AvatarImage src={card.name} />
								<AvatarFallback>
									{card.name?.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-sm font-medium">{card.name}</p>
								<p className="text-xs text-muted-foreground">Owner</p>
							</div>
						</div>

						{/* Task Details */}
						<div className="space-y-4">
							<div>
								<p className="text-sm font-medium">Initiative</p>
								<p className="text-sm text-muted-foreground">{card.name}</p>
							</div>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Add a description..."
								className="min-h-[100px]"
							/>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t p-6 flex-shrink-0">
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={() => onSave(card)}>Save Changes</Button>
					</div>
				</div>
			</div>
		</div>
	);
}; 