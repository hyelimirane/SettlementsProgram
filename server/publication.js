/**
 * Created by hyelim on 2016. 3. 29..
 */
Meteor.publish('settlements', function(options){
    check(options, Object);
    return Settlements.find({}, options);
});

Meteor.publish('purchasersList', function(){
   return Purchasers.find();
});

Meteor.publish('receipt', function(option){
    return Images.find({}, option);
});
