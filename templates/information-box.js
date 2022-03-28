function InformationBox(leftMargin, topMargin, Expenditure, Income, year) {
    // Initalizing  all the class variables 
    this.leftMargin = leftMargin;
    this.topMargin = topMargin;
    this.Expenditure = Expenditure;
    this.Income = Income;
    this.year = year;
    // Main Draw method which will used to draw the information Box needed for bar graph
    this.draw = function(){
        stroke(0);
        fill('pink');
        rect(this.leftMargin + 20, this.topMargin + 5, 175, 85);
        fill('black');
        noStroke();
        text(this.year, this.leftMargin + 90, this.topMargin + 20);
        text('  Income:  ', this.leftMargin + 55, this.topMargin + 35);
        text(this.Income, this.leftMargin + 110, this.topMargin + 35);
        text('  Expenditure:  ', this.leftMargin + 70, this.topMargin + 50);
        text(this.Expenditure, this.leftMargin + 140, this.topMargin + 50);
        text('  Net:  ', this.leftMargin + 40, this.topMargin + 65);
        text(this.Income - this.Expenditure, this.leftMargin + 110, this.topMargin + 65);
        text('($ million)', this.leftMargin + 60, this.topMargin + 80);
    }
}