/* eslint-disable @typescript-eslint/no-explicit-any */

export class CreateRuleDto {
  id: string = ''
  name: string
  enabled: boolean
  trigger: {
    type: string
    config?: Record<string, any>
  }
  conditions: Array<{
    type: string
    config?: Record<string, any>
  }>
  action: {
    type: string
    config?: Record<string, any>
  }

  constructor(rule: Rule) {
    this.name = rule.name
    this.enabled = rule.enabled
    this.trigger = rule.trigger
    this.conditions = rule.conditions
    this.action = rule.action
  }

  static convertRuleToCreateDto(rule: Rule, columnId: string): CreateRuleDto {
    return {
      id: this.generateRandomRuleId(columnId),
      name: rule.name,
      enabled: rule.enabled,
      trigger: rule.trigger,
      conditions: rule.conditions,
      action: rule.action,
    }
  }

  static generateRandomRuleId(columnId: string): string {
    return `rule-${Math.random().toString(36).substring(2, 15)}-${columnId.toString().slice(0, 8)}`
  }
}

export interface Rule {
  id: string
  name: string
  enabled: boolean
  trigger: {
    type: string
    config?: Record<string, any>
  }
  conditions: Array<{
    type: string
    config?: Record<string, any>
  }>
  action: {
    type: string
    config?: Record<string, any>
  }
}
