function updateClock() {
	var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
	var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
	document.getElementById('dateIn').value = localISOTime.substring(0, 10);
	document.getElementById('timeIn').value = localISOTime.substring(11, 16);
}

// update date and time field every minute
setInterval(updateClock, 60000);
updateClock();		// but do it also right now

$.getJSON( "last", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li id='" + key + "'>" + val + "</li>" );
  });
 
  $( "<ul/>", {
    "class": "bulletless-list",
    html: items.join( "" )
  }).appendTo( "body" );
});
