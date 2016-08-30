function updateClock() {
	var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
	var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
	document.getElementById('dateIn').value = localISOTime.substring(0, 10);
	document.getElementById('timeIn').value = localISOTime.substring(11, 16);
}

// update date and time field every minute
setInterval(updateClock, 60000);
updateClock();		// but do it also right now

// get the last 3 activities from the server and display them
function updateLatest() {
  $.getJSON( "last?forceUpdate=" + Math.random(), function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( "<li id='" + key + "'>" + val + "</li>" );
    });
    
    $( "#last_tasks" ).empty();
    $( "<ul/>", {
      "class": "bulletless-list",
      html: items.join( "" )
    }).appendTo( document.getElementById("last_tasks") );
  });
}

updateLatest();

// get the most frequent activities from the server and display them
var rows = 3;
var elementsPR = 3;	// elements per row, fixed for now because of column style s4
$.getJSON( "frequent?amount=" + (rows * elementsPR), function( data ) {
  var i;
  for (i = 0; i < rows; i++) {
    var row = document.createElement("div");
    row.setAttribute('class', 'valign-wrapper');
	var slicedData = data.slice(elementsPR*i, elementsPR*(i+1));
    for (var a in slicedData) {
      var div = document.createElement("div");
      div.setAttribute('class', 'col s4 l2 valign green darken-3 white-text card center');
	  div.setAttribute('onClick', "$ ('#activityIn').val('" + slicedData[a] + "'); $('#activityForm').submit(); ");
      div.innerHTML = slicedData[a];
      row.appendChild(div);
    }
    document.getElementById("frequent_tasks").appendChild(row);
  }
});

// override the submit button to clear the form when submitting was a success
   $("#activityForm").submit(function(event) {
		if ( $ ("#activityIn").val() === "") {
			// no activity given
			event.preventDefault();
			return false;
		}
        var submit = $(this).serialize();
        $.get('send', submit, 
	        function(data){
		        if(data == "success"){ //server response
			         $('#activityIn').val('');
					 updateLatest();
	            };
				$('#activityIn').blur();
				Materialize.toast(data, 3000);
		    });
        return false;
    });

