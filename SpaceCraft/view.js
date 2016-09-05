/***
 * Scaffolded by Jingjie (Vincent) Zheng on June 24, 2015.
 */

'use strict';

/**
 * A function that creates and returns the spaceship model.
 */

function createViewModule() {
  var SpaceshipView = function(model, canvas) {
    /**
     * Obtain the SpaceshipView itself.
     */
    var self = this;
    /**
     * Maintain the model.
     */
    this.model = model;

    /**
     * Maintain the canvas and its context.
     */
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    /**
     * Update the canvas. 
     * You should be able to do this trivially by first clearing the canvas, then call the rootNode's 
     * renderAll() with the context.
     */
    this.update = function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.model.rootNode.renderAll(this.context);

      //TODO
    };

    /**
     * You should add the view as a listener to each node in the scene graph, so that the view can get 
     * updated when the model is changed.
     */
    this.model.rootNode.addListener(this);
    this.model.headNode.addListener(this);
    this.model.spaceshipNode.addListener(this);
    this.model.bodyNode.addListener(this);
    this.model.handleNode.addListener(this);
    this.model.tailNode.addListener(this);
    
    //TODO

    /**
     * Handle mousedown events.
     * You should perform a hit detection here by calling the model's performHitDetection().
     */ 

    var hitArea = -1; 
    var preX = 0;
    var preY = 0;
    canvas.addEventListener('mousedown', function(e) {
      //TODO
      if (flying == 1){
        return;
      }
      var rect = canvas.getBoundingClientRect();
      preX = e.clientX - rect.left;
      preY = e.clientY - rect.top;
      var point = [{x: e.clientX - rect.left, y: e.clientY - rect.top}]; 
      var hit = self.model.performHitDetection(point);
      if ((flying == 1) || (powerup == 1)){
        if (hit.id == 'handle'){
          return;
        }
      }
      if (hit == null){
        return;
      } else {
        if (hit.id == 'body'){
            hitArea = 1;
            document.body.style.cursor = "move";
        } else if (hit.id == 'handle'){
            hitArea = 0;
            document.body.style.cursor = "pointer";
        }
      }

    });

    /**
     * Handle mousemove events.
     */ 
    canvas.addEventListener('mousemove', function(e) {
      //TODO
      //drag and move rocket body
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        
        var inverse = self.model.spaceshipNode.globalTransformation.createInverse();
        var NewX = x * inverse.m00_ + y * inverse.m01_ + inverse.m02_;
        var NewY = x * inverse.m10_ + y * inverse.m11_ + inverse.m12_;

        var oldX = preX * inverse.m00_ + preY * inverse.m01_ + inverse.m02_;
        var oldY = preX * inverse.m10_ + preY * inverse.m11_ + inverse.m12_; 
      //probelm
        if (hitArea ==1 ){

            self.model.spaceshipNode.translate(NewX - oldX, NewY - oldY);
            
      // click and change rocket length
         } else if (hitArea == 0){
            var diff = NewY - oldY;
            if ( self.model.bodyNode.localBoundingBox.h - diff <= 50){
          

            } else if (self.model.bodyNode.localBoundingBox.h - diff >= 200){
             

            } else {

              self.model.bodyNode.localBoundingBox.h += -diff;
              self.model.bodyNode.localBoundingBox.y += diff;
              self.model.handleNode.translate(0,diff);
              self.model.headNode.translate(0, diff);

            }

        }
        preX = x;
        preY = y;
        
    });


    /**
     * Handle mouseup events.
     */ 

    var movingFoward = function (){
      if (flying == 1){
        self.model.spaceshipNode.translate(0,-20);

      }

      if ((TurnLeft == 1) && (TurnRight == 0)){
        if (current_degree != 5){
          self.model.tailNode.rotate(0.157, -5, 0);
          current_degree += 1;
                
        }
      }

      if ((TurnRight == 1) && (TurnLeft == 0)){
        if (current_degree != -5){

          self.model.tailNode.rotate(-0.157, -5, 0);
          current_degree = current_degree - 1;
        }
      }

      if (current_degree != 0){
        if (flying == 1){
          if (current_degree > 0){
            self.model.spaceshipNode.rotate(-0.03 * current_degree, 0, 0);

          } else {
            self.model.spaceshipNode.rotate(-0.03 * current_degree, 0, 0);

          }
        }
      } 

        var x  = self.model.spaceshipNode.globalTransformation.getTranslateX();
        var y  = self.model.spaceshipNode.globalTransformation.getTranslateY();
        var inverse = self.model.spaceshipNode.globalTransformation.createInverse();
        var oldX = x * inverse.m00_ + y * inverse.m01_ + inverse.m02_;
        var oldY = x * inverse.m10_ + y  * inverse.m11_ + inverse.m12_;

        var X ;
        var Y ; 
        // top
        if (y + 60 < 0){
          X = x * inverse.m00_ + (y + canvas.height) * inverse.m01_ + inverse.m02_;
          Y = x * inverse.m10_ + (y + canvas.height) * inverse.m11_ + inverse.m12_;

          self.model.spaceshipNode.translate(X - oldX, Y - oldY + 60);
          if (self.model.rootNode.currentAlter == 1){
            self.model.rootNode.currentAlter = 0;
          } else {
            self.model.rootNode.currentAlter = 1;
          }
          //bot
        } else if (y - 60 > canvas.height){
          X = x * inverse.m00_ + (y - canvas.height) * inverse.m01_ + inverse.m02_;
          Y = x * inverse.m10_ + (y - canvas.height) * inverse.m11_ + inverse.m12_;

          self.model.spaceshipNode.translate(X - oldX, Y - oldY + 60);

          if (self.model.rootNode.currentAlter == 2){
            self.model.rootNode.currentAlter = 3;
          } else {
            self.model.rootNode.currentAlter = 2;
          }

          //right
        } else if (x - 60 >canvas.width){
          X = (x - canvas.width) * inverse.m00_ + y   * inverse.m01_ + inverse.m02_;
          Y = (x - canvas.width) * inverse.m10_ + y   * inverse.m11_ + inverse.m12_;

          self.model.spaceshipNode.translate(X - oldX , Y - oldY + 60);
          
          if (self.model.rootNode.currentAlter == 3){
            self.model.rootNode.currentAlter = 1;
          } else {
            self.model.rootNode.currentAlter = 3;
          }

        } else if (x + 60 < 0){
          X = (x + canvas.width) * inverse.m00_ + y   * inverse.m01_ + inverse.m02_;
          Y = (x + canvas.width) * inverse.m10_ + y   * inverse.m11_ + inverse.m12_;

          self.model.spaceshipNode.translate(X - oldX , Y - oldY + 60);
          
          if (self.model.rootNode.currentAlter == 4){
            self.model.rootNode.currentAlter = 3;
          } else {
            self.model.rootNode.currentAlter = 4;
          }
        }          
    }


    canvas.addEventListener('mouseup', function(e) {
      //TODO
        document.body.style.cursor = "";
        hitArea = -1;

    });

    /**
     * Handle keydown events.
     */ 

    var fly ;

    self.model.fireNode = null; 
    var current_degree = 0;
    var flying = 0;
    var keyPressed = [];
    var powerup = 0;
    var TurnLeft  = 0;
    var TurnRight = 0;


    document.addEventListener('keydown', function(e) {
      //TODO
      // up

      if (e.keyCode == '38'){
        if (flying == 1){
        } else {
          flying = 1;
          movingFoward();
          if(!fly){
            fly = setInterval(movingFoward, 80 );
          }
        if (self.model.fireNode == null){

            self.model.fireNode = new sceneGraphModule.FireNode('fire', self.model.tailNode);
            self.model.fireNode.addListener(self);
            self.model.nodes.push(self.model.fireNode);
            self.model.fireNode.translate(0, 25);
        }    
      }
      //left
      } 
      if (e.keyCode == '37'){

            TurnLeft = 1;
            if (!fly){
              movingFoward();

              fly = setInterval(movingFoward, 80 );
            }           
      } 
      if (e.keyCode == '39'){

         TurnRight = 1;
         if (!fly){
          movingFoward();

          fly = setInterval(movingFoward, 80 );
        }       
      }
    });

    /**
     * Handle keyup events.
     */ 
    var pUp; 
    document.addEventListener('keyup', function(e) {
      //TODO
      // moving
      if (e.keyCode == '38'){
        self.model.tailNode.removeChild(self.model.fireNode);
        self.model.fireNode.removeListener(self);
        self.model.nodes.pop();
        self.model.fireNode = null;
        self.update();
        flying = 0;
      } else if (e.keyCode == "32"){
        if (powerup == 0){
            self.model.spaceshipNode.scale(2,2);
            powerup = 1;

            pUp = setInterval(function (){
                clearInterval(pUp);
                self.model.spaceshipNode.scale(0.5, 0.5);
                powerup = 0;
            }, 5000 );

        }
      } else if (e.keyCode == '37'){
          TurnLeft = 0;
      } else if (e.keyCode == '39'){
          TurnRight = 0;
      }
      if ((TurnLeft == 0) && (TurnRight == 0) && (flying == 0)){
        clearInterval(fly);
        fly = false;
      }
            
    });

    /**
     * Update the view when first created.
     */

    this.update();
  };

  return {
    SpaceshipView: SpaceshipView
  };
}