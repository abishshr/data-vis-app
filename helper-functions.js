// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;
  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);
  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }
  return total;
}
function mean(data) {
  var total = sum(data);
  return total / data.length;
}
function sliceRowNumbers (row, start=0, end) {
  var rowData = [];
  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }
  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }
  return rowData;
}
function stringsToNumbers (array) {
  return array.map(Number);
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour=0) {
  stroke(color(colour));
  // x-axis
  line(layout.leftMargin,
      layout.bottomMargin,
      layout.rightMargin,
      layout.bottomMargin);
  // y-axis
  line(layout.leftMargin,
      layout.topMargin,
      layout.leftMargin,
      layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');
  // Draw x-axis label.
  text(xLabel,
      (layout.plotWidth() / 2) + layout.leftMargin,
       layout.bottomMargin + (layout.marginSize * 1.5));
  // Draw y-axis label.
  push();
  translate(layout.leftMargin - (layout.marginSize * 1.5),
            layout.bottomMargin / 2);
  rotate(- PI / 2);
  text(yLabel, 0, 0);
  pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction, decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;
  fill(0);
  noStroke();
  textAlign('right', 'center');
  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);
    // Add tick label.
    text(value.toFixed(decimalPlaces),
        layout.leftMargin - layout.pad,
        y);
    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);
  fill(0);
  noStroke();
  textAlign('center', 'center');
  // Add tick label.
  text(value,
      x,
      layout.bottomMargin + layout.marginSize / 2);
  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x,
          layout.topMargin,
          x,
          layout.bottomMargin);
  }
}

// --------------------------------------------------------------------
// Checking if two words in word cloud overlap 
// --------------------------------------------------------------------

function isOverlapping(x, y, word, others, max_size) {
  const wordHeight = (word.size / max_size) * 40 + 3; // scale word size from old data
  textSize(wordHeight);
  const wWidth = textWidth(word.text);
  for (let i = 0; i < others.length; i++) {
    textSize(others[i].size);
    const oWidth = textWidth(others[i].text);
    if (x + wWidth > others[i].x &&
        x < others[i].x + oWidth &&
        y + others[i].size*0.2 > others[i].y - others[i].size*0.7 &&
        y - wordHeight < others[i].y) {
      return true;
    }
  }
  return false;
}

// --------------------------------------------------------------------
// Converting Latitude and Longitude to Y and X Coordinate Position
// --------------------------------------------------------------------
function convertLongitudeToXpos(lon, zoom) {
  lon = radians(lon);
  let  a = (256 / PI) * pow(2, zoom);
  let  b = lon + PI;
  return a * b;
}

function convertLatitudeToYpos(lat, zoom) {
  lat = radians(lat);
  let c = (256 / PI) * pow(2, zoom);
  let d = tan(PI / 4 + lat / 2);
  let e = PI - log(d);
  return c * e;
}

// --------------------------------------------------------------------
// Calculating the data size in the source file 
// --------------------------------------------------------------------
function calculateDataSize(data, stockCount) {
  let maxSize = 0;
  for (let i = 0; i < stockCount; i++) {
      if (data[i].size > maxSize) {
      maxSize = data[i].size;
      }
  }
  return maxSize
}

// --------------------------------------------------------------------
// Helper function to draw on off-screen graphics buffer
// --------------------------------------------------------------------

function drawOnGraphicsBuffer(longitudeCenter,latitudeCenter,covid19,covidRecoveryData,index,zoom,graphicsScreen,dataCategory,fillColor){
  translate(width / 2, height / 2);
  graphicsScreen.clear();
  let xPosOnMap, yPosOnMap
  const convertedX = convertLongitudeToXpos(longitudeCenter, zoom);
  const convertedY = convertLatitudeToYpos(latitudeCenter, zoom);
  if (dataCategory == 'Confirmed' || dataCategory == 'Death' || dataCategory == 'Active'){
      for (let i = 0; i < covid19.length; i++) {
          const data = covid19[i].split(/,/);
          const latitudeSourceData = data[5];
          const longitudeSourceData = data[6];
          let dataType = data[index];
          xPosOnMap = (convertLongitudeToXpos(longitudeSourceData, zoom) - convertedX)/2 + 256;
          yPosOnMap = (convertLatitudeToYpos(latitudeSourceData, zoom) - convertedY)/2 + 127;
          const maxDataType = log(dataType) * 2;
          dataType = pow(1, dataType);
          const confirmedRadius = (map(dataType, 0, maxDataType, 0, 100))/5;
          graphicsScreen.strokeWeight(2);
          graphicsScreen.stroke(255, 255, 255, 6);
          graphicsScreen.fill(fillColor);
          graphicsScreen.ellipse(xPosOnMap, yPosOnMap, confirmedRadius);
      }
  }
  else {
      for (let i = 0; i < covid19.length + covidRecoveryData.length; i++) {
          let recovered;
          let xPosOnMap, yPosOnMap, latitudeSourceData, longitudeSourceData, data;
          if (i < covid19.length) {
              data = covid19[i].split(/,/);
              latitudeSourceData = data[5];
              longitudeSourceData = data[6];
              recovered = data[9];
              xPosOnMap = (convertLongitudeToXpos(longitudeSourceData, zoom) - convertedX)/2 + 256;
              yPosOnMap = (convertLatitudeToYpos(latitudeSourceData, zoom) - convertedY)/2 + 130;
          } else {
              data = covidRecoveryData[i - covid19.length].split(/,/);
              latitudeSourceData = data[3];
              longitudeSourceData = data[4];
              recovered = data[7];
              xPosOnMap = convertLongitudeToXpos(longitudeSourceData, zoom) - convertedX;
              yPosOnMap = convertLatitudeToYpos(latitudeSourceData, zoom) - convertedY;
          }
          const maxRecovered = log(recovered) * 1;
          recovered = pow(1, recovered);
          const recoveredRadius = (map(recovered, 0, maxRecovered, 0, 100))/5;
          graphicsScreen.strokeWeight(2);
          graphicsScreen.stroke(255, 255, 255, 6);
          graphicsScreen.fill(54, 255, 11, 100);
          graphicsScreen.ellipse(xPosOnMap, yPosOnMap, recoveredRadius);
      }
  }
}