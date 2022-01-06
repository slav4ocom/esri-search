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

function Search() {
    var result;
    var searchString = document.getElementById('searchField').value;
    ReadTextFile("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=" + searchString + "&f=json", function (text) {
        result = JSON.parse(text);
    })

    //FillTable();
    CreateTable();
}

function CreateTable(container) {

    readTextFile("/roomdata.json", function (text) {
        data = JSON.parse(text);
        var myTable = document.getElementById('resultsContainer');

        data.forEach(element => {
            var tableRow = document.createElement('tr');
            var tableCol1 = document.createElement('td');
            var tableCol2 = document.createElement('td');
            var tableCol3 = document.createElement('td');
            AddDropdownButton(tableCol3, element.conditioner);
            var tableCol4 = document.createElement('td');
            tableRow.appendChild(tableCol1);
            tableRow.appendChild(tableCol2);
            tableRow.appendChild(tableCol3);
            tableCol1.innerHTML = element.id;
            tableCol2.innerHTML = element.room;
            tableCol4.innerHTML = element.repeater;
            tableRow.appendChild(tableCol4);
            container.appendChild(tableRow);
            //console.log(element.id);
            //console.log(element.conditioner);
            //console.log(element.repeater);
        });

    })
