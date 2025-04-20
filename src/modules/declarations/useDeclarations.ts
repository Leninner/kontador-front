import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { declarationsService } from './declarations.service'
import { CreateDeclarationDto, Declaration, FindAllDeclarationsDto } from './declarations.interface'
import { toast } from 'sonner'

export const useDeclarations = (params: FindAllDeclarationsDto = {}) => {
  const queryClient = useQueryClient()

  const { data: declarationsData = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } }, isLoading } =
    useQuery({
      queryKey: ['declarations', params],
      queryFn: () => declarationsService.findAll(params),
    })

  const createDeclaration = useMutation({
    mutationFn: (data: CreateDeclarationDto) => declarationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['declarations'] })
      toast.success('Declaración creada exitosamente', {
        description: 'La declaración ha sido registrada correctamente.',
      })
    },
    onError: (error: Error) => {
      toast.error('Error al crear declaración', {
        description: error.message || 'Ocurrió un error al intentar crear la declaración.',
      })
    },
  })

  const updateDeclaration = useMutation({
    mutationFn: (data: { id: string; data: Partial<Declaration> }) => declarationsService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['declarations'] })
      toast.success('Declaración actualizada exitosamente', {
        description: 'La declaración ha sido actualizada correctamente.',
      })
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar declaración', {
        description: error.message || 'Ocurrió un error al intentar actualizar la declaración.',
      })
    },
  })

  const deleteDeclaration = useMutation({
    mutationFn: (id: string) => declarationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['declarations'] })
      toast.success('Declaración eliminada exitosamente', {
        description: 'La declaración ha sido eliminada correctamente.',
      })
    },
    onError: (error: Error) => {
      toast.error('Error al eliminar declaración', {
        description: error.message || 'Ocurrió un error al intentar eliminar la declaración.',
      })
    },
  })

  return {
    declarationsData,
    isLoading,
    createDeclaration,
    updateDeclaration,
    deleteDeclaration,
  }
}
