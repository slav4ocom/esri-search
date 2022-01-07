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


function Suggest() {
    var container = document.getElementById('dropdownContainer');
    var searchString = document.getElementById('searchField').value;
    var data;
    ReadTextFile("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=" + searchString, function (text) {
        data = JSON.parse(text);
        //console.log("dropdown content:");
        //console.log(data);
        //const suggestions = ["Горна Оряховица", "Бов", "Казичене", "Синдел"];
        var suggestions = data.suggestions;
        container.innerHTML = "";
        suggestions.forEach(element => {
            var suggestion = document.createElement('a');
            suggestion.innerHTML = element.text;
            container.appendChild(suggestion);
            //console.log(element);
        });
    });
}


function Search(searchString) {
    var container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    //var searchString = document.getElementById('searchField').value;
    ReadTextFile("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=" + searchString + "&f=json", function (text) {
        var data = JSON.parse(text).candidates;
        var myTable = document.getElementById('resultsContainer');
        var id = 1;
        console.log(data);
        data.forEach(element => {
            var tableRow = document.createElement('tr');
            var tableCol1 = document.createElement('td');
            var tableCol2 = document.createElement('td');

            tableRow.appendChild(tableCol1);
            tableRow.appendChild(tableCol2);

            tableCol1.innerHTML = id;
            tableCol2.innerHTML = element.address;

            container.appendChild(tableRow);
            //console.log(element.address);
            id++;
        });

    })

}

function SearchFromSuggestion(e) {

    console.log("search from suggestion");
    console.log(e);
}

// Get the input field
var input = document.getElementById("searchField");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("magnifier").click();
    }
});

var suggestionInput = document.getElementById('dropdownContainer');

suggestionInput = document.getElementById('dropdownContainer');

suggestionInput.addEventListener("click", function (event) {
    console.log(event.srcElement.innerText);
    Search(event.srcElement.innerText);
});

