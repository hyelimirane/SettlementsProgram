/**
 * Created by hyelim on 2016. 3. 29..
 */
Template.settlementSubmit.create = function(){
    Session.set('settlementSubmitErrors', {});
};

// onRendered : template이 DOM에 추가될 때 호출되는 변수?를 등록
Template.settlementSubmit.onRendered(function() {
    this.$('#date1').datetimepicker({
        format: 'YYYY-MM-DD'
    });

    this.$('#date2').datetimepicker({
        format: 'YYYY-MM-05'
    });
});

Template.settlementSubmit.events({
    'submit form' : function(e){
        e.preventDefault();

        var categoryOptions = [];
        categoryOptions.push({value:$(e.target).find('[name=category]').val(), text:$(e.target).find('[name=category] :selected').text(), selected:'selected'});
        $(e.target).find('[name=category] option').each(function(){
            if(categoryOptions[0].value != this.value) {
                categoryOptions.push({value: this.value, text: this.text, selected: ''});
            }
        });

        var purchaserOptions = [];
        purchaserOptions.push({value:$(e.target).find('[name=purchaser]').val(), text:$(e.target).find('[name=purchaser] :selected').text(), selected:'selected'});
        $(e.target).find('[name=purchaser] option').each(function(){
            if(purchaserOptions[0].value !== this.value){
                purchaserOptions.push({value: this.value, text: this.text, selected: ''});
            }
        });

        //categoryOptions = JSON.stringify(categoryOptions).replace(/\\/g, "");
        //purchaserOptions = JSON.stringify(purchaserOptions).replace(/\\/g, "");

        // 브라우저가 폼의 submit을 그대로 진행하지 않도록 차단단
        var settlement = {
            dateOrdered : $(e.target).find('[name=dateOrdered]').val(),
            dateSettlement : $(e.target).find('[name=dateSettlement]').val(),
            category : categoryOptions,
            orderSummary : $(e.target).find('[name=orderSummary]').val(),
            orderPrice : $(e.target).find('[name=orderPrice]').val(),
            //attachReceipt : $(e.target).find('[name=attachReceipt]').val(),
            purchaser : purchaserOptions,
            settlementCompleted : false
        };

        var file = $('#attachReceipt').get(0).files[0];
        Images.insert(file, function (err, fileObj) {
            if (err){
                // handle error
            } else {
                // handle success depending what you need to do
                settlement.attachReceipt = fileObj._id;

                Meteor.call('settlementInsert', settlement, function(error, result){

                    // display the error to the user and abort
                    if(error)
                        return throwError(error.reason);

                    Router.go('settlementsList');
                });
            }
        });
    }
});