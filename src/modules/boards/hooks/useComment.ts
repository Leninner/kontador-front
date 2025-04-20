import { useMutation, useQueryClient } from '@tanstack/react-query'
import { commentService } from '../services/comment.service'
import { CreateBoardColumnCardCommentDto } from '../interfaces/comment.interface'
import { toast } from 'sonner'

export const useComment = () => {
  const queryClient = useQueryClient()

  const addComment = useMutation({
    mutationFn: (data: CreateBoardColumnCardCommentDto) => commentService.addComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card'] })
      toast.success('Comentario añadido correctamente')
    },
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card'] })
      toast.success('Comentario eliminado correctamente')
    },
  })

  return {
    addComment,
    deleteComment,
  }
}
