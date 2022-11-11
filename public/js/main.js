document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => showData(data['data']));
    
});

function showData(data){
	document.getElementById("data_div").innerHTML = data[0]['name'];
}