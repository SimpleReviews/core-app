module.exports = function (results){
    return results.map(function(item) {
            var json = item.value;
            json.key = item.path.key;
            return json;
        });
};
