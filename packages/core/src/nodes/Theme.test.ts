import { describe, it, expect } from 'vitest'
import { ThemeSingleton } from '@io-gui/core'

const theme = ThemeSingleton
const binding = theme._reactiveProperties.get('themeID')!.binding

describe('Theme', () => {
  it('Should register property definitions correctly', () => {
    expect(theme._reactiveProperties.get('themeID')).toEqual({
      binding: binding,
      init: undefined,
      reflect: false,
      type: String,
      value: theme.themeID,
    })
  })
})
