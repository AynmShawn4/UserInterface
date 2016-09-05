'use strict';

var expect = chai.expect;

describe('Student Unit Tests', function() {
  describe('ImageModel', function() {

      var modelModule = createModelModule();

    var imageModel;
        beforeEach(function() {
          imageModel = new modelModule.ImageModel('images/eva.jpg', new Date(),'', 0);
        });

        afterEach(function() {
          imageModel = undefined;
        });
    
      it('should add and then remove a listener correctly.', function() {
        var listener_fn = sinon.spy();
        var addListenerSpy = sinon.spy(imageModel, "addListener");
        var removeListenerSpy = sinon.spy(imageModel, "removeListener");


        // Adds a listener
        imageModel.addListener(listener_fn);

        expect(addListenerSpy.calledWith(listener_fn), 'addListener should have been called with listener_fn.').to.be.true;
        expect(addListenerSpy.calledOnce, 'addListener should have been called once.').to.be.true;
        expect(imageModel.listeners.length, 'listeners.length should be one.').to.be.equal(1);

        // Removes a listener
        imageModel.removeListener(listener_fn);

        expect(removeListenerSpy.calledWith(listener_fn), 'removeListener should have been called with listener_fn.').to.be.true;
        expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
        expect(imageModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

        imageModel.removeListener(listener_fn);
        expect(imageModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);
      });

    it('should notify every listener when the current rating changed.', function() {
        var listener_fn_1 = sinon.spy();
        var listener_fn_2 = sinon.spy();
        imageModel.addListener(listener_fn_1);
        imageModel.addListener(listener_fn_2);

        imageModel.setRating(0);
        imageModel.setRating(1);
      expect(imageModel.getRating(), 'rating of current model should be zero.').to.be.equal(1); 
      expect(listener_fn_1.calledOnce, 'listener one should have been called once').to.be.equal(true);
      expect(listener_fn_2.calledOnce, 'listener two should have been called once').to.be.equal(true);

        imageModel.setRating(3);
      expect(listener_fn_1.calledTwice, 'listener one should have been called once').to.be.equal(true);
      expect(listener_fn_2.calledTwice, 'listener two should have been called once').to.be.equal(true);
      var currentRate = imageModel.getRating();
      expect(currentRate, "After assigning rate 3, current rating should  be 3").to.be.equal(3);

      });


  });

  describe("ImageCollectionModel", function(){
    var modelModule = createModelModule();

    var ImageCollectionModel;
        beforeEach(function() {
          ImageCollectionModel = new modelModule.ImageCollectionModel();
        });

        afterEach(function() {
          ImageCollectionModel = undefined;
        });

    var imageModel, imageModel1;
        beforeEach(function() {
          imageModel = new modelModule.ImageModel('images/eva.jpg', new Date(),'', 0);
          imageModel1 = new modelModule.ImageModel('images/aaa.jpg', new Date(),'', 0);

        });

        afterEach(function() {
          imageModel = undefined;
          imageModel1 = undefined;

        });

        it('should add and then remove a listener correctly .', function() {
        var listener_fn = sinon.spy();
        var addListenerSpy = sinon.spy(ImageCollectionModel, "addListener");
        var removeListenerSpy = sinon.spy(ImageCollectionModel, "removeListener");


        // Adds a listener
        ImageCollectionModel.addListener(listener_fn);

        expect(addListenerSpy.calledWith(listener_fn), 'addListener should have been called with listener_fn.').to.be.true;
        expect(addListenerSpy.calledOnce, 'addListener should have been called once.').to.be.true;
        expect(ImageCollectionModel.listeners.length, 'listeners.length should be one.').to.be.equal(1);

        // Removes a listener
        ImageCollectionModel.removeListener(listener_fn);

        expect(removeListenerSpy.calledWith(listener_fn), 'removeListener should have been called with listener_fn.').to.be.true;
        expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
        expect(ImageCollectionModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

        ImageCollectionModel.removeListener(listener_fn);
        expect(ImageCollectionModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);
      });
  
    it('should notify every listener when adding or deleting new image .', function(){
      var listener_fn_1 = sinon.spy();
          var listener_fn_2 = sinon.spy();
          ImageCollectionModel.addListener(listener_fn_1);
          ImageCollectionModel.addListener(listener_fn_2);

          var AddImageSpy = sinon.spy(ImageCollectionModel, "addImageModel");
          var removeImageSpy = sinon.spy(ImageCollectionModel, "removeImageModel");

          ImageCollectionModel.addImageModel(imageModel);
          ImageCollectionModel.addImageModel(imageModel1);

          expect(ImageCollectionModel.getImageModels().length, 'when adding two iamge models, there should be two in array').to.be.equal(2);
          expect(listener_fn_1.calledTwice, 'listener one should have been called once').to.be.equal(true);
        expect(listener_fn_2.calledTwice, 'listener two should have been called once').to.be.equal(true);

        ImageCollectionModel.removeImageModel(imageModel);

          expect(ImageCollectionModel.getImageModels().length, 'when removing one iamge models, there should be two in array').to.be.equal(1);
          expect(listener_fn_1.calledThrice, 'listener one should have been called once').to.be.equal(true);
        expect(listener_fn_2.calledThrice, 'listener two should have been called once').to.be.equal(true);

    });
  
    it('after deleting image, its listeners of image should not be called', function(){
         var listener_fn_1 = sinon.spy();
        ImageCollectionModel.addImageModel(imageModel);
        imageModel.addListener(listener_fn_1);
        ImageCollectionModel.removeImageModel(imageModel);
        imageModel.setRating(5);
        expect(listener_fn_1.calledOnce, 
          'listener_fn should have been called exactly once').to.be.false;


    });
    

  });
});
