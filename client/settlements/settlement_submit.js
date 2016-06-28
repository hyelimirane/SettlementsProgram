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

    $("#date1").on("dp.change", function (e) {
        var minDate1 = new Date(e.date);
        var date2 = Number($('#date2 input').val().substr(5, 2)) -1;

        var day = Number(minDate1.getDate());
        var month =  Number(minDate1.getMonth());
        if(month < date2){
            $('#date2').data("DateTimePicker").minDate(minDate1);
        }
        else if(month == date2 && day <= 4){
            $('#date2').data("DateTimePicker").minDate(minDate1);
        }
        else{
            minDate1 = new Date(minDate1.setMonth(minDate1.getMonth() + 1));
            $('#date2').data("DateTimePicker").minDate(minDate1);
        }
    });
});

//Template.settlementSubmit.helpers({
//    errorMessage: function(field) {
//        return Session.get('settlementSubmitErrors')[field];
//    },
//    errorClass: function (field) {
//        return !!Session.get('settlementSubmitErrors')[field] ? 'has-error' : '';
//    }
//});

Template.settlementSubmit.events({

    'click .form-inline .checkbox-inline' : function(e){
        //e.preventDefault();
        if(e.target.checked){
            console.log('checked');
            $(e.target.parentElement.parentElement).find('input')[1].value = '';
            $(e.target.parentElement.parentElement).find('input')[1].readOnly = false;
            //$(e.target.parentElement.parentElement.parentElement).find('input')[1].checked = true;
        }
        else {
            console.log('unchecked');
            $(e.target.parentElement.parentElement).find('input')[1].value = 0;
            $(e.target.parentElement.parentElement).find('input')[1].readOnly = true;
            //$(e.target.parentElement.parentElement.parentElement).find('input')[1].checked = false;
        }
    },

    'submit form' : function(e){
        // 브라우저가 폼의 submit을 그대로 진행하지 않도록 차단함.
        e.preventDefault();

        // 공동구매자 인원수
        var count = function(){
            var cnt = 0;
            $(e.target).find('[name=communalPurchaser]').each(function(){
                if(this.checked) { cnt++; }
            });
            return cnt;
        };

        var date1 = $(e.target).find('[name=dateOrdered]').val();
        var date2 = $(e.target).find('[name=dateSettlement]').val();
        var orderSummary = $(e.target).find('[name=orderSummary]').val();
        var orderPrice = $(e.target).find('[name=orderPrice]').val();
        var communalPurchaser = count();
        var file = $('#attachReceipt').get(0).files[0];

        if(date1 ===''){
            alert("구매일을 확인 해 주세요.");
            $("#dateOrdered").focus();
            return false;
        }

        if(date2 === ''){
            alert("정산일을 확인 해 주세요.");
            $("#dateSettlement").focus();
            return false;
        }

        if(orderSummary === ''){
            alert("구매내역을 확인 해 주세요.");
            $("#orderSummary").focus();
            return false;
        }

        if(orderPrice === ''){
            alert("금액을 확인 해 주세요.");
            $("#orderPrice").focus();
            return false;
        }

        if(communalPurchaser === 0){
            alert("공동구매자를 확인 해 주세요.");
            return false;
        }

        if(!file){
            alert("첨부파일 확인 해 주세요.");
            return false;
        }

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

        var total = Number($(e.target).find('[name=orderPrice]').val());
        var communalPurchaserChecked =[];
        $(e.target).find('[name=communalPurchaser]').each(function(){
            var sharePrice = 0;
            if(this.checked){
                sharePrice = $(this.parentElement.parentElement).find('input')[1].value;

                if(sharePrice === 0){
                    sharePrice = total / count();
                }
            }
            communalPurchaserChecked.push({value: this.value, text:this.attributes.text.value, checked :this.checked, sharePrice: sharePrice});
        });

        //categoryOptions = JSON.stringify(categoryOptions).replace(/\\/g, "");
        //purchaserOptions = JSON.stringify(purchaserOptions).replace(/\\/g, "");

        var settlement = {
            dateOrdered : date1,
            dateSettlement : date2,
            category : categoryOptions,
            orderSummary : orderSummary,
            orderPrice : $(e.target).find('[name=orderPrice]').val(),
            //attachReceipt : $(e.target).find('[name=attachReceipt]').val(),
            purchaser : purchaserOptions,
            communalPurchaser : communalPurchaserChecked,
            settlementCompleted : false
        };

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