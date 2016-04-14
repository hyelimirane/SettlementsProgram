/**
 * Created by hyelim on 2016. 3. 5..
 */
Template.errors.helpers({
    errors: function(){
        return Errors.find();
    }
});

// Errors collection에서 error 지우기.
// rendered 콜백은 템플릿이 브라우저에 렌더링 된 후에 한 번 구동.
Template.error.rendered = function(){
    var error = this.data;
    Meteor.setTimeout(function(){
       Errors.remove(error._id);
    }, 3000);
};