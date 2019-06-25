export function isValuePropertyOf(prop, object) {
  for (let key in object) if (object[key] === prop) return key;
  return null;
}

export function getObjectLabel(object) {
  let label = object.constructor.name;
  if (object.name) label += ' (' + object.name + ')';
  else if (object.label) label += ' (' + object.label + ')';
  else if (object.title) label += ' (' + object.title + ')';
  else if (object.id) label += ' (' + object.id + ')';
  return label;
}

export function filterObject(object, predicate) {
  if (predicate(object)) return object;
  for (let key in object) {
    if (predicate(object[key])) {
        return object[key];
    } else if (typeof object[key] === 'object') {
      const prop = filterObject(object[key], predicate);
      if (prop) return prop;
    }
  }
}

export function validateOptionObject(option) {
  return (typeof option === 'object' && (
    option.label !== undefined ||
    option.value !== undefined ||
    option.action !== undefined ||
    option.button !== undefined
  )) ? option : {value: option};
}

export function isOptionObject(option) {
  // return (typeof option === 'object' && (option.label !== undefined || option.value !== undefined)) ? option : {value: option};
}
