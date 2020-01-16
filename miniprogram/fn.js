var getTime = function(data){
  var y = data.getFullYear() 
  var m = data.getMonth() + 1 < 10 ? '0' + (parseInt(data.getMonth()) + 1) : data.getMonth() + 1
  var d = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
  return y + '-' + m + '-' + d
}

module.exports = {
  getTime:getTime
}