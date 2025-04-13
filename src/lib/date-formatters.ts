export class DateFormatter {
  private static instance: DateFormatter
  private readonly formatter: Intl.DateTimeFormat
  private readonly shortFormatter: Intl.DateTimeFormat

  private constructor() {
    this.formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    this.shortFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  public static getInstance(): DateFormatter {
    if (!DateFormatter.instance) {
      DateFormatter.instance = new DateFormatter()
    }
    return DateFormatter.instance
  }

  public format(date: Date): string {
    return this.formatter.format(date)
  }

  public formatShort(date: Date): string {
    return this.shortFormatter.format(date)
  }

  public isOverdue(date: Date): boolean {
    return date < new Date()
  }
}
