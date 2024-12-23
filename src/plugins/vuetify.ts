import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'
import { VDateInput } from 'vuetify/labs/VDateInput'
import DayJsAdapter from '@date-io/dayjs'
import ptBR from 'dayjs/locale/pt-br'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  components: {
    VDateInput
  },
  date: {
    adapter: DayJsAdapter,
    locale: {
      pt: ptBR
    }
  },
  locale: {
    locale: 'pt',
    messages: {
      pt
    }
  }
})
