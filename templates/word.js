// Word class to create Word objects used in Reddit Word cloud visualization 
function Word(xPos, yPos, data, maxSize) {
    this.x = xPos;
    this.y = yPos;
    this.originalSize = data.size;
    this.size = (data.size/maxSize) * 40 + 3;
    this.text = data.text;
    this.color = {
        r: random(0,255),
        g: random(0,255),
        b: random(0,255)
    };
}