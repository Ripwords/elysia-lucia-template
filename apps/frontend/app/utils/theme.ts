import { definePreset } from "@primevue/themes"
import Aura from "@primevue/themes/aura"

const preset = definePreset(Aura)

export default {
  preset,
  options: {
    darkModeSelector: "system",
    cssLayer: {
      name: "primevue",
      order: "tailwind-base, primevue, tailwind-utilities",
    },
  },
}
