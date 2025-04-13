import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { boardsService } from './boards.service'
import { CreateBoardColumnCardCommentDto, UpdateBoardColumnCardDto } from './interfaces/board.interface'
import { toast } from 'sonner'

export const useCards = (cardId: string) => {
  const queryClient = useQueryClient()

  const card = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => boardsService.getCardDetails(cardId),
    enabled: !!cardId,
  })

  const updateCard = useMutation({
    mutationFn: ({ id, ...rest }: UpdateBoardColumnCardDto) =>
      boardsService.updateCard(id, rest as UpdateBoardColumnCardDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Tarjeta actualizada correctamente')
    },
  })

  const addComment = useMutation({
    mutationFn: (data: CreateBoardColumnCardCommentDto) => boardsService.addComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      toast.success('Comentario agregado correctamente')
    },
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: string) => boardsService.deleteComment(cardId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      toast.success('Comentario eliminado correctamente')
    },
  })

  const linkCustomer = useMutation({
    mutationFn: (customerId: string) => boardsService.linkCustomer(cardId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Cliente vinculado correctamente')
    },
  })

  const unlinkCustomer = useMutation({
    mutationFn: () => boardsService.unlinkCustomer(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Cliente desvinculado correctamente')
    },
  })

  return {
    card,
    updateCard,
    addComment,
    deleteComment,
    linkCustomer,
    unlinkCustomer,
  }
}
