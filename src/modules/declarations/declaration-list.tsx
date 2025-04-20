import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { DownloadIcon, EyeIcon } from 'lucide-react'
import { Declaration } from './declarations.interface'
import { useDeclarations } from './useDeclarations'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeclarationDetail } from './declaration-detail'
import { toast } from 'sonner'

export const DeclarationList = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const { declarationsData, isLoading } = useDeclarations({
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
      // For development purposes, we'll just open the URL in a new tab
      // In production, this would be an actual file download
      window.open(declaration.documentUrl, '_blank')

      // For an actual download implementation:
      // const response = await fetch(declaration.documentUrl)
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `Declaracion-${declaration.formType}-${declaration.period}.pdf`
      // document.body.appendChild(a)
      // a.click()
      // window.URL.revokeObjectURL(url)
      // a.remove()

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
    </>
  )
}
