// Credit: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object

isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

module.exports = {
  isObjEmpty,
};
