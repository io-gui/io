import { AnyConstructor } from 'io-gui';

type PropertyIdentifier = string | RegExp;
export type PropertyGroups = Record<string, Array<PropertyIdentifier>>;
export type PropertyGroupsRecord = Record<string, Array<string>>;
export type EditorGroups = Map<AnyConstructor, PropertyGroups>

const editorGroupsSingleton: EditorGroups = new Map<AnyConstructor, PropertyGroups>([
  [Object, {
    hidden: [/^_/],
  }],
  [Array, {
    main: [/^[0-9]+$/],
  }],
  [HTMLElement, {
    main: ['localName', 'tagName', 'nodeName', /class/i, /attribute/i],
    hidden: [/^on/, /^[A-Z0-9_]*$/, 'childElementCount'],
    content: [/content/i, /inner/i, /outer/i],
    display: [/width/i, /height/i, /top/i, /left/i, /scroll/i, /style/i],
    hierarchy: [/parent/i, /child/i, /element/i, /root/i, /slot/i, /sibling/i, /document/i],
  }],
]);

export function getEditorGroups(object: object, editorGroups: EditorGroups = new Map()): PropertyGroupsRecord {
  debug: if (!object || !(object instanceof Object)) {
    console.warn('`getEditorGroups` should be used with an Object instance');
    return {};
  }

  const aggregatedGroups: PropertyGroups = {
    main: [],
  };

  function aggregateGroups(editorGroups: EditorGroups) {
    for (const [constructorKey, groups] of editorGroups) {
      if (object instanceof constructorKey) {
        for (const g in groups) {
          aggregatedGroups[g] = aggregatedGroups[g] || [];
          aggregatedGroups[g].push(...groups[g]);
          // Remove duplicate identifiers that exist in other groups.
          for (const og in aggregatedGroups) {
            if (og !== g) {
              for (const identifier of groups[g]) {
                if (aggregatedGroups[og].includes(identifier)) {
                  aggregatedGroups[og].splice(aggregatedGroups[og].indexOf(identifier), 1);
                }
              }
            }
          }
        }
      }
    }
  }

  aggregateGroups(editorGroupsSingleton);
  aggregateGroups(editorGroups);

  const groupsRecord: PropertyGroupsRecord = {
    main: [],
  };

  for (const key of Object.keys(object)) {
    let included = false;
    for (const g in aggregatedGroups) {
      const identifiers = aggregatedGroups[g];
      for (const identifier of identifiers) {
        const reg = new RegExp(identifier);
        if (reg.exec(key)) {
          groupsRecord[g] = groupsRecord[g] || [];
          groupsRecord[g].push(key);
          included = true;
        }
      }
    }
    if (!included) {
      groupsRecord.main.push(key);
    }
  }
  // TODO: make sure no property belongs to multiple groups.

  return groupsRecord;
}
