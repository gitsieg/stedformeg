// Stavanger-området
let latStart = Math.round(59.007730*100) / 100;
let longStart = Math.round(5.669633*100) / 100;
let latEnd = Math.round(58.926535*100) / 100;
let longEnd = Math.round(5.752929*100) / 100;

class DataHandler {

    constructor() {
        this.categories = [];
        this.categories["barnehage"] = [];
        this.categories["tursti"] = [];

        this.fetchBarnehager();
        this.fetchTurstier();
    }

    fetchBarnehager() {

        let connector = new XMLHttpRequest();
        const URL = "http://hotell.difi.no/api/json/stavanger/barnehager?";

        connector.onreadystatechange = function() {
            if (connector.readyState === 4 && connector.status === 200) {
                console.log("Oh yeah");
                let temporaryJSON = JSON.parse(connector.responseText);
                // console.log(JSON.stringify(temporaryJSON));

                for (let i = 0; i < temporaryJSON.entries.length; i++) {
                    this.categories["barnehage"].push([
                        temporaryJSON.entries[i].breddegrad,
                        temporaryJSON.entries[i].lengdegrad
                    ]);
                }
            } else {
                console.log("Oh fuck");
            }

        }.bind(this);



        let uri = URL+latStart+"/"+longStart+"/"+latEnd+"/"+longEnd;
        console.log(uri);
        connector.open("GET", uri, true);
        connector.setRequestHeader("Accept", "application/json");
        connector.send();
    }

    fetchTurstier() {
        let connector = new XMLHttpRequest();
        const URL = "https://opencom.no/dataset/bf627d4a-f115-41a2-82b9-d19de3cd5414/resource/e1fe43ad-c4b6-4e12-a3b4-6e864c57f96a/download/turveger.json";

        connector.onreadystatechange = function() {
            if (connector.readyState === 4 && connector.status === 200) {
                console.log("Oh yeah");
                let temporaryJSON = JSON.parse(connector.responseText);
                // this.categories["tursti"] = temporaryJSON;

                // console.log(temporaryJSON.features[0].geometry.coordinates);

                console.log(temporaryJSON.features.length);


                for (let i = 0; i < temporaryJSON.features.length; i++) {
                    let coords = temporaryJSON.features[i].geometry.coordinates;
                    this.categories["tursti"].push( coords[0], coords[coords.length-1] );
                }
            } else {
                console.log("Oh fuck");
            }

        }.bind(this);

        connector.open("GET", URL, true);
        connector.setRequestHeader("Accept", "application/json");
        connector.send();
    }
}

