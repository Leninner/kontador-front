import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { boardsService } from './boards.service'
import { BoardColumnCard } from './interfaces/board.interface'

export const useCards = (cardId: string) => {
  const queryClient = useQueryClient()

  const card = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => boardsService.getCardDetails(cardId),
    enabled: !!cardId,
  })

  const updateCard = useMutation({
    mutationFn: (data: Partial<BoardColumnCard>) => boardsService.updateCard(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const addComment = useMutation({
    mutationFn: (content: string) => boardsService.addComment(cardId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
    },
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: string) => boardsService.deleteComment(cardId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
    },
  })

  const linkCustomer = useMutation({
    mutationFn: (customerId: string) => boardsService.linkCustomer(cardId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const unlinkCustomer = useMutation({
    mutationFn: () => boardsService.unlinkCustomer(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
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
