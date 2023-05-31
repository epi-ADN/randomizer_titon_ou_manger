function randomizeFromFile()
{
    const fileExtensions = ['kml'];

    let file = document.getElementById('kmlFile').files[0];

    if ( undefined === file || !fileExtensions.includes(file.name.split('.').pop())) {
        window.alert('Renseigne un fichier au format .kml stp');
        return;
    }

    let fr= new FileReader();

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

        // Get random place from the list
        let place = places[Math.floor(Math.random() * places.length)];

        let randomizerResult = '<b>' + place.getElementsByTagName('name')[0].textContent + '</b>';
        if (undefined !== place.getElementsByTagName('description')) {
            randomizerResult += '<br>' + place.getElementsByTagName('description')[0].textContent
        }
        if (undefined !== place.getElementsByTagName('Point')) {
            // sanitize coordinates string
            let coordinatesString = place.getElementsByTagName('Point')[0].getElementsByTagName('coordinates')[0].textContent
                                         .replace(/[\n\t\r]/g,"").trim();
            let coordinates = coordinatesString.split(',');
            console.log(coordinates);
            randomizerResult += '<br><a target="_blank" href="' + 'https://www.google.com/maps/search/?api=1&query='
                                + coordinates[1] + ',' + coordinates[0]
                                + '">Voir sur Google</a>';
        }
        document.getElementById('randomizerResult').innerHTML = randomizerResult;
    });

    fr.readAsText(file);
}
