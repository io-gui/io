import { ReactiveProperty } from '../decorators/Property.js'
import { Register } from '../decorators/Register.js'
import { Binding } from '../core/Binding.js'
import { ReactiveNode, ReactiveNodeProps, AnyConstructor } from '../nodes/ReactiveNode.js'

class EmulatedLocalStorage {
  declare store: Map<string, unknown>
  declare warned: boolean
  constructor() {
    Object.defineProperty(this, 'store', {value: new Map()})
    Object.defineProperty(this, 'warned', {value: false, writable: true})
  }
  get permitted(): boolean {
    try {
      return self.localStorage.getItem('Storage:user-permitted') === 'true'
    } catch (error) {
      console.warn('Storage: Cannot access localStorage. Check browser privacy settings!')
      console.warn(error)
    }
    return false
  }
  set permitted(permitted: boolean) {
    try {
      if (permitted) {
        console.info('Storage: localStorage permission granted.')
        this.store.set('Storage:user-permitted', String(permitted))
        this.store.forEach((value: unknown, key: string) => {
          self.localStorage.setItem(key, String(value))
          this.store.delete(key)
        })
      } else {
        console.info('Storage: localStorage permission revoked.')
        self.localStorage.setItem('Storage:user-permitted', String(permitted))
        new Map(Object.entries(self.localStorage)).forEach((value: unknown, key: string) => {
          this.store.set(key, value)
        })
        self.localStorage.clear()
      }
    } catch (error) {
      console.warn('Storage: Cannot access localStorage. Check browser privacy settings!')
      console.warn(error)
    }
  }
  setItem(key: string, value: unknown) {
    const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
    if (key === 'Storage:user-permitted') {
      this.permitted = value === 'true'
      return
    }
    if (this.permitted) {
      self.localStorage.setItem(key, strValue)
    } else {
      this.store.set(key, strValue)
      if (!this.warned && !this.permitted) {
        console.warn('Storage: localStorage permission not set.')
        this.warned = true
      }
    }
  }
  getItem(key: string): string | null {
    if (this.permitted) {
      return self.localStorage.getItem(key)
    } else if (this.store.has(key)) {
      return this.store.get(key) as string
    }
    return null
  }
  removeItem(key: string) {
    if (this.permitted) {
      return self.localStorage.removeItem(key)
    } else {
      this.store.delete(key)
    }
  }
  clear() {
    if (this.permitted) {
      return self.localStorage.clear()
    } else {
      this.store.clear()
    }
  }
}

const localStorage = new EmulatedLocalStorage()

type StorageNodes = {
  local: Map<string, StorageNode>
  hash: Map<string, StorageNode>
  none: Map<string, StorageNode>
}

const nodes: StorageNodes = {
  local: new Map(),
  hash: new Map(),
  none: new Map(),
}

let hashValues: Record<string, any> = {}

export type StorageProps = ReactiveNodeProps & {
  key: string
  value: any
  default?: any
  storage?: 'hash' | 'local' | 'none'
}

@Register
export class StorageNode extends ReactiveNode {

  @ReactiveProperty({value: '', type: String})
  declare key: string

  @ReactiveProperty()
  declare value: any

  @ReactiveProperty({value: 'local', type: String})
  declare storage: 'hash' | 'local' | 'none'

  declare binding: Binding

  declare default: any

