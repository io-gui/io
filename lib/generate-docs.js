/* eslint-disable */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const path = require('path');

const corePath = path.resolve(__dirname, '../src/core/');

fs.readdir(corePath, function(err, items) {

  for (let i = 0; i < items.length; i++) {

    const jsPath = path.resolve(corePath, items[i]);

    if (jsPath.endsWith('.js') && !jsPath.endsWith('.test.js')) {
      
      const templateData = jsdoc2md.getTemplateDataSync({ files: jsPath });
      templateData.sort((a, b) => (a.order > b.order) ? 1 : -1);

      const template = [];
      const templateMap = {};

      for (let j in templateData) {
        const id = templateData[j].id;
        templateMap[id] = templateData[j];
      }

      for (let j in templateData) {
        const id = templateData[j].id;
        const parentId = templateData[j].memberof;
        if (parentId && templateMap[parentId]) {
          templateMap[parentId].children = templateMap[parentId].children || [];
          templateMap[parentId].children.push(templateMap[id]);
        } else {
          template.push(templateMap[id]);
        }
      }

      let output = '';

      traverse({children: template}, item => {
        if (item.name && item.description) {
          output += renderTitle(item);
          output += renderDescription(item);
        }
      });

      const mdPath = path.resolve(corePath, items[i].replace('.js', '.md'));
      fs.writeFileSync(mdPath, output);
    }
  }

});

const traverse = (template, callback) => {
  callback(template);
  let children = template.children || [];
  for (let i = 0, l = children.length; i < l; i ++) {
    traverse(children[i], callback);
  }
};

const renderTitle = (item) => {
  let output = '';
  if (item.name) {
    if (item.kind === 'class') {
      output += '##' + ' ' + item.name;
    } else if (item.kind === 'constructor') {
      output += '###' + ' ' + item.name + '(' + renderParams(item) + ')';
    } else if (item.kind === 'function') {
      output += '###' + ' .' + item.name + '(' + renderParams(item) + ')' + renderReturns(item);
    } else {
      output += '###' + ' ' + item.name;
    }
    output += '\r\n\n';
  }
  return output;
};

const renderDescription = item => {
  let output = '';
  if (item.description) {
    output += item.description;
    output += '\r\n\n';
  }
  return output;
};

const renderParams = item => {
  let output = '';
  if (item.params) {
    for (let i = 0; i < item.params.length; i++) {
      output += item.params[i].name;
      output += ': ';
      output += '`' + item.params[i].type.names[0] + '`';
      if (i < item.params.length - 1) output += ', ';
    }
  }
  return output;
};

const renderReturns = item => {
  let output = '';
  if (item.returns) {
    for (let i = 0; i < item.returns.length; i++) {
      output += ' : ';
      output += item.returns[i].type.names[0];
      if (i < item.returns.length - 1) output += ', ';
    }
  }
  return output;
};