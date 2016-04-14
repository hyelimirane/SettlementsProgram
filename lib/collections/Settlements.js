/**
 * Created by hyelim on 2016. 3. 29..
 */
Settlements = new Mongo.Collection('settlements');

Settlements.allow({
    update: function(userId, settlement) { return ownsDocument(userId, settlement); },
    remove: function(userId, settlement) { return ownsDocument(userId, settlement); }
});

Settlements .deny({
    update: function(userId, settlement, fieldNames){
        // may only edit the following two fields:
        return (_.without(fieldNames, 'dateOrdered', 'dateSettlement', 'category', 'orderSummary', 'orderPrice', 'purchaser').length > 0);
    }
});

// settlementSubmit 오류 검사
validateSettlement = function(settlement){
    var errors = {};
    if(!settlement.dateOrdered)
        errors.dateOrdered = "Please select in a dateOrdered.";
    if(!settlement.dateSettlement)
        errors.dateSettlement = "Please select dateSettlement.";
    if(!settlement.category)
        errors.category = "Please category.";
    if(!settlement.orderSummary)
        errors.orderSummary = "Please fill in a orderSummary.";
    if(!settlement.orderPrice)
        errors.orderPrice = "Please fill in a orderPrice.";
    if(!settlement.attachReceipt)
        errors.attachReceipt = "Please fill in a attachReceipt.";
    if(!settlement.purchaser)
        errors.purchaser = "Please select in a purchaser.";
    return errors;
};

Meteor.methods({

    settlementInsert : function(settlementAttributes){
        check(Meteor.userId(), String);
        check(settlementAttributes, {
            dateOrdered : String,
            dateSettlement : String,
            category : [Object],
            orderSummary: String,
            orderPrice: String,
            attachReceipt: String,
            purchaser: [Object],
            settlementCompleted: Boolean
        });

        var errors = validateSettlement(settlementAttributes);
        if(errors.dateOrdered || errors.dateSettlement || errors.category || errors.purchaser || errors.orderSummary || errors.orderPrice || errors.attachReceipt)
            throw new Meteor.Error('invalid-settlement', "You must set fields.");

        var user = Meteor.user();
        // ._extend는 underscore라이브러리 메소드 단순히 하나의 객체에 속성을 추가하여 확장하는 기능 제공
        var settlement = _.extend(settlementAttributes, {
            regId : user._id,
            regName : user.username,
            submitted : new Date(),
            commentsCount: 0
        });

        var settlementId = Settlements.insert(settlement);

        return {
            _id : settlementId
        };
    },

    settlementsSelect : function(findOptions){
        check(findOptions, {
            dateSettlement : String,
            category : Match.Any,
        });

        // findOptions 적용안됨

        return Settlements.find({}, findOptions).fetch();
    },

    settlementCompletedUpdate : function(id){
        check(id, String);

        var a = Settlements.update({_id: id}, {$set:{settlementCompleted : true}});

        return {_id : a};
    },

    settlementRemove : function(id){
        check(id, String);

        var a = Settlements.remove(id);

        return {data : a};
    }
});