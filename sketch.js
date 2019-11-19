//Triad visualizer
//Press Up to hear a major arpeggio
//Press Down to hear a minor arpeggio
//Press Left to hear a diminished arpeggio
//Press Right to hear a augmented arpeggio
//Code 1
//Robert McGinness


let myOscillator;
let timer = 0.5;
let note = 1;
let speed = 1.5;
let speedingUp = true;

let doNote = 261;
let reNote = 329;
let miNote = 392;
let doNoteHigh = 523;

let circleArray = [];
let lineArray = [];
let squareArray = [];

let circleTimer = 0;
let lineTimer = 0;
let squareTimer = 0;

let mode = 0; //0 is major, 1 is minor, 2 is diminished, 3 is augmented

function setMode() {
  switch (mode) {
    case 0:
      reNote = 329;
      miNote = 392;
      break;
    case 1:
      reNote = 311;
      miNote = 392;
      break;
    case 2:
      reNote = 311;
      miNote = 370;
      break;
    case 3:
      reNote = 329;
      miNote = 415;
      break;
    default:
      break;
  }
}

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);

  myOscillator = new p5.Oscillator();
  myOscillator.setType('square');
  myOscillator.freq(261);
  myOscillator.amp(0.25);
  myOscillator.start();

  myOscillator2 = new p5.Oscillator('square');
  myOscillator2.freq(329);
  myOscillator2.amp(0.25);
  myOscillator2.start();

  myOscillator3 = new p5.Oscillator();
  myOscillator3.setType('square');
  myOscillator3.freq(131);
  myOscillator3.amp(0.5);
  myOscillator3.start();

}

function draw() {
  if (speedingUp) {
    speed = speed * 1.00075;
    if (speed > 3.5) {
      speedingUp = false;
    }
  } else {
    speed = speed * 0.9995;
    if (speed < 1.5) {
      speedingUp = true;
    }
  }

  timer -= (deltaTime * speed) / 1000;
  if (timer <= 0) {
    timer = 0.5;
    note++;
    if (note >= 5) {
      note = 1;
    }

    if (note == 3) {
      if (mode == 3) {
        myOscillator3.freq(207);
      } else if (mode == 2) {
        myOscillator3.freq(185);
      } else {
        myOscillator3.freq(196);
      }
    } else if (note == 1) {
      myOscillator3.freq(261);
    }

    if (note == 2 || note == 4) {
      myOscillator.freq(reNote);
      myOscillator2.freq(miNote);
      myOscillator.start();
      myOscillator2.start();
    } else if (note == 1) {
      myOscillator.freq(doNote);
      myOscillator2.freq(reNote);
    } else {
      myOscillator.freq(miNote);
      myOscillator2.freq(doNoteHigh);
    }

  }


  if (mode == 0) {
    background(0, 255, 255);
    textSize(width / 5);

    circleTimer -= deltaTime * speed / 1000;
    if (circleTimer <= 0) {
      circleArray.push(new MajorCircle());
      circleTimer = 0.5;
    }

    for (let a = 0; a < circleArray.length; a++) {
      circleArray[a].grow();
      circleArray[a].show();
      if (circleArray[a].a < 5) {
        circleArray.splice(a, 1);
      }
    }


    fill(0, 0, 0);
    strokeWeight(3);
    text("MAJOR", width / 6, height / 2);
  } else if (mode == 1) {
    background(0);
    textSize(width / 5);

    lineTimer -= deltaTime * speed / 1000;
    if (lineTimer <= 0) {
      lineArray.push(new MinorLine());
      lineTimer = 0.05;
    }

    for (let a = 0; a < lineArray.length; a++) {
      lineArray[a].move();
      lineArray[a].show();
      if (lineArray[a].y <= -0.5) {
        lineArray.splice(a, 1);
      }
    }
    
    fill(255);
    strokeWeight(3);
    text("MINOR", width / 6, height / 2);
  } else if (mode == 2) {
    background(0);
    textSize(width/10);
    for(r = 0;r <= height;r+=height/10)
    {
      for(c = 0;c <= width;c+=width/10)
      {
        fill(random(125,200));
        triangle(c,r+height/10,c+width/20,r,c+width/10,r+height/10);
      }
    }
    fill(255,230,52);
    text("DIMINISHED", width / 5, height / 2);
  
  } else if (mode == 3) {
    background(75,50,100);
    textSize(width / 10);

    squareTimer -= deltaTime * speed / 1000;
    if (squareTimer <= 0) {
      squareArray.push(new AugmentedSquare());
      squareTimer = 0.25;
    }

    for (let a = 0; a < squareArray.length; a++) {
      squareArray[a].move();
      squareArray[a].show();
      if (squareArray[a].y >= 1.25) {
        squareArray.splice(a, 1);
      }
    }
    
    fill(255);
    strokeWeight(3);
    text("AUGMENTED", width/5, height / 2);
  }
}

class MajorCircle {
  constructor() {
    this.r = 150;
    this.g = random(200, 255);
    this.b = random(160, 220);
    this.a = 255;

    this.timer = random(1, 4);
    this.x = random();
    this.y = random();
    this.size = random(50, 200);
  }

  show() {
    fill(this.r, this.g, this.b, this.a);
    this.a -= 1;
    strokeWeight(0);
    ellipse(width * this.x, height * this.y, this.size, this.size);
  }

  grow() {
    this.size = this.size * 1.003;
    this.timer -= deltaTime;
  }
}

class MinorLine {
  constructor() {
    this.r = random(200, 255);
    this.g = random(0, 40);
    this.b = random(0, 70);

    this.w = random(0.05, 0.2);
    this.w = this.w * width;
    this.y = random();
    this.isLeft = true;
    this.x = 1;
    if (random(0.0,1.0) > 0.5) {
      this.isLeft = false;
      this.x = random(-0.2);
    }
  }

  show() {
    stroke(this.r, this.g, this.b);
    strokeWeight(10);
    line(width * this.x, height * this.y, width * this.x + this.w, height * this.y);
    stroke(0);
    print(" " + this.x);
  }

  move() {
    if (this.isLeft) {
      this.x -= (deltaTime/1000);
      if (this.x + this.width <= 0) 
      {
          this.y = -1;
      }
    } else {
     this.x+= (deltaTime/1000);
      if (this.x >= width) 
      {
          this.y = -1;
      } 
    }
  }
}

class AugmentedSquare {
  constructor() {
    this.r = random(150, 250);
    this.g = random(70,150);
    this.b = random(150, 250);

    this.w = random(0.1, 0.3);
    this.w = this.w * width;
    this.y = -0.2;
    this.x = random();
    
    this.rot = random(0,360);
  }

  show() {
    noStroke();
    fill(this.r, this.g, this.b);
    push();
    rectMode(CENTER);
    translate(width * this.x, height * this.y);
    rotate(this.rot);
    
    rect(width * this.x, height * this.y, this.w,this.w);
    stroke(0);
    pop();
  }

  move() {
    this.y += 2*(deltaTime/1000);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    mode = 0;
  } else if (keyCode === DOWN_ARROW) {
    mode = 1;
  } else if (keyCode === LEFT_ARROW) {
    mode = 2;
  } else if (keyCode === RIGHT_ARROW) {
    mode = 3;
  }
  setMode();
}