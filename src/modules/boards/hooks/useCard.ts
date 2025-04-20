import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cardService } from '../services/card.service'
import { UpdateBoardColumnCardDto } from '../interfaces/card.interface'
import { toast } from 'sonner'

export const useCard = (cardId?: string) => {
  const queryClient = useQueryClient()

  const card = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => (cardId ? cardService.getCardDetails(cardId) : null),
    enabled: !!cardId,
  })

  const createCard = useMutation({
    mutationFn: (data: { name: string; description: string; dueDate: Date; columnId: string }) =>
      cardService.createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Tarjeta creada correctamente')
    },
  })

  const updateCard = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardColumnCardDto }) => cardService.updateCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card'] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Tarjeta actualizada correctamente')
    },
  })

  const linkCustomer = useMutation({
    mutationFn: ({ cardId, customerId }: { cardId: string; customerId: string }) =>
      cardService.linkCustomer(cardId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card'] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Cliente vinculado correctamente')
    },
  })

  const unlinkCustomer = useMutation({
    mutationFn: (cardId: string) => cardService.unlinkCustomer(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card'] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Cliente desvinculado correctamente')
    },
  })

  return {
    card: card.data,
    isLoading: card.isLoading,
    error: card.error,
    createCard,
    updateCard,
    linkCustomer,
    unlinkCustomer,
  }
}
