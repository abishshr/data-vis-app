function Covid19Map() {
    // Name for the visualization to appear in the menu bar.
    this.name = 'Covid-19 Map: 2022';
    // Each visualization must have a unique ID with no special
    // characters.
    this.id = 'Covid-19 World Map';
    // Declaring all the required variables 
    this.worldImageMap;
    // This pg variable is to hold offscreen graphics buffer
    this.pg; 
    this.covid19;
    this.covidRecoveryData;
    this.preload = function () {
        // load all the data - image data , covid 19 infections and recovery data 
        this.worldImageMap = loadImage('data/covid19-world-map/worldmap-1024x512.png');
        this.covid19 = loadStrings('data/covid19-world-map/covid19.csv');
        this.covidRecoveryData = loadStrings('data/covid19-world-map/covidRecoveryData.csv');
    };
    this.destroy = function() {
        // This is to remove all the unnecessary objects from memory including off-screen graphics buffer
        radio.remove()
        this.pg.clear();
        clear();
    };
    this.setup = function() {
        // CreateGraphics renders a off-screen graphics buffer needed for marking/drawing  the ellipses on the map
        this.pg = createGraphics(1024, 512);
        // Radio button creation and positioning
        radio = createRadio()
        radio.option(CONFIRMED_COVID_CASES,CONFIRMED_COVID_CASES);
        radio.option(DEATH_COVID_CASES,DEATH_COVID_CASES);
        radio.option(ACTIVE_COVID_CASES,ACTIVE_COVID_CASES);
        radio.option(RECOVERED_COVID_CASES,RECOVERED_COVID_CASES);
        radio.position(310, 20)
    };
    this.draw = function () {
        // Drawing/Positioning the title 
        noStroke();
        fill(255, 255, 255);
        rect(0, 0, 1024, 88);
        noStroke();
        fill(0);
        textAlign(CENTER);
        textSize(18);
        text('Covid-19 World Map', width / 2, 25);
        translate(width / 2, height / 2);
        imageMode(CENTER);
        // Drawing the image 
        image(this.worldImageMap, 0, 0,);
        // Drawing off-screen graphics buffer
        image(this.pg,0,0,)
        // Get the latest radio button value selected by the user 
        let selectedCase = radio.value()
        // Using the switch case statement to call the helper method with right parameters for drawing ellipse on graphics buffer
        switch (selectedCase) {
            case CONFIRMED_COVID_CASES:
                drawOnGraphicsBuffer(longitudeCenter = LONGITUDE_CENTER, latitudeCenter = LATITUDE_CENTER, covid19 = this.covid19, covidRecoveryData = this.covidRecoveryData,
                    7, zoom = ZOOM, graphicsScreen = this.pg, dataCategory = CONFIRMED_COVID_CASES, fillColor = CONFIRMED_COLOR)
                break;
            case DEATH_COVID_CASES:
                drawOnGraphicsBuffer(longitudeCenter = LONGITUDE_CENTER, latitudeCenter = LATITUDE_CENTER, covid19 = this.covid19, covidRecoveryData = this.covidRecoveryData,
                    8, zoom = ZOOM, graphicsScreen = this.pg, dataCategory = DEATH_COVID_CASES, fillColor = DEATH_COLOR)
                break;
            case ACTIVE_COVID_CASES:
                drawOnGraphicsBuffer(longitudeCenter = LONGITUDE_CENTER, latitudeCenter = LATITUDE_CENTER, covid19 = this.covid19, covidRecoveryData = this.covidRecoveryData,
                    10, zoom = ZOOM, graphicsScreen = this.pg, dataCategory = ACTIVE_COVID_CASES, fillColor = ACTIVE_COLOR)
                break;
            case RECOVERED_COVID_CASES:
                drawOnGraphicsBuffer(longitudeCenter = LONGITUDE_CENTER, latitudeCenter = LATITUDE_CENTER, covid19 = this.covid19, covidRecoveryData = this.covidRecoveryData,
                    10, zoom = ZOOM, graphicsScreen = this.pg, dataCategory = RECOVERED_COVID_CASES, fillColor = RECOVERED_COLOR)
                break;
            default:
                break;
        }
    }
}
