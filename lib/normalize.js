module.exports = function(results) {
  return results.map(function(item) {
    var json = item.value;
    json.id = item.path.key;
    return json;
  });
};
