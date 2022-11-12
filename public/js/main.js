// Snapshot of all stations at a specified time
function method1(e){
	e.disabled = true;
	let _data = "";
	_data += document.getElementById("m1_year").value+"-";
	_data += document.getElementById("m1_month").value+"-";
	_data += document.getElementById("m1_day").value+"T";
	_data += document.getElementById("m1_hour").value+":00:00";
	fetch(window.location.origin+'/stations?at='+_data)
	.then(response => response.json())
    .then(data => {
    	let result = {
			'at': _data,
			'stations': data['data'][0],
			'weather': data['data'][1]
    	};
    	// console.log(result);
    	document.getElementById("m1_result").innerHTML = "<pre>"+JSON.stringify(result, null, 2)+"</pre>";
    	e.disabled = false;
    });
}

//Snapshot of one station at a specific time
function method2(e){
	e.disabled = true;
	let _data = "";
	_data += document.getElementById("m2_year").value+"-";
	_data += document.getElementById("m2_month").value+"-";
	_data += document.getElementById("m2_day").value+"T";
	_data += document.getElementById("m2_hour").value+":00:00";
	fetch(window.location.origin+'/stations/'+document.getElementById('m2_id').value+'?at='+_data)
	.then(response => response.json())
    .then(data => {
    	let result = {
			'at': _data,
			'station': data['data'][0],
			'weather': data['data'][1]
    	};
    	// console.log(result);
    	document.getElementById("m2_result").innerHTML = "<pre>"+JSON.stringify(result, null, 2)+"</pre>";
    	e.disabled = false;
    });
}