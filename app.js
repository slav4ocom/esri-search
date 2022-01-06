function ReadTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function FillTable() {
    var containter = document.getElementById('resultsContainer');
    var tableRow = document.createElement('tr');
    var addressNumberElement = document.createElement('td');
    var addressElement = document.createElement('td');

    containter.innerHTML = "";
    addressElement.innerHTML = "Това е адрес 1";
    tableRow.appendChild(addressNumberElement);
    tableRow.appendChild(addressElement);
    containter.appendChild(tableRow);

}

//var data;

function Search() {
    var container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    var searchString = document.getElementById('searchField').value;
    ReadTextFile("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=" + searchString + "&f=json", function (text) {
    //ReadTextFile("/roomdata.json", function (text) {
        var data = JSON.parse(text).candidates;
        var myTable = document.getElementById('resultsContainer');
        var id = 1;
        console.log(data);
        data.forEach(element => {
            var tableRow = document.createElement('tr');
            var tableCol1 = document.createElement('td');
            var tableCol2 = document.createElement('td');
            //var tableCol3 = document.createElement('td');
            //AddDropdownButton(tableCol3, element.conditioner);
            //var tableCol4 = document.createElement('td');
            tableRow.appendChild(tableCol1);
            tableRow.appendChild(tableCol2);
            //tableRow.appendChild(tableCol3);
            tableCol1.innerHTML = id;
            tableCol2.innerHTML = element.address;
            //tableCol4.innerHTML = element.repeater;
            //tableRow.appendChild(tableCol4);
            container.appendChild(tableRow);
            console.log(element.address);
            id++;
        });

    })

}

// Get the input field
var input = document.getElementById("searchField");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("magnifier").click();
  }
});