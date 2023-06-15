let fr= new FileReader();

const fileExtensions = ['kml'];
let places = {};

document.addEventListener('DOMContentLoaded', (event) => {
    fr.addEventListener('load', (event) => {
        // parse XML and put all places into an object, with the folder names as indexes
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(event.target.result, 'text/xml' );

        places = {};
        for (let folder of xmlDoc.getElementsByTagName('Folder')) {
            let folderName = folder.getElementsByTagName('name')[0].textContent;

            places[folderName] = [];
            for (let placemark of folder.getElementsByTagName('Placemark')) {
                places[folderName].push(placemark);
            }
        }

        let foldersFilterSelect = document.getElementById('folders-filter');
        foldersFilterSelect.innerHTML = '<option selected value></option>';

        for (const [folderName, place] of Object.entries(places)) {
            foldersFilterSelect.add(new Option(folderName,folderName), undefined);
        }
    });

    // File in the file input component name
    document.getElementById('kmlFile').onchange = (event) => {
        if (event.target.files.length === 0) {
            document.getElementsByClassName('file-name')[0].textContent = '';

            return;
        }

        let file = event.target.files[0];

        if (!fileExtensionIsValid(file)) {
            return;
        }

        document.getElementsByClassName('file-name')[0].textContent = file.name;

        fr.readAsText(file);
    }
});

function randomizeFromFile()
{
    let filteredPlaces = [];
    let folderFilterValues = [...document.getElementById('folders-filter')].filter(option => option.selected).map(option => option.value);

    // Case when no filter is selected
    if (folderFilterValues.length === 0 || (folderFilterValues.length === 1 && folderFilterValues[0] === '')) {
        for (const [folderName, placeMarks] of Object.entries(places)) {
            filteredPlaces = [...filteredPlaces, ...placeMarks];
        }
    } else {
        for (const [folderName, placeMarks] of Object.entries(places)) {
            if (folderFilterValues.includes(folderName)) {
                filteredPlaces = [...filteredPlaces, ...placeMarks];
            }
        }
    }

    if (filteredPlaces.length === 0) {
        document.getElementById('card').setAttribute('hidden', true);
        window.alert('Erreur ! Aucun élément à renvoyer.');

        return;
    }

    // Get random place from the list
    let place = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];

    // Fill in the card component with values from the place
    document.getElementById('card-name').innerHTML = '<b>' + place.getElementsByTagName('name')[0].textContent + '</b>';

    let cardContent = '';
    if (place.getElementsByTagName('description').length > 0) {
        cardContent += '<br>' + place.getElementsByTagName('description')[0].textContent
    }
    if (place.getElementsByTagName('Point').length > 0) {
        // sanitize coordinates string
        let coordinatesString = place.getElementsByTagName('Point')[0].getElementsByTagName('coordinates')[0].textContent
                                                                                                             .replace(/[\n\t\r]/g,"").trim();
        let coordinates = coordinatesString.split(',');
        cardContent += '<br><a target="_blank" href="' + 'https://www.google.com/maps/search/?api=1&query='
                       + coordinates[1] + ',' + coordinates[0]
                       + '">Voir sur Google</a>';
    }
    document.getElementById('card-content').innerHTML = cardContent;

    // Display the card component if it was hidden
    document.getElementById('card').removeAttribute('hidden');
}

function fileExtensionIsValid(file)
{
    if ( undefined === file || !fileExtensions.includes(file.name.split('.').pop())) {
        window.alert('Renseigne un fichier au format .kml stp');

        return false;
    }

    return true;
}
