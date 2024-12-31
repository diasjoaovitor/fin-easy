import type { InputTypeHTMLAttribute } from 'vue'

export type TFormMode = 'create' | 'update'

export type TAlertProps = {
  open: boolean
  title: string
  type: 'success' | 'info' | 'warning' | 'error'
  text?: string
}

export type TAuthFormField = {
  name: string
  label: string
  type: InputTypeHTMLAttribute
}
