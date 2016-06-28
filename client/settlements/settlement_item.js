/**
 * Created by hyelim on 2016. 3. 30..
 */

Template.settlementItem.onRendered(function() {
    showNakami = function(id) {
        this.$('#nakami_' + id).attr('style', 'display:""');
    };

    hideNakami = function(id){
        this.$('#nakami_' + id).attr('style', 'display:none');
    }
});

Template.settlementItem.helpers({
    ownPost : function(){
        var isOwn = false;
        if(this.regId === Meteor.userId()){
            isOwn = true;
        }
        //console.log(this.userId + " :: isOwn :: " + isOwn)
        return isOwn;
    },

    expired : function(){
        var sDate = new Date(this.dateSettlement);
        var toDate = new Date();
        toDate.setDate(5);

        if(sDate.getTime() < toDate.getTime()){
            return true;
        }
        else{
            return false;
        }
    },

    category : function(){
        return this.category[0].text;
    },

    purchaser : function(){
        return this.purchaser[0].text;
    },

    communalPurchaser : function(){
        return this.communalPurchaser;
    },

    orderPrice : function() {
        return numberWithCommas(this.orderPrice);
    },

    receipt : function(){
        return Images.findOne({_id: this.attachReceipt});
    },

    settlementCompleted : function(){
        var isSC = '미정산';
        if(this.settlementCompleted){
            isSC = '완료';
        }

        return isSC;
    },

    showSCBtn : function(){
        var showSCBtn = true;
        if(this.settlementCompleted){
            showSCBtn = false;
        }

        return showSCBtn;
    }
});

Template.settlementItem.events({

    'click .showNakami': function(e){
        e.preventDefault();
        var isDisplay = $('#nakami_'+this._id).attr('style');
        if(isDisplay.indexOf('display:none') != -1) {
            isShow = false;
        }else{
            isShow = true;
        }

        if(!isShow){
            showNakami(this._id);
        }else{
            hideNakami(this._id);
        }
    },

    'click #scBtn' : function(e){
        e.preventDefault();

        Meteor.call('settlementCompletedUpdate', this._id, function(error, result){

            if(error) {
                console.log('error!');
                return throwError(error.reason);
            }else{
                alert('Changed state!');

            }
        });
    },

    'click #delSettlement' : function(e){
        e.preventDefault();

        if(confirm('삭제하시겠습니까?')){
            Meteor.call('settlementRemove', this._id, function(error, result){

                if(error) {
                    console.log('error!');
                    return throwError(error.reason);
                }else{
                    alert('삭제 되었습니다!');

                }
            });
        }
    },
});

Template.communalPurchasers.helpers({
    sharePrice : function() {
        return numberWithCommas(this.sharePrice);
    }
});