export { default as ActivityCard } from '../..\\components\\ActivityCard.vue'
export { default as AgentsList } from '../..\\components\\AgentsList.vue'
export { default as AuthFeedback } from '../..\\components\\AuthFeedback.vue'
export { default as ClientEdit } from '../..\\components\\ClientEdit.vue'
export { default as ContactsList } from '../..\\components\\ContactsList.vue'
export { default as CreateClientForm } from '../..\\components\\CreateClientForm.vue'
export { default as DashboardHeader } from '../..\\components\\DashboardHeader.vue'
export { default as DocumentItem } from '../..\\components\\DocumentItem.vue'
export { default as ImageItem } from '../..\\components\\ImageItem.vue'
export { default as LeadsList } from '../..\\components\\LeadsList.vue'
export { default as List } from '../..\\components\\List.vue'
export { default as UploadCsv } from '../..\\components\\UploadCsv.vue'
export { default as VideoItem } from '../..\\components\\VideoItem.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
