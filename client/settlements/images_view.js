/**
 * Created by hyelim on 2016. 4. 5..
 */
Template.imageView.helpers({
    images: function () {
        debugger;
        return Images.find(); // Where Images is an FS.Collection instance
    }
});