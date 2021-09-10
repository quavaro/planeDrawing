let size = 0;
let width;
let height;
let classifier;
let drawingCanvas;
let label = "";
let submittedLabel = '';
let lastX = -1;
let lastY = -1;
let startNewShape = false;
let shapeArray = [];
let planeVector = {_x:1, _y:1, 
                   get x () {
                     return this._x;
                   }, 
                   set x (newX){
                     if(typeof newX === 'number'){
                       this._x = newX;
                       console.log('valid input')
                     }
                     else{
                       return 'Invalid input';
                     }
                   },
                   get y () {
                     return this._y;
                     }, 
                   set y (newY){
                     if(typeof newY === 'number'){
                       this._y = newY;
                       console.log('valid input')
                     }
                     else{
                       return 'Invalid input';
                     }
                   }
                  };
let planePosition = {_x:0, _y:0, 
                     get x () {
                       return this._x;
                     }, 
                     set x (newX){
                       if(typeof newX === 'number'){
                         this._x = newX;
                         console.log('valid input')
                       }
                       else{
                         return 'Invalid input';
                       }
                     },
                     get y () {
                       return this._x;
                       }, 
                     set y (newY){
                       if(typeof newY === 'number'){
                         this._x = newY;
                         console.log('valid input')
                       }
                       else{
                         return 'Invalid input';
                       }
                     }
                    };
let shapeIndex = 0;
let win = false;
let startText="";
let startTextPos;

fetch('class_names.txt')
  .then(response => response.text())
  .then(text => {
    shapeArray = text.split(/\r?\n/);
  console.log(shapeArray);
});
  // outputs the content of the text file

setup = () => {
  width = windowWidth-10;
  height = windowHeight-10;
  startTextPos = height;
  planePosition.x = 0
  planePosition.y = 0;
  createCanvas(width, height);
  background(0);
  startText = "Welcome back to your last fly test, cadet. I know you're ready for this. \n\nPull this off, and you will be a full-fledged pilot in the Thunderhawk Demonstration Squadron. \n\nJust pilot your plane with the arrow keys and draw the test figures \n\nOK, here we go. Draw this next shape. Press enter to initiate the controls.";

  drawingCanvas = createGraphics(width, height);
  drawingCanvas.strokeWeight(1);
  drawingCanvas.stroke(255);
  //drawingCanvas.background(0);
  classifier = ml5.imageClassifier('DoodleNet', classifyImage);
};

draw = () => {
  // first, erase
  background(0);
  image(drawingCanvas, 0, 0, width, height);

  //if we have started the game, and the shape size has not overtaken the screen's width draw the shape and user submission, and check for winning shape 
  if(startNewShape) {
    planePosition.x += planeVector.x;
    planePosition.y += planeVector.y;
    // Draw a line under the plane
  console.log(planeVector.x + ", " + planeVector.y);
    if(lastX>=0) {
      drawingCanvas.line(lastX, lastY, planePosition.x, planePosition.y);
    }
    lastX = planePosition.x; 
    lastY = planePosition.y;          
    let shape = shapeArray[shapeIndex];
    console.log(shapeIndex + ' ' + shape);
    noFill();
    stroke(255);
    
    // Draw the label
    let textToDraw = label === "" ? "Draw a " + shape + "! Escape to clear. Looks like you've got a" : label + " so far. Spacebar to submit.";
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(textToDraw, width / 2, height - 20);

    //don't check label until this flag is set
    if(submittedLabel===shape) {
      win = true;
      startNewShape=false;
    }
    else{
                win=false;
    }
  }
  else {
    fill(255);
    textSize(16);
    textAlign(CENTER);
    startNewShape=false;
    size=0;
    if(startText.length>0){
      textToDraw = startText;
      textSize(24);
      textAlign(LEFT);
      text(textToDraw, width / 2 - 200, startTextPos, 500, height);
      startTextPos -= 2;
    }
    else if(win){
      textToDraw = "You did it! Press enter to try the next one.";
      text(textToDraw, width / 2, height - 20);
    }
    else{
      textToDraw = "Argh, no cigar. That'll hurt your score. Try again. Press enter to start";
      text(textToDraw, width / 2, height - 20);
    }   
  }
};

    keyPressed = () => {
      const handleKey = {
          "ArrowLeft"  : () => {planeVector.x -=0.25},
          "ArrowRight" : () => {planeVector.x +=0.25},
          "ArrowUp"    : () => {planeVector.y -=0.25},
          "ArrowDown"  : () => {planeVector.y +=0.25},
          " " : () => {submittedLabel=label},
          "Escape": () => {label=" "; 
                           drawingCanvas.background(0);
                          planePosition.x = 0;
                          planePosition.y = 0},
          "Enter"      : () => {console.log("Enter");
                                startText = '';
                                drawingCanvas.background(0);
                                startNewShape = true;
                                shapeIndex = Math.floor(random(3.9999));
                                submittedLabel="";}
      }[key]
      handleKey?.()
    };
      // Get a prediction for the current video frame
    classifyImage = () => {
        classifier.classify(drawingCanvas, gotResult);
    };
    
    gotResult = (error, results) => {
      if (error) {
            console.error(error);
            return;
        }

        // results is an array, sorted by confidence. Each
        // result will look like { label: "category label" confidence: 0.453 }
        // or something like this
        if (results[0].confidence > 0.75){
            label = results[0].label;
        }
        classifyImage();
    };
