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
        this.categories["stoy"] = [];

        this.fetchBarnehager();
        this.fetchTurstier();
        this.fetchStoy();
    }

    fetchBarnehager() {

        let connector = new XMLHttpRequest();
        const URL = "http://hotell.difi.no/api/json/stavanger/barnehager?";

        connector.onreadystatechange = function() {
            if (connector.readyState === 4 && connector.status === 200) {
                let temporaryJSON = JSON.parse(connector.responseText);

                for (let i = 0; i < temporaryJSON.entries.length; i++) {
                    this.categories["barnehage"].push([
                        temporaryJSON.entries[i].breddegrad,
                        temporaryJSON.entries[i].lengdegrad
                    ]);
                }
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
                let temporaryJSON = JSON.parse(connector.responseText);

                for (let i = 0; i < temporaryJSON.features.length; i++) {
                    let coords = temporaryJSON.features[i].geometry.coordinates;
                    this.categories["tursti"].push( coords[0], coords[coords.length-1] );
                }
            }
        }.bind(this);

        connector.open("GET", URL, true);
        connector.setRequestHeader("Accept", "application/json");
        connector.send();
    }
    fetchStoy() {
        let connector = new XMLHttpRequest();
        let URL = "https://opencom.no/dataset/cb25bd3d-be11-4aff-af2d-a6415d417c42/resource/c04fac5b-93f5-497c-8ac3-8ce24b2d2511/download/stoyveglden.json";

        connector.onreadystatechange = function() {
            if (connector.readyState === 4 && connector.status === 200) {
                let temporaryJSON = JSON.parse(connector.responseText);

                let stoy = this.categories["stoy"];

                for (let i = 0; i < temporaryJSON.features.length; i++) {
                    let coords = temporaryJSON.features[i].geometry.coordinates;
                    let interval = temporaryJSON.features[i].properties.StøyIntervall;

                    if (interval !== "")
                        for (let j = 0; j < coords.length; j++) {
                            for (let k = 0; k < coords[j].length; k++)
                                stoy.push([
                                    [
                                        Math.round(coords[j][k][0] * 1000) * 0.001,
                                        Math.round(coords[j][k][1] * 1000) * 0.001
                                    ],
                                    parseInt(interval)
                                ]);
                        }

                }

                stoy.sort(function (a, b) {
                    if (a[0][0] === b[0][0])
                    {
                        if (a[0][1] === b[0][1])
                        {
                            return 0;
                        }
                        else
                        {
                            return ( a[0][1] < b[0][1] ) ? -1 : 1;
                        }
                    }
                    else
                    {
                        return ( a[0][0] < b[0][0] ) ? -1 : 1;
                    }
                });

                this.createFile("stoy.json", JSON.stringify(stoy));

                console.log("Done!");
                console.log(stoy.length);
                console.log(JSON.stringify(stoy[0]));

                // asdfa
            }

        }.bind(this);

        connector.open("GET", URL, true);
        connector.setRequestHeader("Accept", "application/json");
        connector.send();
    }

    createFile(filename, text) {
        let pom = document.createElement('a');
        pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            let event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }
}

