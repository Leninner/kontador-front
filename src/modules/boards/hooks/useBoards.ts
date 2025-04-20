import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { boardsService } from '../services/boards.service'
import { CreateBoardColumnDto, UpdateBoardColumnDto } from '../interfaces/board.interface'
import { toast } from 'sonner'

export const useBoards = () => {
  const queryClient = useQueryClient()

  const board = useQuery({
    queryKey: ['board'],
    queryFn: () => boardsService.findMyBoard(),
  })

  const createColumn = useMutation({
    mutationFn: (data: CreateBoardColumnDto) => boardsService.createColumn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Columna creada correctamente')
    },
  })

  const updateColumn = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardColumnDto }) => boardsService.updateColumn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Columna actualizada correctamente')
    },
  })

  const deleteColumn = useMutation({
    mutationFn: ({ id }: { id: string }) => boardsService.deleteColumn(board.data?.id || '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Columna eliminada correctamente')
    },
  })

  const ADD_NEW_COLUMN = {
    id: '',
    name: 'Añadir nueva sección',
    description: '',
    color: '#FFD700',
    cards: [],
    createdAt: '',
    updatedAt: '',
  }

  return {
    boardData: {
      ...board.data,
      columns: [...(board.data?.columns || []), ADD_NEW_COLUMN],
    },
    isLoading: board.isLoading,
    error: board.error,
    createColumn,
    updateColumn,
    deleteColumn,
  }
}
