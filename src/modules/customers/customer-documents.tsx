import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { documentsService, CustomerDocument } from "./documents.service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { toast } from 'sonner';

interface CustomerDocumentsProps {
	customerId: string
}

export function CustomerDocuments({ customerId }: CustomerDocumentsProps) {
	const [files, setFiles] = useState<File[]>([])
	const queryClient = useQueryClient()

	const { data: documents = [], isLoading } = useQuery<CustomerDocument[]>({
		queryKey: ['customer-documents', customerId],
		queryFn: () => documentsService.getDocuments(customerId),
	})

	const uploadMutation = useMutation({
		mutationFn: (files: File[]) => documentsService.uploadDocuments(customerId, files),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customer-documents', customerId] })
			toast.success("Documentos subidos correctamente")
			setFiles([])
		},
		onError: () => {
			toast.error("Error al subir documentos")
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (documentId: string) => documentsService.deleteDocument(customerId, documentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customer-documents', customerId] })
			toast.success("Documento eliminado correctamente")
		},
		onError: () => {
			toast.error("Error al eliminar documento")
		},
	})

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(Array.from(e.target.files))
		}
	}

	const handleUpload = () => {
		uploadMutation.mutate(files)
	}

	const handleDelete = (documentId: string) => {
		deleteMutation.mutate(documentId)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Customer Documents</CardTitle>
				<CardDescription>Upload and manage customer documents</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="documents">Documents</Label>
					<Input
						id="documents"
						type="file"
						multiple
						onChange={handleFileChange}
						accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
					/>
				</div>

				{files.length > 0 && (
					<div className="space-y-2">
						<h3 className="font-medium">Selected Files:</h3>
						<ul className="list-disc list-inside">
							{files.map((file, index) => (
								<li key={index} className="text-sm text-muted-foreground">
									{file.name}
								</li>
							))}
						</ul>
						<Button
							onClick={handleUpload}
							disabled={uploadMutation.isPending}
						>
							{uploadMutation.isPending ? "Uploading..." : "Upload Files"}
						</Button>
					</div>
				)}

				<div className="mt-8">
					<h3 className="font-medium mb-4">Uploaded Documents</h3>
					<div className="grid gap-4">
						{isLoading ? (
							<p className="text-sm text-muted-foreground">Loading documents...</p>
						) : documents.length > 0 ? (
							documents.map((doc: CustomerDocument) => (
								<div
									key={doc.id}
									className="flex items-center justify-between p-4 border rounded-lg"
								>
									<div>
										<p className="font-medium">{doc.name}</p>
										<p className="text-sm text-muted-foreground">
											{new Date(doc.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => window.open(doc.url, '_blank')}
										>
											View
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(doc.id)}
											disabled={deleteMutation.isPending}
										>
											<Trash2 className="h-4 w-4 text-red-500" />
										</Button>
									</div>
								</div>
							))
						) : (
							<p className="text-sm text-muted-foreground">No documents uploaded yet</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
} 