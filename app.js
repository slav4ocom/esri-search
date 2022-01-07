var searchField = document.getElementById("searchField");
var suggestionsLength = 0;
var dropdownIndex = -1;
var selectedSuggestion;
var lastSearchString = "";
var dropdownContainer = document.getElementById('dropdownContainer');

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


function GetSuggestions() {
    var container = document.getElementById('dropdownContainer');
    var searchString = document.getElementById('searchField').value;
    var data;
    var cnt = 1;
    lastSearchString = searchString;
    if (searchString.length > 0) {
        dropdownContainer.setAttribute("style", "display: block;");
        ReadTextFile("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=" + searchString, function (text) {
            data = JSON.parse(text);
            suggestionsLength = data.suggestions.length;

            var suggestions = data.suggestions;
            container.innerHTML = "";
            suggestions.forEach(element => {
                var suggestion = document.createElement('a');
                suggestion.setAttribute('id', cnt);
                cnt++;
                suggestion.innerHTML = element.text;
                container.appendChild(suggestion);
                //console.log(element);
                dropdownIndex = -1;
            });
        });
    } else {
        dropdownContainer.setAttribute("style", "");
        container.innerHTML = "";
    }
}


function Search(searchString) {
    var container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    lastSearchString = searchString;
    ReadTextFile("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=" + searchString + "&f=json", function (text) {
        var data = JSON.parse(text).candidates;
        var myTable = document.getElementById('resultsContainer');
        var id = 1;
        //console.log(data);
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

function AddListeners() {
    searchField.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("magnifier").click();
        }
    });


    searchField.addEventListener("keyup", function (event) {
        if (event.keyCode == 38) {
            dropdownContainer.setAttribute("style", "display: block;");
            dropdownIndex--;
            if (dropdownIndex < 0) {
                dropdownIndex = suggestionsLength - 1;
            }
            if (selectedSuggestion != undefined) {
                selectedSuggestion.setAttribute('style', 'background-color: #f1f1f1;');
            }
            selectedSuggestion = dropdownContainer.getElementsByTagName("a")[dropdownIndex];
            if (selectedSuggestion != undefined) {
                selectedSuggestion.setAttribute('style', 'background-color: rgba(0,0,0,0.2);');
                searchField.value = selectedSuggestion.innerHTML;
            }

        }
        else if (event.keyCode == 40) {
            dropdownContainer.setAttribute("style", "display: block;");
            dropdownIndex++;
            if (dropdownIndex > suggestionsLength - 1) {
                dropdownIndex = 0;
            }
            if (selectedSuggestion != undefined) {
                selectedSuggestion.setAttribute('style', 'background-color: #f1f1f1;');
            }
            selectedSuggestion = dropdownContainer.getElementsByTagName("a")[dropdownIndex];
            if (selectedSuggestion != undefined) {
                selectedSuggestion.setAttribute('style', 'background-color: rgba(0,0,0,0.2);');
                searchField.value = selectedSuggestion.innerHTML;
            }

        }
    });

    searchField.addEventListener("click", function (event) {
        dropdownContainer.setAttribute("style", "display: block;");
    });

    document.addEventListener("keyup", function (event) {
        if (event.keyCode == 27) {
            dropdownContainer.setAttribute("style", "");
            searchField.value = lastSearchString;
        }
    });


    dropdownContainer.addEventListener("click", function (event) {
        var pointed = event.path[0].innerHTML;
        searchField.value = pointed;
        Search(pointed);
    });

    dropdownContainer.addEventListener("mousemove", function (event) {
        if (selectedSuggestion != undefined) {
            selectedSuggestion.setAttribute('style', 'background-color: #f1f1f1;');
        }
        var id = event.path[0].id - 1;
        dropdownIndex = id;
        selectedSuggestion = dropdownContainer.getElementsByTagName("a")[id];
        selectedSuggestion.setAttribute('style', 'background-color: rgba(0,0,0,0.2);');
    });

    document.addEventListener("click", function (event) {
        var clicked = event.path[0].id;
        if (clicked != "searchField") {
            dropdownContainer.setAttribute("style", "");
            searchField.value = lastSearchString;
        };
    });
}

AddListeners();