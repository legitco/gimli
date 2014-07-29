(function(){
  function orderObjectBy(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };

  angular.module('gimli').filter('orderObjectBy', function() {
    return orderObjectBy;
  });
})()
