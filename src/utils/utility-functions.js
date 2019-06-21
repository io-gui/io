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
