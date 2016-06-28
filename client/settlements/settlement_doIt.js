/**
 * Created by hyelim on 2016. 4. 7..
 */
Template.settlementDoIt.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-05'
    });

    showAAA = function(list, searchCategory){

        // 구매 총금액
        var totalPrice = 0;
        // 로그인 한 사람(=나)이 지불해야 하는 금액(사람별로)
        var paidOther = new Map();
        // 로그인 한 사람(=나)이 받아야 하는 금액(사람별로)
        var paidMe = new Map();

        // 테이블에 뿌릴 내용.
        var divList = '';

        // 검색 된 건수만큼 for문
        for(var a=0; a < list.length; a++){
            // 검색조건 : 전체 일 때
            if(searchCategory === 'all'){

                // 구매자ID
                var purchaserKey = '';
                var purchaserId = '';
                $(list[a].purchaser).each(function(){
                    if(this.selected === 'selected'){
                        purchaserKey = this.value;
                        purchaserId = this.text;
                        console.log('each purchaserId :: ', purchaserId);
                    }
                });

                // 로그인한 사람이 구매자인지
                var purchaseIsMe = false;
                if(purchaserKey === Meteor.userId()){
                    purchaseIsMe = true;
                    console.log('it\'s me');
                }

                // 구매인원
                var communalPurchaserCnt = 0;
                $(list[a].communalPurchaser).each(function(){
                    if(this.checked) { communalPurchaserCnt++; }
                });

                divList += '<div class=row>';
                divList += '<div class=col-xs-2>' + list[a].dateOrdered.substring(5,10).replace('-', '') + '</div>';
                divList += '<div class=col-xs-2>' + list[a].orderSummary + '</div>';
                divList += '<div class=col-xs-3 style=text-align:right>' + numberWithCommas(list[a].orderPrice) + '</div>';
                divList += '<div class=col-xs-2 style=text-align:right>' + communalPurchaserCnt + '</div>';
                divList += '<div class=col-xs-3 style=text-align:right>' + purchaserId + '</div>';
                divList += '</div>';
                divList += '<hr style=border: solid 1px gray;>';

                totalPrice += Number(list[a].orderPrice);

                for(var b=0; b < list[a].communalPurchaser.length; b++) {
                    if (purchaseIsMe) {
                        if (list[a].communalPurchaser[b].value !== purchaserKey) {
                            // 로그인한 사람이 받아야 할 사람 정보(_id_id)
                            var who = list[a].communalPurchaser[b].value + '_' + list[a].communalPurchaser[b].text;
                            if (paidMe.get(who)) {
                                var refund = Math.round(Number(paidMe.get(who))) + Math.round(Number(list[a].communalPurchaser[b].sharePrice));
                                paidMe.put(who, refund);
                            } else {
                                paidMe.put(who, list[a].communalPurchaser[b].sharePrice)
                            }
                        }
                    }
                    else {
                        if (list[a].communalPurchaser[b].value === Meteor.userId()) {
                            // 로그인한 사람이 지불해야 할 사람 정보
                            var who = purchaserKey + '_' + purchaserId;
                            if(paidOther.get(who)){
                                var pay = Math.round(Number(paidOther.get(who))) + Math.round(Number(list[a].communalPurchaser[b].sharePrice));
                                paidOther.put(who, pay);
                            }else {
                                paidOther.put(who, list[a].communalPurchaser[b].sharePrice)
                            }
                        }
                    }
                }

            }
            // category :: selected
            else{
                for(var c=0; c < list[a].category.length; c++){
                    if(searchCategory === list[a].category[c].value
                        && list[a].category[c].selected === 'selected') {

                        // 구매자ID
                        var purchaserKey = '';
                        var purchaserId = '';
                        $(list[a].purchaser).each(function(){
                            if(this.selected === 'selected'){
                                purchaserKey = this.value;
                                purchaserId = this.text;
                                console.log('each purchaserId :: ', purchaserId);
                            }
                        });

                        // 로그인한 사람이 구매자인지
                        var purchaseIsMe = false;
                        if(purchaserKey === Meteor.userId()){
                            purchaseIsMe = true;
                            console.log('it\'s me');
                        }

                        // 구매인원
                        var communalPurchaserCnt = 0;
                        $(list[a].communalPurchaser).each(function(){
                            if(this.checked) { communalPurchaserCnt++; }
                        });

                        divList += '<div class=row>';
                        divList += '<div class=col-xs-2>' + list[a].dateOrdered.substring(5,10).replace('-', '') + '</div>';
                        divList += '<div class=col-xs-2>' + list[a].orderSummary + '</div>';
                        divList += '<div class=col-xs-3 style=text-align:right>' + numberWithCommas(list[a].orderPrice) + '</div>';
                        divList += '<div class=col-xs-2 style=text-align:right>' + communalPurchaserCnt + '</div>';
                        divList += '<div class=col-xs-3 style=text-align:right>' + purchaserId + '</div>';
                        divList += '</div>';
                        divList += '<hr style=border: solid 1px gray;>';

                        totalPrice += Number(list[a].orderPrice);

                        for(var b=0; b < list[a].communalPurchaser.length; b++) {
                            if (purchaseIsMe) {
                                if (list[a].communalPurchaser[b].value !== purchaserKey) {
                                    // 로그인한 사람이 받아야 할 사람 정보(_id_id)
                                    var who = list[a].communalPurchaser[b].value + '_' + list[a].communalPurchaser[b].text;
                                    if (paidMe.get(who)) {
                                        var refund = Math.round(Number(paidMe.get(who))) + Math.round(Number(list[a].communalPurchaser[b].sharePrice));
                                        paidMe.put(who, refund);
                                    } else {
                                        paidMe.put(who, list[a].communalPurchaser[b].sharePrice)
                                    }
                                }
                            }
                            else {
                                if (list[a].communalPurchaser[b].value === Meteor.userId()) {
                                    // 로그인한 사람이 지불해야 할 사람 정보
                                    var who = purchaserKey + '_' + purchaserId;
                                    if(paidOther.get(who)){
                                        var pay = Math.round(Number(paidOther.get(who))) + Math.round(Number(list[a].communalPurchaser[b].sharePrice));
                                        paidOther.put(who, pay);
                                    }else {
                                        paidOther.put(who, list[a].communalPurchaser[b].sharePrice)
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }

        if(divList === '') {
            divList = '<div class=col-xs-12>해당 내역이 없습니다.</div>';
        }

        var array1 = paidMe.keys();
        var paidToMe = '';
        for(var a in array1){
            var key = array1[a].toString();
            key = key.substring(key.lastIndexOf('_')+1, key.length);
            paidToMe += key + '에게 ' + numberWithCommas(Math.round(paidMe.get(array1[a]) * 0.01) * 100) + '원 받으세요. <br>';
        }

        var array2 = paidOther.keys();
        var paidToOther = '';
        for(var a in array2){
            var key = array2[a].toString();
            key = key.substring(key.lastIndexOf('_')+1, key.length);
            paidToOther += key + '에게 ' + numberWithCommas(Math.round(paidOther.get(array2[a]) * 0.01) * 100) + '원 지불하세요. <br>';
        }

        if(paidToMe === '') paidToMe = '받을 금액이 없습니다';
        if(paidToOther === '') paidToOther = '지불 할 금액이 없습니다';

        this.$('#totalPrice').html(numberWithCommas(totalPrice));
        this.$('#paidMe').html(paidToMe);
        this.$('#paidOther').html(paidToOther);
        this.$('#divList').html(divList);

        this.$('#showNakami').attr('style', 'margin-top:10px; display:""');

    };
});

Template.settlementDoIt.events({
    'click #doItBtn' : function(e){

        if($('#dateSettlement').val() === ''){
            alert('selected settlement date!!');
        }
        else{
            var findOptions = {
                dateSettlement:$('#dateSettlement').val(),
                settlementCompleted:false
            };

            var searchCategory = $('#category').val();

            if($('#category').val() !== 'all'){
                findOptions.category = {$elemMatch: { value: searchCategory, selected: 'selected'}};
            }

            Meteor.call('settlementsSelect', findOptions, function(error, result){
                // display the error to the user and abort
                if(error) {
                    console.log('error!');
                    return throwError(error.reason);
                }else{
                    //showAAA(result);
                    showAAA(result, searchCategory);
                }
            });
        }
    }
});