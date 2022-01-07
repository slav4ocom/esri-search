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

var suggestionsLength = 0;

function GetSuggestions() {
    var container = document.getElementById('dropdownContainer');
    var searchString = document.getElementById('searchField').value;
    var data;
    var cnt = 1;
    ReadTextFile("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=" + searchString, function (text) {
        data = JSON.parse(text);
        //console.log("dropdown content:");
        suggestionsLength = data.suggestions.length;
        //const suggestions = ["Горна Оряховица", "Бов", "Казичене", "Синдел"];
        var suggestions = data.suggestions;
        container.innerHTML = "";
        suggestions.forEach(element => {
            var suggestion = document.createElement('a');
            suggestion.setAttribute('id', "sug" + cnt);
            cnt++;
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
var searchField = document.getElementById("searchField");

// Execute a function when the user releases a key on the keyboard
searchField.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("magnifier").click();
    }
});

var dropdownIndex = -1;
var selectedSuggestion;

searchField.addEventListener("keyup", function (event) {
    if (event.keyCode == 38) {
        //console.log("UP");
        dropdownIndex--;
        if (dropdownIndex < 0) {
            dropdownIndex = suggestionsLength - 1;
        }
        if (selectedSuggestion != undefined) {
            selectedSuggestion.setAttribute('style', 'background-color: #f1f1f1;');
        }
    }
    else if (event.keyCode == 40) {
        //console.log("DOWN");
        dropdownIndex++;
        if (dropdownIndex > suggestionsLength - 1) {
            dropdownIndex = 0;
        }
        if (selectedSuggestion != undefined) {
            selectedSuggestion.setAttribute('style', 'background-color: #f1f1f1;');
        }
    }
    //console.log(dropdownIndex);
    selectedSuggestion = dropdownContainer.getElementsByTagName("a")[dropdownIndex];
    if (selectedSuggestion != undefined) {
        selectedSuggestion.setAttribute('style', 'background-color: coral;');
        searchField.value = selectedSuggestion.innerHTML;
    }
    //console.log(selectedSuggestion.innerHTML);
});

var defaultSearchString = searchField.text;
var dropdownContainer = document.getElementById('dropdownContainer');

dropdownContainer.addEventListener("click", function (event) {
    var pointed = event.path[0].innerHTML;
    //console.log(pointed);
    searchField.value = pointed;
    //searchField.setAttribute('inner', pointed);
    Search(pointed);
});

