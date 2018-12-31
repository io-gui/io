let suboptions2 = [
  {label: 'log one', value: 1, action: console.log},
  {label: 'log two', value: 2, action: console.log},
  {label: 'log three', value: 3, action: console.log},
  {label: 'log four', value: 4, action: console.log},
  {label: 'log five', value: 5, action: console.log}
];
let suboptions1 = [
  {label: 'one more', options: suboptions2},
  {label: 'two more', options: suboptions2},
  {label: 'three more', options: suboptions2},
  {label: 'four more', options: suboptions2},
  {label: 'five more', options: suboptions2}
];
let suboptions0 = [
  {label: 'one', options: suboptions1},
  {label: 'two', options: suboptions1},
  {label: 'three', options: suboptions1},
  {label: 'four', options: suboptions1},
  {label: 'five', options: suboptions1}
];
let longOptions = [];
for (let i = 0; i < 100; i++) {
  let r = Math.random();
  longOptions[i] = {label: String(r), value: r, action: console.log, icon: 'ξ', hint: 'log'};
}

export const data = {
  menuoptions: [
    {label: 'file', options: suboptions0},
    {label: 'view', options: suboptions0},
    {label: 'long menu', options: longOptions, hint: 'list', icon: '⚠'}
  ],
  options: [
    {label: 'negative one', value: -1},
    {label: 'zero', value: 0},
    {label: 'one', value: 1},
    {label: 'two', value: 2},
    {label: 'three', value: 3},
    {label: 'four', value: 4},
    {label: 'leet', value: 1337},
  ]
}
