function RedditWordCloud() {
    // Name for the visualization to appear in the menu bar.
    this.name = 'Reddit : Wallstreetbets';

    // Each visualization must have a unique ID with no special
    // characters.
    this.id = 'reddit-word-cloud';

    // Property to represent whether data has been loaded.
    this.loaded = false;


    let sourceData = 'data/reddit-stock-ticker/reddit-data-freq.json';
    let title = 'Subreddit Wallstreetbets most popular Ticker symbols'
    let words = [];
    let others = [];
    let maxSize = 0;
    let slider,
        data,
        stockCount,
        sliderLabel,
        circleCond,
        wordWidth,
        wordXPosition,
        wordYPosition,
        currentSliderValue,
        wordDiameter;

    let sliderMin = 190;



    this.preload = function(){
        const self = this;
        data = loadJSON(sourceData, "json",
            // Callback function to set the value
            // this.loaded to true.
            function(table) {
            self.loaded = true;
        });
    }

    this.setup = function()  {
        stockCount = Object.keys(data).length;
        for (let i = 0; i < stockCount; i++) {
            if (data[i].size > maxSize) {
            maxSize = data[i].size;
            }
        }

        const minWidth = 134 * pow(2.72, stockCount * 0.005); // y = 134*e^(0.004*x)
        slider = createSlider(minWidth, width/2, sliderMin,10);
    }
    this.destroy = function() {
        slider.remove();
    };

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        currentSliderValue = slider.value();

        // Draw the title above the plot.
        this.drawTitle();
        // words = [];
        others = [];
        translate(width/2, height/2);
        scale(225/currentSliderValue);
        slider.position(350, 50);
        drawCloud();
        translate(-width/2, -height/2);
    }
    function drawCloud() {
        for (let i = 0; i < stockCount; i++) {
            let rotate = 0;
            do {
                if (rotate == 100) {
                  break;
                }
                rotate++;

                const wordSize = (data[i].size / maxSize) * 150 + 3;
                textSize(wordSize);
                wordWidth = textWidth(data[i].text);
                wordXPosition = random(-currentSliderValue, currentSliderValue - wordWidth);
                wordDiameter = floor(sqrt(pow(currentSliderValue, 2) - pow(wordXPosition, 2))); // x^2 + y^2 < currentSliderValue^2
                wordYPosition = random(-wordDiameter + wordSize, wordDiameter);
                const circleCondition1 = (pow(wordXPosition + wordWidth, 2) + pow(wordYPosition-wordSize, 2)) < pow(currentSliderValue, 2);
                const circleCondition2 = (pow(wordXPosition + wordWidth, 2) + pow(wordYPosition, 2)) < pow(currentSliderValue, 2);
                circleCond = circleCondition1 && circleCondition2;

          }
            while (!circleCond || (others.length > 0
                && isOverlapping(wordXPosition, wordYPosition, data[i], others, maxSize)));

          words[i] = new Word(wordXPosition, wordYPosition, data[i], maxSize);
          others.push(words[i]);

            noStroke();
            textSize(words[i].size);
            wordWidth = textWidth(words[i].text);
            fill(125,125,120);
            fill(random(0,255),random(0,255),random(0,255));
            text(words[i].text, words[i].x, words[i].y);
        }
      }
    this.drawTitle = function () {
        fill(0);
        noStroke();
        textAlign('center', 'center');
        textSize(20);
        text(title, slider.x + 140, slider.y - 20 );
    };
    function Word(xPos, yPos, data, maxSize) {
        this.x = xPos;
        this.y = yPos;
        this.orglsize = data.size;
        this.size = (data.size/maxSize) * 40 + 3;
        this.text = data.text;
        this.color = {
            r: random(0,255),
            g: random(0,255),
            b: random(0,255)
        };
    }

      

}