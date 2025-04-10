import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { boardsService } from './boards.service'
import { CreateBoardColumnDto, UpdateBoardColumnDto } from './interfaces/board.interface'

export const useBoards = () => {
  const queryClient = useQueryClient()

  const board = useQuery({
    queryKey: ['board'],
    queryFn: () => boardsService.findMyBoard(),
  })

  const createColumn = useMutation({
    mutationFn: (data: CreateBoardColumnDto) => boardsService.createColumn(board.data?.id || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const updateColumn = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardColumnDto }) =>
      boardsService.updateColumn(board.data?.id || '', id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const deleteColumn = useMutation({
    mutationFn: ({ id }: { id: string }) => boardsService.deleteColumn(board.data?.id || '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  return {
    boardData: board.data || { id: '', name: '', description: '', columns: [], createdAt: '', updatedAt: '' },
    isLoading: board.isLoading,
    error: board.error,
    createColumn,
    updateColumn,
    deleteColumn,
  }
}
