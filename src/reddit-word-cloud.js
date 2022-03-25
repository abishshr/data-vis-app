function RedditWordCloud() {
    // Name for the visualization to appear in the menu bar.
    this.name = 'Reddit : Wallstreetbets';

    // Each visualization must have a unique ID with no special
    // characters.
    this.id = 'reddit-word-cloud';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Title to display above the plot.
    this.title = 'Subreddit Wallstreetbets most popular Ticker symbols'

    let words = [];
    let others = [];
    let data;
    let count;
    this.sourceData = 'data/reddit-stock-ticker/reddit-data-freq.json';
    let max_size = 0;
    let slider,
        sliderLabel,
        circleCond,
        wordXPosition;
    let r = 190;
    const w = 500;


    this.preload = function(){
        const self = this;
        data = loadJSON(this.sourceData, "json",
            // Callback function to set the value
            // this.loaded to true.
            function(table) {
            self.loaded = true;
        });
    }

    this.setup = function()  {
        count = Object.keys(data).length;
        for (let i = 0; i < count; i++) {
            if (data[i].size > max_size) {
            max_size = data[i].size;
            }
        }

        const minW = 134 * pow(2.72, count * 0.005); // y = 134*e^(0.004*x)
        slider = createSlider(minW, width/2, r,10);
    
        // slider.parent("slider");
    
    }
    this.destroy = function() {
        slider.remove();
    };

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        // background(40);
        r = slider.value();
        
        // fill(255);
        textSize(20);
        fill(0);
        text('Most Talked about Ticker Symbol in Reddit', 250, 40);
    
        // words = [];
        others = [];
        translate(width/2, height/2);
        // scale(300/r);
        slider.position(350, 50);
        drawCloud();
        translate(-width/2, -height/2);
    }
    function drawCloud() {
        for (let i = 0; i < count; i++) {
            let tries = 0;
            do {
            if (tries == 5000) {
              console.log("Error at the '" + data[i].text + "'");
              break;
            }
            tries++;

            const size = (data[i].size / max_size) * 150 + 3;
            textSize(size);
            let tWidth = textWidth(data[i].text);
            wordXPosition = random(-r, r - tWidth);
            var wordDiameter = floor(sqrt(pow(r, 2) - pow(wordXPosition, 2))); // x^2 + y^2 < r^2
            var wordYPosition = random(-wordDiameter + size, wordDiameter);
            const circleCond1 = (pow(wordXPosition + tWidth, 2) + pow(wordYPosition-size, 2)) < pow(r, 2);
            const circleCond2 = (pow(wordXPosition + tWidth, 2) + pow(wordYPosition, 2)) < pow(r, 2);
            circleCond = circleCond1 && circleCond2;

          } while (!circleCond || (others.length > 0 && isOverlapping(wordXPosition, wordYPosition, data[i], others, max_size)));

          words[i] = new Word(wordXPosition, wordYPosition, data[i]);
          others.push(words[i]);

          noStroke();
          textSize(words[i].size);
          var tWidth = textWidth(words[i].text);

        //   Uncomment to view word highlighting
        //   fill(125,125,120);
        //   rect(words[i].x, words[i].y + words[i].size*0.2, tWidth, -words[i].size);
            // fill(words[i].color.b);
            fill(random(0,255),random(0,255),random(0,255));
            // fill(words[i].color)
          text(words[i].text, words[i].x, words[i].y);
        }
      }


      
      function Word(x, y, data) {
        this.x = x;
        this.y = y;
        this.orglsize = data.size;
        this.size = (data.size/max_size) * 40 + 3;
        this.text = data.text;
        this.color = {
          r: random(0,255),
          g: random(0,255),
          b: random(0,255)
        };
      }
      

}