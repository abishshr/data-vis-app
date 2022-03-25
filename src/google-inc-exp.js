function GoogleIncomeExpense() {

    // Name for the visualization to appear in the menu bar.
    this.name = 'Google Income and Research Expenditure: 2013-2020';

    // Each visualization must have a unique ID with no special
    // characters.
    this.id = 'Income-Research-Exp';

    // Title to display above the plot.
    this.title = 'Google Income and Research Expenditure ($ million)'

    // Names for each axis.
    this.xAxis = 'year';
    this.yAxis = '';

    var marginSize = 35;

    // Layout object to store all common  parameters and 
    this.layout = {
        marginSize: marginSize,

        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function () {
            return this.rightMargin - this.leftMargin;
        },

        plotHeight: function () {
            return this.bottomMargin - this.topMargin;
        },



        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 13,
        numYTickLabels: 10,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;


    // Preload the data. This function is called automatically by the
    // gallery when a visualization is added.

    this.preload = function () {
        var self = this;
        this.data = loadTable('./data/google-income-revenue/test.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });
    };

    this.setup = function() {
        // Font defaults.
        textSize(16);
        strokeWeight(1);

        // Set min and max years: assumes data is sorted by date.
        this.startYear = this.data.getNum(0, 0);
        this.endYear = this.data.getNum(this.data.getRowCount() - 1, 0) + 0.3;

        // Find min and max value for mapping to canvas height.
        this.minAmount = 0; // Amount equality (zero).
        // get maximum number of data 
        this.maxAmount = max(
            float(this.data.getColumn('research-expenditure'))
        ) + 13480;
    };

    this.destroy = function () {};

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        fill(220, 220, 220)
        noStroke();
        rect(this.layout.leftMargin, this.layout.topMargin, this.layout.rightMargin - marginSize * 2, this.layout.bottomMargin - marginSize);

        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minAmount,
            this.maxAmount,
            this.layout,
            this.mapAmountToHeight.bind(this),
            0);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxis,
            this.yAxis,
            this.layout);

        // Plot all pay gaps between startYear and endYear using the width of the canvas minus margins.
        var previous;
        var numYears = this.endYear - this.startYear;
        var barWidth = 20;

        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (var i = 0; i < this.data.getRowCount(); i++) {

            // Create an object to store data for the current year.
            var current = {
                // Convert strings to numbers.
                'year': this.data.getNum(i, 'year'),
                'Income': this.data.getNum(i, 'income'),
                'Expenditure': this.data.getNum(i, 'research-expenditure'),
            };

            if (previous != null) {
                // Draw rectangles (bars) to represent each data set

                stroke(0);

                //Income amount
                fill( 174, 207, 183);
                rect(this.mapYearToWidth(current.year) - barWidth,
                    this.mapAmountToHeight(current.Income),
                    barWidth,
                    this.layout.bottomMargin - this.mapAmountToHeight(current.Income)
                );


                //Expenditure amount
                fill(255, 105, 97);
                rect(this.mapYearToWidth(current.year),
                    this.mapAmountToHeight(current.Expenditure),
                    barWidth,
                    this.layout.bottomMargin - this.mapAmountToHeight(current.Expenditure)
                );

                // The number of x-axis labels to skip so that only
                // numXTickLabels are drawn.
                var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0) {
                    drawXAxisTickLabel(previous.year, this.layout,
                        this.mapYearToWidth.bind(this));
                }

                // Income data siplaying 
                // new variables to use for displaying a data values
                var Income_width = this.mapYearToWidth(current.year) - barWidth;

                // display data values
                if (mouseX < this.mapYearToWidth(current.year) && mouseX > Income_width && mouseY < this.layout.bottomMargin && mouseY > this.mapAmountToHeight(current.Income)) {

                    stroke(0);
                    fill('pink');
                    rect(this.layout.leftMargin + 20, this.layout.topMargin + 5, 155, 85);

                    fill('black');
                    noStroke();
                    text(current.year, this.layout.leftMargin + 90, this.layout.topMargin + 20);
                    text('Income:', this.layout.leftMargin + 50, this.layout.topMargin + 35);
                    text(current.Income, this.layout.leftMargin + 110, this.layout.topMargin + 35);
                    text('Expenditure:', this.layout.leftMargin + 65, this.layout.topMargin + 50);
                    text(current.Expenditure, this.layout.leftMargin + 130, this.layout.topMargin + 50);
                    text('Net:', this.layout.leftMargin + 40, this.layout.topMargin + 65);
                    text(current.Income - current.Expenditure, this.layout.leftMargin + 110, this.layout.topMargin + 65);
                    text('($ million)', this.layout.leftMargin + 60, this.layout.topMargin + 80);
                };

                //Expenditure data displaying
                // new variables to use for displaying a data values
                var Expenditure_width = this.mapYearToWidth(current.year) + barWidth;

                // diplay data values 
                if (mouseX > this.mapYearToWidth(current.year) && mouseX < Expenditure_width && mouseY < this.layout.bottomMargin && mouseY > this.mapAmountToHeight(current.Expenditure)) {

                    stroke(0);
                    fill('pink');
                    rect(this.layout.leftMargin + 20, this.layout.topMargin + 5, 155, 85);

                    fill('black');
                    noStroke();
                    text(current.year, this.layout.leftMargin + 90, this.layout.topMargin + 20);
                    text('Income:', this.layout.leftMargin + 50, this.layout.topMargin + 35);
                    text(current.Income, this.layout.leftMargin + 110, this.layout.topMargin + 35);
                    text('Expenditure:', this.layout.leftMargin + 65, this.layout.topMargin + 50);
                    text(current.Expenditure, this.layout.leftMargin + 130, this.layout.topMargin + 50);
                    text('Net:', this.layout.leftMargin + 40, this.layout.topMargin + 65);
                    text(current.Income - current.Expenditure, this.layout.leftMargin + 110, this.layout.topMargin + 65);
                    text('($ million)', this.layout.leftMargin + 60, this.layout.topMargin + 80);
                }
            }
            previous = current;
        }

        // Label that describe what each bar represent 
        fill(255, 105, 97);
        rect(375, 50, 10, 10);
        fill('black');
        text('Expenditure', 450, 55);
        fill(174, 207, 183);
        rect(375, 70, 10, 10);
        fill('black');
        text('Income', 445, 75)
    };

    this.drawTitle = function () {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.topMargin - (this.layout.marginSize / 2));
    };

    this.mapYearToWidth = function (value) {
        return map(value,
            this.startYear,
            this.endYear,
            this.layout.leftMargin, // Draw left-to-right from margin.
            this.layout.rightMargin);
    };

    this.mapAmountToHeight = function (value) {
        return map(value,
            this.minAmount,
            this.maxAmount,
            this.layout.bottomMargin, // Small value at bottom.
            this.layout.topMargin); // Big value at top.
    };
}
