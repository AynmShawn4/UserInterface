'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    var appContainer = document.getElementById('app-container');
    var header = document.getElementById('header');

    // load toolbar ++
    var Toolbar = new viewModule.Toolbar();
    var ToolbarDiv = Toolbar.getElement();
    header.appendChild(ToolbarDiv);

    // Attach the file chooser to the page. You can choose to put this elsewhere, and style as desired
    var fileChooser = new viewModule.FileChooser();
    appContainer.appendChild(fileChooser.getElement());

    // ImageCollectionModel created here


    fileChooser.addListener(function(fileChooser, files, eventDate) {

        appContainer.innerText = "";
        appContainer.appendChild(fileChooser.getElement());

        // create image collection view
        var imageCollectionView = new viewModule.ImageCollectionView(Toolbar);
    


        var storedImageCollection = modelModule.loadImageCollectionModel();

        // set imagecollection model of view
        imageCollectionView.setImageCollectionModel(storedImageCollection);

        var imageModelArray = storedImageCollection.getImageModels();

        var arrayOfName = [];

        var arrayToRemove = [];

        _.each(
            imageModelArray,
            function(x){
                arrayOfName.push(x.getPath());
                arrayToRemove.push(0);
            });

        //add only different image models
        _.each(
            files,
            function(file) { 

                var index = arrayOfName.indexOf('images/' + file.name);
                if (index == -1){
                    var m = new modelModule.ImageModel('images/' + file.name,file.lastModifiedDate,'', 0);
                    storedImageCollection.addImageModel(m);

                } else {
                    arrayToRemove[index] = 1;
                }
            }
        );

        //remove imagemodels
        _.each(imageModelArray,function(x,i){
            if (arrayToRemove[i] == 0){

                storedImageCollection.removeImageModel(x);
            }
        });
         // set imagecollection model of view
        imageCollectionView.setImageCollectionModel(storedImageCollection);


        // attach collection view to app-container
        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);
        

        modelModule.storeImageCollectionModel(storedImageCollection);
    });

    function retrieve(){

        // Demo retrieval
        var storedImageCollection = modelModule.loadImageCollectionModel();

        // render image ++
    
        // create image collection view
        var imageCollectionV = new viewModule.ImageCollectionView(Toolbar);

        // set imagecollection model of view
        imageCollectionV.setImageCollectionModel(storedImageCollection);

        appContainer.innerText = "";
        appContainer.appendChild(fileChooser.getElement());
        return imageCollectionV;
    };
        
    var imageCollectionView = retrieve();

    var x = imageCollectionView.getElement();
    appContainer.appendChild(x);


    // click on grid view

    var gridView = document.getElementById("b1");
    gridView.addEventListener("click", function(){
    
        var imageCollectionView = retrieve();

        Toolbar.setToView('GRID_VIEW');

        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);

    } );

    //click on list view
    var listView = document.getElementById("b2");
    listView.addEventListener("click", function(){

        var imageCollectionView = retrieve();

        Toolbar.setToView('LIST_VIEW');

        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);

    } );

    //click on filter
    var starOne = document.getElementById("s1");
    starOne.addEventListener("click", function(){

        var imageCollectionView = retrieve();
        Toolbar.setRatingFilter(1);
        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);

    })
    //click on filter
    var starTwo = document.getElementById("s2");
    starTwo.addEventListener("click", function(){

        var imageCollectionView = retrieve();
        Toolbar.setRatingFilter(2);
        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);
    })

    //click on filter
    var starThr = document.getElementById("s3");
    starThr.addEventListener("click", function(){

        var imageCollectionView = retrieve();
        Toolbar.setRatingFilter(3);
        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);

    })
    //click on filter
    var starFor = document.getElementById("s4");
    starFor.addEventListener("click", function(){

        var imageCollectionView = retrieve();
        Toolbar.setRatingFilter(4);
        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);

    })

    //click on filter
    var starFiv = document.getElementById("s5");
    starFiv.addEventListener("click", function(){

        var imageCollectionView = retrieve();
        Toolbar.setRatingFilter(5);
        var x = imageCollectionView.getElement();
        appContainer.appendChild(x);

    })

});