import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardsService } from '../services/boards.service'
import { CreateColumnRulesDto } from '../interfaces/board.interface'
import { toast } from 'sonner'

export const useColumnRules = () => {
  const queryClient = useQueryClient()

  const updateColumnRules = useMutation({
    mutationFn: ({ id, rules }: { id: string; rules: CreateColumnRulesDto }) =>
      boardsService.updateColumn(id, { rules }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Reglas actualizadas correctamente')
    },
    onError: () => {
      toast.error('Error al actualizar las reglas')
    },
  })

  return {
    updateColumnRules,
  }
}
