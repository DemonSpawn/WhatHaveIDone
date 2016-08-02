var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
document.getElementById('dateIn').value = localISOTime.substring(0, 10);
document.getElementById('timeIn').value = localISOTime.substring(11, 16);

