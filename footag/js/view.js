'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        // TODO
        this.currentView = GRID_VIEW;
        this.model = imageModel;

        var discription = document.createElement('div');
        discription.className = "disGrid";
        discription.id = "discription";
        discription.innerHTML = (imageModel.path).replace('images/','') + "<br>" + 
        (JSON.stringify(imageModel.modificationDate)).slice(1,11) ;
        var b1 = document.createElement('button');
        var b2 = document.createElement('button');
        var b3 = document.createElement('button');
        var b4 = document.createElement('button');
        var b5 = document.createElement('button');

        var rate = this.model.getRating();
        b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";
            if (rate == 1){
                b1.innerHTML = "&#9733";
            } else if (rate == 2){
                b1.innerHTML = b2.innerHTML = "&#9733";

            } else if (rate == 3){
                b1.innerHTML = b2.innerHTML = b3.innerHTML = "&#9733";
            } else if (rate == 4){
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = "&#9733";
            } else if (rate == 5){
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9733";

            }

        b1.className = "special";
        b1.style.outline = b2.style.outline = b3.style.outline = b4.style.outline = b5.style.outline = 0;
        b1.style.background = b2.style.background = b3.style.background = b4.style.background =
        b5.style.background = "none"; 
        b1.style.border = b2.style.border = b3.style.border = b4.style.border = b5.style.border = "none";
        b1.style.fontSize = b2.style.fontSize = b3.style.fontSize = 
        b4.style.fontSize = b5.style.fontSize = "25px";
        b1.style.color = b2.style.color = b3.style.color = b4.style.color = b5.style.color = "#FA9646";
        b1.style.padding = b2.style.padding = b3.style.padding =  b4.style.padding = 
        b5.style.padding = "0px 0px 0px 0px";


        discription.appendChild(b1);
        discription.appendChild(b2);
        discription.appendChild(b3);
        discription.appendChild(b4);
        discription.appendChild(b5);

        this.imageRendererDiv = document.createElement('div');

        if ( this.currentView == GRID_VIEW){
                this.imageRendererDiv.className = "DivGrid";
        } else {
                this.imageRendererDiv.className = "DivList";
        }
        var imageRendererTemplate = document.getElementById('image-renderer');
        this.imageRendererDiv.appendChild(document.importNode(imageRendererTemplate.content, true));
        this.imageRendererDiv.appendChild(discription);
        var ImageToRender = this.imageRendererDiv.querySelector('.image');
        ImageToRender.src = imageModel.path;
        ImageToRender.classList.add('RenderGrid');
        
        
        this.enlarged = 0;

         this.model.addListener(function(IM, date){
             this.model = IM;
         });

        var txt = document.createElement("textarea");
        txt.innerHTML = "&#9734";
        var white = txt.value;
        txt.innerHTML = "&#9733";
        var black = txt.value;

        var IM = this.model;

        b1.addEventListener('click',function(){

            if (IM.getRating() == 1) {
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";
                IM.setRating(0);
            } else {
                b1.innerHTML = "&#9733";

                b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";
                IM.setRating(1);
            }
            //notify change

        });

        b2.addEventListener('click',function(){

             if (IM.getRating() == 2) {
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";
                IM.setRating(0);

            } else {
                b1.innerHTML = b2.innerHTML = "&#9733";
                b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";   
                IM.setRating(2);
            }
            // do notify;
        });
        b3.addEventListener('click',function(){
            if (IM.getRating() == 3) {
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";
                IM.setRating(0);

            } else {
                b1.innerHTML = b2.innerHTML = b3.innerHTML = "&#9733";
                b4.innerHTML = b5.innerHTML = "&#9734";
                IM.setRating(3);
            }
            // do notify;
        });
        b4.addEventListener('click',function(){
            if (IM.getRating() == 4) {
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";
                IM.setRating(0); 
            } else {
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = "&#9733";
                b5.innerHTML = "&#9734";
                IM.setRating(4);
            } 
            // do notify;
        });
        b5.addEventListener('click',function(){
            if ( b5.innerHTML == white){
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9733";
                IM.setRating(5);
            } else {
                b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";

                IM.setRating(0);

            }
            // do notify;
        });


           
    };

    _.extend(ImageRenderer.prototype, {


        getImageDiv: function(){
            var ImageToRender = this.imageRendererDiv.querySelector('.image');
            return ImageToRender;

        },


        enlargeView: function(){
            var ImageToRender = this.imageRendererDiv.querySelector('.image');

            if (this.enlarged == 0){
                this.imageRendererDiv.className = 'enlarge';
                if (this.currentView == LIST_VIEW){
                    ImageToRender.classList.remove('RenderList');
                    ImageToRender.classList.add('enlargeImg');

                } else {
                    ImageToRender.classList.remove('RenderGrid');
                    ImageToRender.classList.add('enlargeImg');
                }


                this.enlarged = 1;
            } else {
                if (this.currentView == LIST_VIEW){
                    this.imageRendererDiv.className = "DivList";
                    ImageToRender.classList.remove('enlargeImg');
                    ImageToRender.classList.add('RenderList');


                } else {
                    this.imageRendererDiv.className = "DivGrid";
                    ImageToRender.classList.remove('enlargeImg');
                    ImageToRender.classList.add('RenderGrid');

                }
                
                this.enlarged = 0;
            }
        },
        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            // TODO
            return this.imageRendererDiv;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            // TODO
            return this.model;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            // TODO

            this.model = imageModel;
            this.ImageToRender.src = imageModel.pathToFile;
            this.ImageToRender.width = "200";
            this.ImageToRender.height = "200";
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            if (this.currentView != viewType){
                if (viewType == LIST_VIEW){
                    this.currentView = LIST_VIEW;
                    this.imageRendererDiv.className = "DivList";
                    var breakpoint = this.imageRendererDiv.querySelector('.special');
                    var ImageToRender = this.imageRendererDiv.querySelector('.image');
                    var para = this.imageRendererDiv.querySelector('.disGrid');


                    var textnode = document.createElement("br");
                    textnode.className = "breaking";
                    breakpoint.parentNode.insertBefore(textnode, breakpoint);
        
                    ImageToRender.classList.remove('RenderGrid');
                    ImageToRender.classList.add('RenderList');
                   

                    para.setAttribute('class','disList'); 
                

                } else if (viewType == GRID_VIEW){
                    this.currentView = GRID_VIEW;

                    this.imageRendererDiv.className = "DivGrid";
                    this.imageRendererDiv.querySelector('.breaking').remove();
                
                    var ImageToRender = this.imageRendererDiv.querySelector('.image');
                    var para = this.imageRendererDiv.querySelector('.disList');

                    ImageToRender.classList.remove('RenderList');
                    ImageToRender.classList.add('RenderGrid');
                    
                    para.setAttribute('class', 'disGrid');


                }
            }

        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.currentView;
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            // TODO
            var IR = new ImageRenderer(imageModel);
            return IR;
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function(toolbar) {
        // TODO
        this.currentView = toolbar.getCurrentView();
        this.rating = toolbar.getCurrentRatingFilter();
        this.currentlyEnlarged = null;
        var self = this;


        toolbar.addListener(function(TB, eventType, eventDate){
            if ((eventType == LIST_VIEW) || ( eventType == GRID_VIEW) ){
                self.setToView(eventType);
            } else {
                self.rating = eventType;

            }
        });
        this.IRObject = []; //added
        this.Cmodel;
        this.currentFactory = new ImageRendererFactory();
        this.imageCollectionDiv = document.createElement('div');
        var imageCollectionTemplate = document.getElementById('image-collection');
        this.imageCollectionDiv.appendChild(document.importNode(imageCollectionTemplate.content, true));
    };

    _.extend(ImageCollectionView.prototype, {
        
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            // TODO
            var self = this;
            var j = 0;

            var total = [];

            var s0 = [];
            var s1 = [];
            var s2 = [];
            var s3 = [];
            var s4 = [];
            var s5 = [];

            total.push(s0); total.push(s1); total.push(s2);
            total.push(s3); total.push(s4); total.push(s5);

            _.each(self.IRObject,
                function(f){
                    if (f.getImageModel().getRating() >= self.rating){
                        j = j + 1;

                        total[f.getImageModel().getRating()].push(f);
                    }
                });
            _.each(total,
                function(x,i){
                        for (var k = 0; k < x.length;k++){
                            if (x[k].getImageModel().getRating() >= self.rating){
                                self.imageCollectionDiv.appendChild(x[k].getElement());
                            }
                        }
                    
                });
            if (j == 0){
                var OppsDiv = document.createElement('div');
                OppsDiv.id = "opps";
                OppsDiv.innerHTML = 
                "Oops, there is no image that satisfies your requirment right now!!!Or this is no image at all.";
                OppsDiv.style.fontSize = "40px";
                OppsDiv.style.color = "#F63131";
                OppsDiv.style.textAlign = "center";
                OppsDiv.style.border = "10px dashed #FA9646";
                OppsDiv.style.marginTop = "40px";
                OppsDiv.style.marginBottom = "80px";
                OppsDiv.style.marginLeft = " 100px";
                OppsDiv.style.marginRight = " 100px";
                OppsDiv.style.paddingTop = " 100px";
                OppsDiv.style.paddingBottom = " 100px";
                self.imageCollectionDiv.appendChild(OppsDiv);
            }
            
            return self.imageCollectionDiv;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            // TODO
            return this.currentFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            // TODO
            this.currentFactory = imageRendererFactory;
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            // TODO
            return this.Cmodel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            // TODO

            this.Cmodel = imageCollectionModel;
            this.IRObject = [];
            var self = this;

            self.Cmodel.addListener(function(eventType, imageModelCollection, imageModel, eventDate){
                if (eventType == 'IMAGE_ADDED_TO_COLLECTION_EVENT'){
                    self.Cmodel = imageModelCollection;

                    var ImageRender = self.currentFactory.createImageRenderer(imageModel);
                    ImageRender.setToView(self.currentView);
                    self.IRObject.push(ImageRender);   
                } else if (eventType == 'IMAGE_REMOVED_FROM_COLLECTION_EVENT'){
                    self.Cmodel = imageModelCollection;

                    _.each(
                        self.IRObject,
                        function(x){
                            if (x.getImageModel() == imageModel){
                                self.IRObject =  _.without(self.IRObject, x);
                            }
                        })

                }
            });


            _.each(
                self.Cmodel.getImageModels(),
                function(f){

                    var ImageRender = self.currentFactory.createImageRenderer(f);

                    ImageRender.setToView(self.currentView);

                    ImageRender.getImageDiv().addEventListener('click',function(){
                        if (self.currentlyEnlarged == ImageRender){
                            ImageRender.enlargeView();
                            self.currentlyEnlarged = null;
                        } else if (self.currentlyEnlarged == null){
                            self.currentlyEnlarged = ImageRender;
                            ImageRender.enlargeView();
                        } else {

                            var index;
                             _.each(
                                self.IRObject, function(f,i){
                                    if (f.getImageModel().getPath() == self.currentlyEnlarged.getImageModel().getPath() ){
                                        index = i;

                                }
                            });
                            self.IRObject[index].enlargeView();
                            self.currentlyEnlarged = ImageRender;
                            self.currentlyEnlarged.enlargeView();
                        }
                    });


                    self.IRObject.push(ImageRender);
                }
            );   
            
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            // TODO
            if (this.currentView != viewType){
                if (viewType == LIST_VIEW){
                    this.currentView = LIST_VIEW;
                } else {
                    this.currentView = GRID_VIEW;
                }
                _.each(this.IRObject,function(x){
                    x.setToView(viewType);

                });

            }

        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            // TODO
            return this.currentView;
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.listeners = [];
        this.currentView = GRID_VIEW;
        this.currentRating = 0;

        var nav = document.createElement('div');
        nav.className = "nav";
        var nav_left = document.createElement('div');
        nav_left.className = "nav-left";
        var nav_right = document.createElement('div');
        nav_right.className = "nav-right"
        var but1 = document.createElement('button');
        var but2 = document.createElement('button');

        but1.className = "navBut";
        but1.id = "b1";
        but2.className = "navBut";
        but2.id = "b2";
        var f = document.createElement('p');
        f.className = "headerFont";
        f.innerHTML = "Fotag!";
        but1.innerHTML =   "&#9634 &#9634<br>&#9634 &#9634";
        but2.innerHTML = "&#9634 =<br>&#9634 = ";

        nav_left.appendChild(but1);
        nav_left.appendChild(but2);
        nav.appendChild(nav_left);

        var rightDiv = document.createElement('div');
        rightDiv.className = "rD";
        rightDiv.innerHTML = "filter by:";
        var b1 = document.createElement('button');
        var b2 = document.createElement('button');
        var b3 = document.createElement('button');
        var b4 = document.createElement('button');
        var b5 = document.createElement('button');

        b1.className = b2.className = b3.className = b4.className = b5.className = "star";
        b1.innerHTML = b2.innerHTML = b3.innerHTML = b4.innerHTML = b5.innerHTML = "&#9734";
        b1.id = "s1"; b2.id = "s2"; b3.id = "s3"; b4.id = "s4"; b5.id = "s5";

        nav_right.appendChild(f);

        rightDiv.appendChild(b1);
        rightDiv.appendChild(b2);
        rightDiv.appendChild(b3);
        rightDiv.appendChild(b4);
        rightDiv.appendChild(b5);

        nav_right.appendChild(rightDiv);

        nav.appendChild(nav_right);
        this.ToolbarDiv = nav;
        var ToolbarTemplate = document.getElementById('toolbar');
        this.ToolbarDiv.appendChild(document.importNode(ToolbarTemplate.content, true));
        var but1 = this.ToolbarDiv.querySelector('.navBut');
        but1.style.backgroundColor = "#E3D6C6";
        but1.style.outline = 0;
        but2.style.outline = 0;




    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            // TODO
            return this.ToolbarDiv;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            // TODO
             if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            // TODO
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            if (this.currentView == viewType){
            } else {
                this.currentView = viewType;

                var x = document.getElementById('b1');
                var y = document.getElementById('b2')

                if (viewType == GRID_VIEW){
                    x.style.backgroundColor = "#E3D6C6";
                    y.style.backgroundColor = "white";
                } else if (viewType == LIST_VIEW) {

                    x.style.backgroundColor = "white";
                    y.style.backgroundColor = "#E3D6C6";
                }

                var self = this;
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, viewType, Date.now());
                    }
                );

            } 
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.currentView;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.currentRating;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            // TODO
            var s1 = document.getElementById("s1");
            var s2 = document.getElementById("s2");
            var s3 = document.getElementById("s3");
            var s4 = document.getElementById("s4");
            var s5 = document.getElementById("s5");

            if (this.currentRating == rating){

                s1.innerHTML = s2.innerHTML = s3.innerHTML = s4.innerHTML = s5.innerHTML = "&#9734";
                this.currentRating = rating = 0;

            } else {
                this.currentRating = rating;

                s1.innerHTML = s2.innerHTML = s3.innerHTML = s4.innerHTML = s5.innerHTML = "&#9734";

                switch(rating){
                case 1:
                    
                    s1.innerHTML = "&#9733";
                    break;
                case 2:
                    s1.innerHTML = s2.innerHTML = "&#9733";
                    break;
                case 3:
                    s1.innerHTML = s2.innerHTML = s3.innerHTML = "&#9733";
                    break;
                case 4:
                    s1.innerHTML = s2.innerHTML = s3.innerHTML = s4.innerHTML = "&#9733";
                    break;
                case 5:
                    s1.innerHTML = s2.innerHTML = s3.innerHTML = 
                    s4.innerHTML = s5.innerHTML = "&#9733";
                    break;
                }
            }
            var self = this;
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, rating, Date.now());
                    }
                );

        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}