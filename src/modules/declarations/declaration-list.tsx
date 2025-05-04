import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { DownloadIcon, EyeIcon, SendIcon } from 'lucide-react'
import { Declaration } from './declarations.interface'
import { useDeclarations } from './useDeclarations'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeclarationDetail } from './declaration-detail'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const DeclarationList = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [declarationToSubmit, setDeclarationToSubmit] = useState<Declaration | null>(null)

  const { declarationsData, isLoading, updateDeclaration } = useDeclarations({
    page,
    limit,
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Borrador</Badge>
      case 'submitted':
        return <Badge variant="secondary">Presentada</Badge>
      case 'approved':
        return <Badge>Aprobada</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatFormType = (formType: string) => {
    switch (formType) {
      case '104':
        return 'Formulario 104 - IVA'
      case '103':
        return 'Formulario 103 - Retenciones'
      case '101':
        return 'Formulario 101 - Imp. Renta Sociedades'
      case '102':
        return 'Formulario 102 - Imp. Renta Personas Naturales'
      default:
        return `Formulario ${formType}`
    }
  }

  const handleNextPage = () => {
    if (declarationsData.meta && page < declarationsData.meta.totalPages) {
      setPage(page + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleViewDeclaration = (declaration: Declaration) => {
    setSelectedDeclaration(declaration)
    setDetailDialogOpen(true)
  }

  const handleDownloadDeclaration = async (declaration: Declaration) => {
    if (!declaration.documentUrl) {
      toast.error('No hay documento disponible para descargar')
      return
    }

    try {
      window.open(declaration.documentUrl, '_blank')

      toast.success('Descargando documento', {
        description: `Declaración ${declaration.formType} - ${format(new Date(declaration.period + '-01'), 'MMMM yyyy')}`,
      })
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Error al descargar el documento', {
        description: 'No se pudo descargar el documento. Inténtelo de nuevo más tarde.',
      })
    }
  }

  const handleSubmitDeclaration = (declaration: Declaration) => {
    if (declaration.status !== 'draft') {
      toast.error('La declaración no se puede presentar', {
        description: 'Solo las declaraciones en estado borrador pueden ser presentadas.',
      })
      return
    }

    setDeclarationToSubmit(declaration)
    setConfirmDialogOpen(true)
  }

  const confirmSubmit = async () => {
    if (!declarationToSubmit) return

    try {
      await updateDeclaration.mutateAsync({
        id: declarationToSubmit.id,
        data: {
          status: 'submitted',
          submittedDate: new Date().toISOString(),
        },
      })

      toast.success('Declaración presentada', {
        description: 'La declaración ha sido presentada exitosamente.',
      })
    } catch (error) {
      console.error('Error submitting declaration:', error)
      toast.error('Error al presentar la declaración', {
        description: 'No se pudo presentar la declaración. Inténtelo de nuevo más tarde.',
      })
    } finally {
      setConfirmDialogOpen(false)
      setDeclarationToSubmit(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Declaraciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">Cargando...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Presentación</TableHead>
                    <TableHead className="text-right">Impuesto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {declarationsData.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No hay declaraciones registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    declarationsData.data.map((declaration: Declaration) => (
                      <TableRow key={declaration.id}>
                        <TableCell>{formatFormType(declaration.formType)}</TableCell>
                        <TableCell>{format(new Date(declaration.period + '-01'), 'MMMM yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(declaration.status)}</TableCell>
                        <TableCell>
                          {declaration.submittedDate ? format(new Date(declaration.submittedDate), 'dd/MM/yyyy') : '-'}
                        </TableCell>
                        <TableCell className="text-right">${declaration.totalTax.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDeclaration(declaration)}
                              title="Ver detalles"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            {declaration.status === 'draft' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSubmitDeclaration(declaration)}
                                title="Presentar declaración"
                              >
                                <SendIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {declaration.documentUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadDeclaration(declaration)}
                                title="Descargar PDF"
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {declarationsData.meta && declarationsData.meta.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
                    Anterior
                  </Button>
                  <div className="text-sm">
                    Página {page} de {declarationsData.meta.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page >= declarationsData.meta.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDeclaration && formatFormType(selectedDeclaration.formType)} -{' '}
              {selectedDeclaration && format(new Date(selectedDeclaration.period + '-01'), 'MMMM yyyy')}
            </DialogTitle>
            <DialogDescription>
              Estado: {selectedDeclaration && getStatusBadge(selectedDeclaration.status)}
            </DialogDescription>
          </DialogHeader>

          {selectedDeclaration && <DeclarationDetail declaration={selectedDeclaration} />}

          <div className="flex justify-end space-x-2 mt-4">
            {selectedDeclaration?.status === 'draft' && (
              <Button
                onClick={() => {
                  setDetailDialogOpen(false)
                  handleSubmitDeclaration(selectedDeclaration)
                }}
                className="flex items-center gap-2"
              >
                <SendIcon className="h-4 w-4" />
                Presentar Declaración
              </Button>
            )}
            {selectedDeclaration?.documentUrl && (
              <Button
                variant="outline"
                onClick={() => selectedDeclaration && handleDownloadDeclaration(selectedDeclaration)}
                className="flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                Descargar PDF
              </Button>
            )}
            <Button onClick={() => setDetailDialogOpen(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar presentación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de presentar esta declaración? Una vez presentada, no podrá volver a cambiarla a estado
              borrador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Presentar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
