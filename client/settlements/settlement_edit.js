/**
 * Created by hyelim on 2016. 4. 12..
 */
Template.settlementEdit.onRendered(function() {
    this.$('#date1').datetimepicker({
        format: 'YYYY-MM-DD'
    });

    this.$('#date2').datetimepicker({
        format: 'YYYY-MM-05'
    });

    $("#date1").on("dp.change", function (e) {
        console.log('aaaaa');
        var minDate = new Date(e.date);

        var day = Number(minDate.getDate());

        console.log('day :: ' + day);
        if(day <= 4){
            console.log('e.date :: ' + e.date);
            $('#date2').data("DateTimePicker").minDate(e.date);
        }
        else{
            console.log('mindate :: ' + minDate);
            minDate = new Date(minDate.setMonth(minDate.getMonth() + 1));

            console.log('mindate2 :: ' + minDate);
            $('#date2').data("DateTimePicker").minDate(minDate);
        }
    });
});

Template.settlementEdit.helpers({
    dateOrdered : function(){
        return this.settlementSelected[0].dateOrdered;
    },
    dateSettlement : function(){
        return this.settlementSelected[0].dateSettlement;
    },
    categoryOptions: function(){
        var category = this.settlementSelected[0].category;
        var options = '';
        for(var i=0; i<category.length; i++){
            if(category[i].selected === 'selected'){
                options += '<option value=\'' + category[i].value + '\' selected=\'' + category[i].selected + '\' >' + category[i].text + '</option>';
            }else{
                options += '<option value=\'' + category[i].value + '\' >' + category[i].text + '</option>';
            }
        }
        return Spacebars.SafeString(options);
    },
    purchaserOptions: function(){
        var purchaser = this.settlementSelected[0].purchaser;
        var options = '';
        for(var i=0; i<purchaser.length; i++){
            if(purchaser[i].selected === 'selected'){
                options += '<option value=\'' + purchaser[i].value + '\' selected=\'' + purchaser[i].selected + '\' >' + purchaser[i].text + '</option>';
            }else{
                options += '<option value=\'' + purchaser[i].value + '\' >' + purchaser[i].text + '</option>';
            }
        }
        return Spacebars.SafeString(options);
    },
    purchasersList : function(){
        return this.settlementSelected[0].communalPurchaser;
    },
    orderSummary: function(){
        return this.settlementSelected[0].orderSummary;
    },
    orderPrice: function(){
        return this.settlementSelected[0].orderPrice;
    },
    receipt : function(){
        return Images.findOne({_id: this.settlementSelected[0].attachReceipt});
    },
});

Template.settlementEdit.events({

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

        var count = function(){
            var cnt = 0;
            $(e.target).find('[name=communalPurchaser]').each(function(){
                if(this.checked) { cnt++; }
            });
            return cnt;
        };

        var total = Number($(e.target).find('[name=orderPrice]').val());

        var communalPurchaserChecked =[];
        $(e.target).find('[name=communalPurchaser]').each(function(){
            debugger;
            communalPurchaserChecked.push({value: this.value, text:this.attributes.text.value, checked :this.checked, sharePrice: total/count()})
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
            communalPurchaser : communalPurchaserChecked,
            settlementCompleted : false
        };

        var file = $('#attachReceipt').get(0).files[0];

        if(file === undefined){

            settlement.attachReceipt = $(e.target).find('[name=receiptID]').val();
            debugger;

            Meteor.call('settlementRemove', this._id, function(error, result){
                if(error){
                    return throwErrow(error.reason);
                }else{
                    Meteor.call('settlementInsert', settlement, function(error, result){

                        // display the error to the user and abort
                        if(error) {
                            return throwError(error.reason);
                        }else{
                            Router.go('settlementsList');
                        }
                    });
                }
            });
        }
        else{
            Meteor.call('settlementRemove', this._id, function(error, result){
                if(error){
                    return throwErrow(error.reason);
                }
                else{
                    Images.insert(file, function (err, fileObj) {
                        if (err){
                            // handle error
                        } else {
                            // handle success depending what you need to do
                            settlement.attachReceipt = fileObj._id;
                            debugger;

                            Meteor.call('settlementInsert', settlement, function(error, result){

                                // display the error to the user and abort
                                if(error) {
                                    return throwError(error.reason);
                                }else{
                                    Router.go('settlementsList');
                                }
                            });
                        }
                    });
                }
            });
        }
    }
});