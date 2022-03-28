function WordCloud(data, slider, stockCount, maxSize){
    // Declaring  all the required class variables 
    this.wordWidth;
    this.wordXPosition;
    this.wordYPosition;
    this.wordDiameter;
    this.circleCond;
    this.maxSize = maxSize;
    // Initalizing  all the class variables 
    this.data = data;
    this.stockCount = stockCount;
    this.maxSize = maxSize;
    this.others = [];
    this.words = [];
    this.slider = slider
    this.currentSliderValue = this.slider.value();
    // Main Draw method which will used to draw the Word Cloud for reddit stock ticker visualization
    this.draw = function(){
        for (let i = 0; i < this.stockCount; i++) {
            // For rotating the word cloud
            let rotate = 0;
            do {
                if (rotate == 100) {
                    break;
                }
                rotate++;
                // Defining the size and width of the words based on their frequency
                const wordSize = (this.data[i].size / this.maxSize) * 150 + 3;
                textSize(wordSize);
                this.wordWidth = textWidth(this.data[i].text);
                // Using the basic formula Word X position ^2 +  Word Y position ^2 < The diameter of the word cloud
                this.wordXPosition = random(-this.currentSliderValue, this.currentSliderValue - this.wordWidth);
                this.wordDiameter = floor(sqrt(pow(this.currentSliderValue, 2) - pow(this.wordXPosition, 2))); 
                this.wordYPosition = random(-this.wordDiameter + wordSize, this.wordDiameter);
                const circleCondition1 = (pow(this.wordXPosition + this.wordWidth, 2) + pow(this.wordYPosition-wordSize, 2)) < pow(this.currentSliderValue, 2);
                const circleCondition2 = (pow(this.wordXPosition + this.wordWidth, 2) + pow(this.wordYPosition, 2)) < pow(this.currentSliderValue, 2);             
                circleCond = circleCondition1 && circleCondition2;
            }
            // Checking if the above condition is true and also using the helper method for overlapping two words are true before drawing
            while (!circleCond || (this.others.length > 0
                && isOverlapping(this.wordXPosition, this.wordYPosition, this.data[i], this.others, this.maxSize))) {
                    this.words[i] = new Word(this.wordXPosition, this.wordYPosition, this.data[i], this.maxSize);
                    this.others.push(this.words[i]);
                    noStroke();
                    textSize(this.words[i].size);
                    this.wordWidth = textWidth(this.words[i].text);
                    fill(125,125,120);
                    fill(random(0,255),random(0,255),random(0,255));
                    text(this.words[i].text, this.words[i].x, this.words[i].y);
                }
        } 
        translate(-width/2, -height/2);
    }

}