  constructor(props: StorageProps) {
    debug: {
      if (typeof props !== 'object') {
        console.warn('Ivalid Storage arguments!')
      } else {
        if (typeof props.key !== 'string' || !props.key)
          console.warn('Ivalid Storage key!')
        if (props.storage && ['hash', 'local', 'none'].indexOf(props.storage) === -1)
          console.warn(`Ivalid storage type! ${props.storage}`)
      }
    }

    if (props.storage === undefined) props.storage = 'local'
    if (nodes[props.storage].has(props.key)) {
      return nodes[props.storage].get(props.key)!
    } else {
      let def: any
      // TODO: test!
      let constructor: AnyConstructor | undefined
      if (typeof props.value === 'object' && props.value !== null) {
        constructor = props.value.constructor as AnyConstructor
        def = JSON.stringify(props.value)
      } else {
        def = props.value
      }

      props.default = def

      let storedValue: string | null = null
      switch (props.storage) {
        case 'hash':
          storedValue = getValueFromHash(props.key)
          break
        case 'local':
          storedValue = localStorage.getItem('Storage:' + props.key)
          break
      }
      if (storedValue !== null) {
        try {
          const value = JSON.parse(storedValue)
          props.value = constructor ? new constructor(value) : value
        } catch {
          props.value = storedValue
        }
      }

      super(props)

      this.binding = this.bind('value')
      this.binding.dispose = () => {
        this.clearStorage()
      }

      if (props.key !== '__proto__') { // TODO: Why is this here ffs?
        nodes[props.storage].set(props.key, this)
      }

      return this
    }
  }
  dispose() {
    this.clearStorage()
    super.dispose()
  }
  clearStorage() {
    switch (this.storage) {
      case 'hash': {
        this.removeValueToHash()
        break
      }
      case 'local': {
        localStorage.removeItem('Storage:' + this.key)
        break
      }
    }
    const s = (this.storage) as keyof StorageNodes
    nodes[s].delete(this.key)
  }
  valueMutated() {
    this.debounce(this.changed)
    // this.changed()
  }
  valueChanged() {
    this.changed()
  }
  changed() {
    switch (this.storage) {
      case 'hash': {
        this.saveValueToHash()
        break
      }
      case 'local': {
        if (this.value === this.default || this.value === null || this.value === undefined) {
          localStorage.removeItem('Storage:' + this.key)
        } else {
          if (typeof this.value !== 'object') {
            if (typeof this.value === 'string') {
              localStorage.setItem('Storage:' + this.key, `"${this.value}"`)
            } else if (typeof this.value === 'number') {
              localStorage.setItem('Storage:' + this.key, this.value)
            }
          } else {
            localStorage.setItem('Storage:' + this.key, JSON.stringify(this.value))
          }
        }
        break
      }
    }
  }
  removeValueToHash() {
    hashValues = parseHash(self.location.hash)
    delete hashValues[this.key]

    let hashString = ''
    for (const h in hashValues) {
      hashString += h + '=' + hashValues[h] + '&'
    }
    if (hashString) {
      hashString = hashString.slice(0, -1)
      self.location.hash = hashString
    } else {
      history.replaceState('', document.title, self.location.pathname + self.location.search)
    }
  }
  saveValueToHash() {
    hashValues = parseHash(self.location.hash)

    const value = this.value

    if (value === this.default || value === null || value === undefined) {
      delete hashValues[this.key]
    } else {
      if (typeof value === 'string') {
        if (isNaN(value as unknown as number)) {
          hashValues[this.key] = String(value)
        } else {
          hashValues[this.key] = '"' + value + '"'
        }
      } else if (typeof value === 'number') {
        hashValues[this.key] = String(value)
      } else if (typeof value === 'boolean') {
        hashValues[this.key] = String(value)
      } else {
        debug: {
          console.warn('Storage: Cannot serialize value to hash!', value)
        }
      }
    }

    let hashString = ''
    for (const h in hashValues) {
      hashString += h + '=' + hashValues[h] + '&'
    }
    if (hashString) {
      hashString = hashString.slice(0, -1)
      self.location.hash = hashString
    } else {
      history.replaceState('', document.title, self.location.pathname + self.location.search)
    }
  }
}


export const Storage = Object.assign(
  (props: StorageProps) => {
    const storageNode = new StorageNode(props)
    return storageNode.binding
  }, {
    permit() {
      localStorage.permitted = true
    },
    unpermit() {
      localStorage.permitted = false
    }
  }
)

// TODO: unhack and test
function parseHash(hash: string) {
  return hash.substring(1).split('&').reduce(function (result: Record<string, string>, item) {
    const parts = item.split('=')
    if (parts[0] && parts[1]) {
      result[parts[0]] = parts[1].replace(/%22/g, '"').replace(/%20/g, ' ')
    }
    return result
  }, {})
}

function getValueFromHash(key: string) {
  hashValues = parseHash(self.location.hash)
  return hashValues[key] || null
}

function updateAllFromHash() {
  hashValues = parseHash(self.location.hash)
  for (const h in hashValues) {
    if (nodes.hash.has(h)) {
      const node = nodes.hash.get(h) as StorageNode
      try {
        node.value = JSON.parse(hashValues[h])
      } catch {
        node.value = hashValues[h]
      }
    }
  }

  for (const [key, node] of nodes.hash.entries()) {
    if (hashValues[key] === undefined) {
      node.value = node.default
    }
  }
}

self.addEventListener('hashchange', updateAllFromHash, false)
updateAllFromHash()
