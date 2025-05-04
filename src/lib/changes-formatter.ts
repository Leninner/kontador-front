interface NameChange {
  name: {
    old: string
    new: string
  }
}

interface DateChange {
  old: string
  new: string
}

interface DueDateChange {
  dueDate: DateChange
}

interface CustomerChange {
  oldCustomerId: string
  newCustomerId: string
  customerName: string
}

interface CommentChange {
  commentId: string
}

interface DescriptionChange {
  description: {
    old: string
    new: string
  }
}

interface ColumnChange {
  oldColumnId: string
  oldColumnName: string
  newColumnId: string
  newColumnName: string
}

interface PriorityChange {
  priority: {
    old: string
    new: string
  }
}

export type HistoryChanges =
  | NameChange
  | DateChange
  | DueDateChange
  | CustomerChange
  | CommentChange
  | DescriptionChange
  | ColumnChange
  | PriorityChange

export class ChangesFormatter {
  private static instance: ChangesFormatter

  private constructor() {}

  public static getInstance(): ChangesFormatter {
    if (!ChangesFormatter.instance) {
      ChangesFormatter.instance = new ChangesFormatter()
    }
    return ChangesFormatter.instance
  }

  public formatChanges(changes: HistoryChanges): string {
    if (!changes) return ''

    if (this.isCommentChange(changes)) {
      return 'Comentario eliminado'
    }

    if (this.isCustomerChange(changes)) {
      return `Cliente cambiado a ${changes.customerName}`
    }

    if (this.isDueDateChange(changes)) {
      const oldDate = new Date(changes.dueDate.old)
      const newDate = new Date(changes.dueDate.new)
      return `Fecha límite cambiada de ${this.formatDate(oldDate)} a ${this.formatDate(newDate)}`
    }

    if (this.isNameChange(changes)) {
      return `Nombre cambiado de "${changes.name.old}" a "${changes.name.new}"`
    }

    if (this.isDescriptionChange(changes)) {
      return 'Descripción actualizada'
    }

    if (this.isDateChange(changes)) {
      const oldDate = new Date(changes.old)
      const newDate = new Date(changes.new)
      return `Fecha cambiada de ${this.formatDate(oldDate)} a ${this.formatDate(newDate)}`
    }

    if (this.isColumnChange(changes)) {
      return `Movida de "${changes.oldColumnName}" a "${changes.newColumnName}"`
    }

    if (this.isPriorityChange(changes)) {
      return `Prioridad cambiada de "${changes.priority.old}" a "${changes.priority.new}"`
    }

    return ''
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  private isPriorityChange(changes: HistoryChanges): changes is PriorityChange {
    return 'priority' in changes
  }

  private isCommentChange(changes: HistoryChanges): changes is CommentChange {
    return 'commentId' in changes
  }

  private isCustomerChange(changes: HistoryChanges): changes is CustomerChange {
    return 'oldCustomerId' in changes && 'newCustomerId' in changes
  }

  private isDueDateChange(changes: HistoryChanges): changes is DueDateChange {
    return 'dueDate' in changes
  }

  private isNameChange(changes: HistoryChanges): changes is NameChange {
    return 'name' in changes
  }

  private isDescriptionChange(changes: HistoryChanges): changes is DescriptionChange {
    return 'description' in changes
  }

  private isDateChange(changes: HistoryChanges): changes is DateChange {
    return 'old' in changes && 'new' in changes && typeof changes.old === 'string' && !('name' in changes)
  }

  private isColumnChange(changes: HistoryChanges): changes is ColumnChange {
    return 'oldColumnId' in changes && 'newColumnId' in changes
  }
}
