import { Option } from '../nodes/Option.js'

function matchOption(option: Option, search: string) {
  if (option.options.length) return false
  if (option.value !== undefined && String(option.value).toLowerCase().indexOf(search) !== -1) return true
  if (option.label && option.label.toLowerCase().indexOf(search) !== -1) return true
  if (option.hint && option.hint.toLowerCase().indexOf(search) !== -1) return true
  return false
}

export function searchOptions(option: Option, search: string, depth = 5, d = 0) {
  search = search.toLowerCase()
  const suboptions: Option[] = []
  if (d <= depth) for (let i = 0; i < option.options.length; i++) {
    if (matchOption(option.options[i], search)) {
      suboptions.push(option.options[i])
    }
    if (option.options[i].options.length) {
      suboptions.push(...searchOptions(option.options[i], search, depth, d + 1))
    }
  }
  return suboptions
}
