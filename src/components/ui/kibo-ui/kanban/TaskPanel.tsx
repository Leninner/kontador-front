import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BoardColumnCard, BoardColumnCardComment, BoardColumnCardHistory } from '@/modules/boards/interfaces/board.interface';
import { useEffect, useState } from 'react';
import { DateFormatter } from '@/lib/date-formatters';

const dateFormatter = DateFormatter.getInstance();

interface TaskPanelProps {
	card: BoardColumnCard | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (card: BoardColumnCard) => void;
}

export const TaskPanel = ({ card, isOpen, onClose, onSave }: TaskPanelProps) => {
	const [editedCard, setEditedCard] = useState<BoardColumnCard | null>(null);
	const [date, setDate] = useState<Date | undefined>(card?.dueDate ? new Date(card.dueDate) : undefined);
	const [isEditingTitle, setIsEditingTitle] = useState(false);

	useEffect(() => {
		setEditedCard(card);
		setIsEditingTitle(false);
	}, [card]);

	if (!isOpen || !card) return null;

	const handleSave = () => {
		if (editedCard) {
			onSave(editedCard);
		}

		handleCancel()
	};

	const handleInputChange = (field: keyof BoardColumnCard, value: string) => {
		setEditedCard(prev => ({
			...prev!,
			[field]: value
		}));
	};

	const handleCustomerChange = (field: keyof typeof card.customer, value: string) => {
		setEditedCard(prev => ({
			...prev!,
			customer: {
				...prev!.customer,
				[field]: value
			}
		}));
	};

	const handleCancel = () => {
		setIsEditingTitle(false);
		setEditedCard(card);
		onClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setIsEditingTitle(false);
		} else if (e.key === 'Escape') {
			handleCancel();
		}
	};

	return (
		<div className="fixed inset-0 z-50">
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black/50 z-40"
				onClick={handleCancel}
			/>

			{/* Panel */}
			<div className="fixed right-0 top-0 h-screen w-[700px] bg-background border-l shadow-lg z-50 flex flex-col">
				{/* Header */}
				<div className="border-b p-6 flex-shrink-0">
					<div className="flex items-center justify-between gap-4">
						<div className="flex-1 min-w-0 border hover:border-amber-950 border-transparent">
							{isEditingTitle ? (
								<Input
									value={editedCard?.name || card.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
									onKeyDown={handleKeyDown}
									onBlur={() => setIsEditingTitle(false)}
									className="!text-2xl font-semibold border-none focus-visible:!ring-0 shadow-none h-[42px] px-0 md:!text-2xl"
									autoFocus
								/>
							) : (
								<h2
									className="text-2xl font-semibold truncate cursor-pointer hover:text-primary/80 transition-colors py-1"
									onClick={() => setIsEditingTitle(true)}
								>
									{editedCard?.name || card.name}
								</h2>
							)}
						</div>
						<Button variant="ghost" size="sm" onClick={handleCancel}>
							Close
						</Button>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					{/* Customer Info */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium">Customer Information</h3>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Name</Label>
								<Input
									value={editedCard?.customer?.name || card.customer?.name || ''}
									onChange={(e) => handleCustomerChange('name', e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label>Email</Label>
								<Input
									value={editedCard?.customer?.email || card.customer?.email || ''}
									onChange={(e) => handleCustomerChange('email', e.target.value)}
								/>
							</div>
						</div>
					</div>

					{/* Due Date */}
					<div className="space-y-2 mt-6">
						<Label>Due Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!date && "text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? DateFormatter.getInstance().format(date) : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>

					{/* Description */}
					<div className="space-y-2 mt-6">
						<Label>Description</Label>
						<Textarea
							value={editedCard?.description || card.description || ''}
							onChange={(e) => handleInputChange('description', e.target.value)}
							className="min-h-[100px]"
							placeholder="Add a description..."
						/>
					</div>
				</div>

				{/* Footer with Tabs */}
				<div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
					<Tabs defaultValue="activity" className="w-full">
						<div className="border-b">
							<TabsList className="w-full justify-start rounded-none border-b px-4">
								<TabsTrigger value="activity" className="relative">Activity</TabsTrigger>
								<TabsTrigger value="comments" className="relative">Comments</TabsTrigger>
							</TabsList>
						</div>

						<div className="px-4 py-4 h-[200px] overflow-y-auto">
							<TabsContent value="activity" className="mt-0">
								<div className="space-y-4">
									{card.history?.map((item: BoardColumnCardHistory) => (
										<div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
											<div className="flex-1">
												<p className="text-sm font-medium">{item.action}</p>
												<p className="text-sm text-muted-foreground">{item.description}</p>
												<p className="text-xs text-muted-foreground">
													{dateFormatter.format(new Date(item.createdAt))}
												</p>
											</div>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent value="comments" className="mt-0">
								<div className="space-y-4">
									{card.comments?.map((comment: BoardColumnCardComment) => (
										<div key={comment.id} className="flex items-start gap-4 p-4 border rounded-lg">
											<div className="flex-1">
												<p className="text-sm">{comment.content}</p>
												<p className="text-xs text-muted-foreground">
													{dateFormatter.format(new Date(comment.createdAt))}
												</p>
											</div>
										</div>
									))}
								</div>
							</TabsContent>
						</div>
					</Tabs>

					<div className="container flex items-center justify-end gap-4 p-4 border-t">
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" onClick={handleCancel}>
								Cancel
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<Button size="sm" onClick={handleSave}>
								Save Changes
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}; 