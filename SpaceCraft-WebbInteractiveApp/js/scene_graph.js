/***
 * Scaffolded by Jingjie (Vincent) Zheng on June 24, 2015.
 */

'use strict';

/**
 * A function that creates and returns the scene graph classes.
 * This module has an astract GraphNode which generalises the behaviour of a node in a scene graph.
 * Other classes inherit the GraphNode, forming a tree structure when instantiated.
 * - RootNode represents the background and the scene.
 * - SpaceshipNode represents the spaceship.
 * - BodyNode, HeadNode, and TailNode represent the three parts that belong to the spaceship.
 * - HandleNode refers to the black handle on the top of the body.
 * - FireNode belongs to the tail, representing the fire at the end of the spaceship.
 * These classes should be instantiated in model.js.
 */
function createSceneGraphModule() {

    /**
     * An abstract graph node in a scene graph.
     * @param id: Node identifier.
     * @param parent: Parent of the node in the scene graph.
     */
    var GraphNode = function(id, parent) {
        // Maintain the identifier.
        this.id = id;

        // Maintain a local transformation that is relative to its parent.
        this.localTransformation = new AffineTransform();

        // Maintain a global transformation that is relative to the canvas coordinate.
        // This matrix is useful when performing a hit detection.
        this.globalTransformation = new AffineTransform();

        // If a valid parent is passed in, save the parent to this node, then add this node to the parent.
        this.parent = typeof parent !== 'undefined' ? parent : null;
        if (parent) {
            parent.addChild(this);
        }

        // Maintain a list of child nodes.
        this.children = [];

        // Local bounding box of this node. This should be overridden by concreate graph nodes.
        // The coordinate of the bounding box is from the perspective of the node itself, not 
        // from the canvas.
        this.localBoundingBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };

        // Indicate whether this node is interactable with a mouse. If it is not interactable with 
        // mouse at all, we do not need to perform a hit detection on it.
        this.isInteractableWithMouse = false;

        // Maintain a list of listners.
        this.listeners = [];
    };

    _.extend(GraphNode.prototype, {
        
        /**
         * Notify all listeners the change in this node.
         */
        notify: function() {
            //TODO

            _.each(this.listeners, function(x){
                x.update();
            })
        },

        /**
         * Add a listener, if it is not registered with this node.
         * @param listener: Object that listens for the change of the node.
         */
        addListener: function(listener) {
            //TODO

            var index = this.listeners.indexOf(listener);
            if (index == -1) {
                this.listeners.push(listener);
            }
        },

        /**
         * Remove a listener, if it is registered with this node.
         * @param listener: Listener that is registered with this node. 
         */
        removeListener: function(listener) {
            //TODO

            var index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }

        },

        /**
         * Add a child node to this node if it is not appended to this node.
         * 
         * You should point the child's parent to this node and add the child to the children list.
         * You should also recursively update the global transformations of its descendants, as they are
         * appended to a new parent.
         * @param node: Child node to be added.
         */
        addChild: function(node) {

            var index = this.children.indexOf(node);
            if (index == -1) {
                node.updateAllGlobalTransformation();
                this.children.push(node);

            }

            //TODO
        },

        /**
         * Remove a child node of this node, if it is appended to this node.
         * @param node: Child node to be removed.
         */
        removeChild: function(node) {
            //TODO
            var index = this.children.indexOf(node);
            if (index !== -1) {
                this.children.splice(index, 1);
            }
        },

        /**
         * Apply a Google Closure AffineTransform object to the HTML5 Canvas context.
         * @param context: HTML5 Canvas context.
         * @param transformation: Google Closure AffineTransform object.
         */
        applyTransformationToContext: function(context, transformation) {
            context.transform(transformation.m00_, 
                transformation.m10_,
                transformation.m01_,
                transformation.m11_,
                transformation.m02_,
                transformation.m12_);
        },

        /**
         * Update the global transformation of _ONLY_ this node.
         * Specifically, if it is the root of the scene graph, update itself with its local 
         * transformation, otherwise clone the global transformation of its parent, then concatenate it 
         * with this node's local transformation.
         */
        updateGlobalTransformation: function() {
            //TODO
            if (this.id == 'scene'){
                this.globalTransformation = this.localTransformation;
            } else {
                var parent = this.parent.globalTransformation.clone();
                this.globalTransformation = parent.concatenate(this.localTransformation);
                
            }
        },

        /**
         * Update the global transformations of this node and its descendants recursively.
         */
        updateAllGlobalTransformation: function() {
            //TODO
            var self = this;
            this.updateGlobalTransformation();

            _.each(self.children, function(x){
                x.updateAllGlobalTransformation();
            });
        },

        /**
         * Render _ONLY_ this node with the assumption that the node is painted at around the origin. 
         * @param context: Context obtained from HTML5 Canvas.
         */
        renderLocal: function(context) {
            //TODO
        },

        /**
         * Recursively render itself and its descendants.
         * 
         * Specifically, 
         * 1. Save Canvas context before performing any operation.
         * 2. Apply local transformation to the context.
         * 3. Render the node and its children, 
         * 4. Restore Canvas context.
         *
         * @param context: Context obtained from HTML Canvas.
         */
        renderAll: function(context) {
            //TODO
        
            context.save();
            this.applyTransformationToContext(context, this.localTransformation);
            this.renderLocal(context);
            _.each(this.children, function(x){
                x.renderAll(context);
            });
            context.restore();

        },

        /**
         * Rotate this node and its descendants.
         * 
         * Specifically, 
         * 1. Concatenate a rotation matrix after the current local transformation. This would apply 
         *    the rotation prior to other transformation that has been applied to this node. It is 
         *    equivalent to using the inverse of the current local transformation to return this node 
         *    back to the origin, applying the rotation, and transforming this node back with the local
         *    transformation.
         * 2. Update the global transfomration. Applying change to this node would in fact change the 
         *    positions and orientations of all its descendants. Thus, you should update the global 
         *    transformation matrix of itself and all its descendants. This allows us to perform a O(1)
         *    hit detection without the need to concatenate local matrices along the hierarchy each
         *    time we perform the hit detection.
         * 3. Finally, notify the view to update. This would make the canvas to repaint the scene graph
         *    by traversing down the tree.
         *
         * You do not need to traverse down the tree to update every descendant's local transformation,
         * since the scene graph will render this node's children based on the transformation applied to
         * the node.
         *  
         * @param theta: Angle to rotate clockwise.
         * @param x, y: Centre of Rotation.
         */
        rotate: function(theta, x, y) {
            //TODO
            var matrix = new AffineTransform();
            matrix.preRotate(theta, x, y);

            this.localTransformation.concatenate(matrix);
            this.updateAllGlobalTransformation();
            this.notify();

        },

        /**
         * Translate this node and its descendants.
         * 
         * Specifically, 
         * 1. Concatenate a translation matrix after the current local transformation. 
         * 2. Update the global transfomration recursively to the node and its descendants.
         * 3. Finally, notify the view to update.
         * 
         * @param dx: Distance to translate in the x direction from the node's coordinate system.
         * @param dy: Distance to translate in the y direction from the node's coordinate system.
         */
        translate: function(dx, dy) {
            //TODO
            var matrix = new AffineTransform();
            matrix.preTranslate(dx,dy);
            this.localTransformation.concatenate(matrix);
            this.updateAllGlobalTransformation();
            this.notify();
        },

        /**
         * Scale this node and its descendants.
         * 
         * Specifically, 
         * 1. Concatenate a scaling matrix after the current local transformation. 
         * 2. Update the global transfomration recursively to the node and its descendants.
         * 3. Finally, notify the view to update.
         *
         * Note that doing this would propogate the scaling to its descendants when rendering.
         * You may also need another function to scale the shape by updating its rendering dimensions
         * as well as its bounding box.
         *
         * @param sx: Scaling factor in the x direction from the node's coordinate system.
         * @param sy: Scaling factor in the y direction from the node's coordinate system.
         */
        scale: function(sx, sy) {
            //TODO
            var matrix = new AffineTransform();
            matrix.preScale(sx,sy);

            this.localTransformation.concatenate(matrix);
            this.updateAllGlobalTransformation();
            this.notify();

        },



        /** 
          * Check whether a point is within the local bounding box.
          * Specifically, 
          * if this node is interactable with a mouse,
          * 1. Create the inverse matrix of the current global transformation.
          * 2. Transform the point with the matrix, so that the point becomes the coordinate relative
          *    to this node.
          * 3. Check with the transformed point whether it's in the local bounding box.
          * 
          * If it does not interact with a mouse, there is no need to perform a hit detection, 
          * you should return false.
          *
          * @param point: Point to be checked. It is a coordinate represented with list [x y].
          *               It is always the coordinate from the perspective of the canvas, i.e., 
          *               in the world view.
          * 
          * @return false if the node is not interactable with a mouse. When it is, return true if the 
          *         point is in the local bounding box, otherwise false.
          */
        performHitDetection: function(point) {
            //TODO
            if (this.isInteractableWithMouse == false){
                return false;
            } else {
                var inverse = this.globalTransformation.createInverse();

                var x = point[0].x;
                var y = point[0].y;

                var X = x * inverse.m00_ + y * inverse.m01_ + inverse.m02_;
                var Y = x * inverse.m10_ + y * inverse.m11_ + inverse.m12_;

                var ss = this.localBoundingBox;

                if ((X < ss.w + ss.x) && (X >  ss.x) && (Y < ss.h + ss.y) && (Y > ss.y)){
                    return true;
                }
                
            }
            return false;
        },

    });


    /**
     * RootNode is the root of the scene graph, i.e., it represents the canvas.
     */
    var RootNode = function() {
        // Inherit the constructor of GraphNode.
        GraphNode.apply(this, arguments);

        this.star = [{x: 50, y: 50, z: 3}, {x: 600, y: 360, z: 4}, {x: 200, y: 70, z: 2}, {x: 300, y: 80, z: 5}, 
        {x: 400, y: 55, z: 4}, {x: 550, y: 100, z: 2}, {x: 700, y: 65, z: 3}, {x: 550, y: 50, z: 4}, 
        {x: 220, y: 440, z: 4}, {x: 110, y: 341, z: 3},
         {x: 40, y: 111, z: 5}, {x: 420, y: 241, z: 3}  , {x: 160, y: 210, z: 2} , {x: 600, y: 261, z: 4} ,
          {x: 400, y: 501, z: 3} , {x: 222, y: 221, z: 4}, {x: 700, y: 541, z: 5},  {x: 110, y: 531, z: 5}   ];
        // Override the local bounding box of this node.
        this.currentAlter = 0;
        this.localBoundingBox = {
            x: 0,
            y: 0,
            w: 800,
            h: 600
        };
    }

    // Inherit all other methods of GraphNode.
    _.extend(RootNode.prototype, GraphNode.prototype, {
        // TODO
        renderLocal: function(context){
            context.fillStyle = "#514F4F" ;
            context.fillRect(0, 0, 800, 600);
            
            for (var i = 0; i < 18; i++){
                    context.fillStyle = "yellow" ;
                    
                    context.beginPath();

                    var a = this.star[i].x;
                    var b = this.star[i].y;

                    if (this.currentAlter == 1){
                        var tem2 = b;
                        b = a;
                        a = tem2 ;
                        if ( a > 500){
                            a += 150;
                        } else if ( a > 200){
                            a += 80;
                        }

                    } else if (this.currentAlter == 2){
                        var cos = Math.cos(3.5);
                        var sin = Math.sin(3.5);
                        a = a - a  * cos + b * sin + 150;
                        b = a * sin - b * cos + 120;

                    } else if (this.currentAlter == 3){
                        var tem2 = b;
                        b = a;
                        a = tem2 ;

                        var cos = Math.cos(0.8);
                        var sin = Math.sin(1.0);
                        a=  a  * cos * 2;
                                                
                        b = b * sin ;
                    } else if (this.currentAlter == 4){
                        var tem2 = b;
                        b = a;
                        a = tem2 ;

                        var cos = Math.cos(0.5);
                        var sin = Math.sin(1.5);
                        a=  a  * cos * 2;
                                                
                        b = b * sin ;                   
                    }

                    context.arc( a, b,
                    this.star[i].z,0,2*Math.PI);

                    context.stroke();
                    context.fill();
                    }
        }
    });

    /**
     * SpaceshipNode, representing the whole spaceship.
     */
    var SpaceshipNode = function() {
        // Inherit the constructor of GraphNode.
        GraphNode.apply(this, arguments);

        // TODO

        // Override the local bounding box of this node. You might want to modify this.
        this.localBoundingBox = {
            x: -50,
            y: -50,
            w: 100,
            h: 100
        };
    }

    // Inherit all other methods of GraphNode.
    _.extend(SpaceshipNode.prototype, GraphNode.prototype, {
        // Override the renderLocal function to draw itself in its own coordinate system.
        renderLocal: function(context) {

        }
    });



    /**
     * HeadNode is the child of the spaceship node, representing the head of the spaceship.
     */
    var HeadNode = function() {
        // Inherit the constructor of GraphNode.
        GraphNode.apply(this, arguments);

        // TODO

        // Override the local bounding box of this node, you might want to modify this.
        this.localBoundingBox = {
            x: -30,
            y: -10,
            w: 30,
            h: 10
        };
    }

    // Inherit all other methods of GraphNode.
    _.extend(HeadNode.prototype, GraphNode.prototype, {
        // Override the renderLocal function to draw itself in its own coordinate system.
        renderLocal: function(context) {

            //TODO
            context.beginPath();
            context.moveTo(this.localBoundingBox.h, 0);
            context.lineTo(-20, 0);
            context.lineTo(-5, -20);
            context.closePath();
            context.fillStyle = "white";
            context.fill();
                       
        }
    });




    /**
     * TailNode is a child of the spaceship node, representing the tail of the spaceship.
     */
    var TailNode = function() {
        GraphNode.apply(this, arguments);
    }
    _.extend(TailNode.prototype, GraphNode.prototype, {
        renderLocal: function(context) {
            //TODO

            context.beginPath();
            context.moveTo(-5, 0);
            context.lineTo(-20, 20);
            context.lineTo(10, 20);
            context.closePath();
            context.fillStyle = "pink";
            context.fill();

           
        }
    });



    /**
     * FireNode is a child of the tail node, representing the fire at the end of the spaceship.
     */
    var FireNode = function() {
        GraphNode.apply(this, arguments);
    }
    _.extend(FireNode.prototype, GraphNode.prototype, {
        renderLocal: function(context) {
            //TODO
            context.fillStyle = "red";
            context.fillRect(-20, 0, 5, 30);
            context.fillRect(-7, 0, 5, 30);
            context.fillRect(5, 0, 5, 30);


        }
    });



    /**
     * BodyNode is a child of the spaceship node, representing the body of the spaceship.
     */ 
    var BodyNode = function() {
        GraphNode.apply(this, arguments);
        this.isInteractableWithMouse = true;
        this.localBoundingBox = {
            x: -30,
            y: -120,
            w: 30,
            h: 120
        };

    }
    _.extend(BodyNode.prototype, GraphNode.prototype, {
        renderLocal: function(context) {
            //TODO
            context.fillStyle = "#A9E4FD";
            context.fillRect(this.localBoundingBox.x, this.localBoundingBox.y , 30, this.localBoundingBox.h);

            
        }
    });



    /**
     * HandleNode is a child of the body node, representing the resizing handle of the spaceship.
     */ 
    var HandleNode = function() {
        GraphNode.apply(this, arguments);
        this.isInteractableWithMouse = true;
        this.localBoundingBox = {
            x: -30,
            y: -10,
            w: 30,
            h: 10
        };


    }
    _.extend(HandleNode.prototype, GraphNode.prototype, {
        renderLocal: function(context) {
            //TODO
            context.fillStyle = "black";
            context.fillRect(this.localBoundingBox.x, this.localBoundingBox.y, 30, this.localBoundingBox.h);

        }
    });


    // Return an object containing all of our classes and constants
    return {
        RootNode: RootNode,
        SpaceshipNode: SpaceshipNode,
        HeadNode: HeadNode,
        TailNode: TailNode,
        FireNode: FireNode,
        BodyNode: BodyNode,
        HandleNode: HandleNode,
    };
}