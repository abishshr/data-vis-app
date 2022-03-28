function RedditWordCloud() {
    // Name for the visualization to appear in the menu bar.
    this.name = 'Reddit : Wallstreetbets Feb 2022';
    // Each visualization must have a unique ID with no special
    // characters.
    this.id = 'reddit-word-cloud';
    // Property to represent whether data has been loaded.
    this.loaded = false;
    // Source Data Location 
    let sourceData = 'data/reddit-stock-ticker/reddit-data-freq.json';
    // Title for the chart
    let title = 'Subreddit Wallstreetbets most popular Ticker symbols'
    // Declare class variable 
    this.maxSize;
    this.data;
    this.slider;
    this.stockCount;
    this.preload = function(){
        const self = this;
        this.data = loadJSON(sourceData, "json",
            // Callback function to set the value this.loaded to true.
            function(table) {
            self.loaded = true;
        });
    }
    this.setup = function() {
        // Creating a slider for controlling the word cloud 
        this.stockCount = Object.keys(this.data).length;
        this.maxSize = calculateDataSize(data = this.data, stockCount = this.stockCount);
        const minWidth = 134 * pow(2.72, this.stockCount * 0.005); 
        this.slider = createSlider(minWidth, width/2, SLIDER_MIN_VALUE,10);
    }
    this.destroy = function() {
        slider.remove();
        this.wordCloud = null;
    };
    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        // Title Styling and Position 
        const titleXpos = this.slider.x + 140;
        const titleYpos = this.slider.y - 20;
        fill(0);
        noStroke();
        textAlign(TITLE_ALIGNMENT, TITLE_ALIGNMENT);
        textSize(20);
        text(title, titleXpos, titleYpos );
        // Slider Styling and Position 
        translate(width/2, height/2);
        scale(225/this.slider.value());
        this.slider.position(350, 50);
        // Create a word cloud object and draw it on the canvas
        this.wordCloud = new WordCloud(data = this.data, slider = this.slider, stockCount = this.stockCount, maxSize=this.maxSize);
        this.wordCloud.draw()
        
    }
}