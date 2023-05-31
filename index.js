let fr= new FileReader();

document.addEventListener('DOMContentLoaded', (event) => {
    fr.addEventListener('load', (event) => {
        // parse XML and put all places into a flat array (they are scattered through multiple folders)
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(event.target.result, 'text/xml' );

        let places = [];
        for (let folder of xmlDoc.getElementsByTagName('Folder')) {
            for (let placemark of folder.getElementsByTagName('Placemark')) {
                places.push( placemark);
            }
        }

        if (places.length === 0) {
            document.getElementById('card').setAttribute('hidden', true);

            return;
        }

        // Get random place from the list
        let place = places[Math.floor(Math.random() * places.length)];

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
    });

    // File in the file input component name
    document.getElementById('kmlFile').onchange = (event) => {
        let fileName = '';
        if (event.target.files.length > 0) {
            fileName = event.target.files[0].name;
        }

        document.getElementsByClassName('file-name')[0].textContent = fileName;
    }
});

function randomizeFromFile()
{
    const fileExtensions = ['kml'];

    let file = document.getElementById('kmlFile').files[0];

    if ( undefined === file || !fileExtensions.includes(file.name.split('.').pop())) {
        window.alert('Renseigne un fichier au format .kml stp');
        return;
    }

    fr.readAsText(file);
}
