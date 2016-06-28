/**
 * Created by hyelim on 2016. 4. 7..
 */
Template.settlementDoIt.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-05'
    });

    showAAA2 = function(list, searchCategory){

        // 구매 총금액
        var totalPrice = 0;
        // 로그인 한 사람(=나)이 지불해야 하는 금액(사람별로)
        var paidOther = new Map();
        // 로그인 한 사람(=나)이 받아야 하는 금액(사람별로)
        var paidMe = new Map();

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

/*    showAAA = function(list){
        var searchDate = $('#dateSettlement').val();
        var searchCategory = $('#category').val();

        // 총금액
        var totalPrice = 0;
        // 지불할 사람
        var paidOther = new Map();
        // 받을 사람
        var paidMe = new Map();

        var divList = '';

        for(var i=0; i < list.length; i++){
            var cnt = list[i].category.length;
            var memberCnt = list[i].purchaser.length;
            var communalPurchaserCnt = 0;
            $(list[i].communalPurchaser).each(function(){
                if(this.checked) { communalPurchaserCnt++; }
            });

            // 1. settlementcompleted(정산여부)가 false인 것(true : 정산완료, false: 미정산)
            //if(!list[i].settlementCompleted){

                for(var k=0; k < memberCnt; k++) {
                    if(list[i].purchaser[k].value === Meteor.userId()) {
                        if(searchCategory === 'all'){
                            for(var j=0; j < cnt; j++){
                                if(list[i].category[j].selected === 'selected'){

                                    totalPrice += Number(list[i].orderPrice);

                                    // 구매내역 건당 내가 낸 금액
                                    var paid = 0;

                                    divList += '<div class=row>';
                                    divList += '<div class=col-xs-2>' + list[i].dateOrdered.substring(5,10).replace('-', '') + '</div>';
                                    divList += '<div class=col-xs-2>' + list[i].orderSummary + '</div>';
                                    divList += '<div class=col-xs-3 style=text-align:right>' + numberWithCommas(list[i].orderPrice) + '</div>';
                                    divList += '<div class=col-xs-2 style=text-align:right>' + communalPurchaserCnt + '</div>';
                                    //divList += '<div class=col-xs-2>' + numberWithCommas(sharePrice) + '</div>';
                                    for (var y = 0; y < memberCnt; y++) {
                                        if((Meteor.userId() === list[i].purchaser[y].value)
                                            && (list[i].purchaser[y].selected === 'selected')) {

                                            // 한명이 금액을 지불하므로 가격이 내가 낸 금액이 됨.
                                            paid = Number(list[i].orderPrice);

                                            for(var z=0; z < memberCnt; z++){
                                                if(list[i].communalPurchaser[z].checked &&
                                                    (list[i].communalPurchaser[z].value !== Meteor.userId())){
                                                    var who = list[i].communalPurchaser[z].value+'_'+list[i].communalPurchaser[z].text;
                                                    if(paidMe.get(who)){
                                                        var a = Math.round(Number(paidMe.get(who))) + Math.round(Number(list[i].communalPurchaser[z].sharePrice));
                                                        paidMe.put(who, a);
                                                    }else {
                                                        paidMe.put(who, list[i].communalPurchaser[z].sharePrice)
                                                    }
                                                }
                                            }
                                        }else{
                                            var who = list[i].communalPurchaser[y].value+'_'+list[i].communalPurchaser[y].text;
                                            if(list[i].purchaser[y].selected === 'selected'){

                                                if(paidOther.get(who)){
                                                    var a = Math.round(Number(paidOther.get(who))) + Math.round(Number(list[i].communalPurchaser[y].sharePrice));
                                                    paidOther.put(who, a);
                                                }else {
                                                    paidOther.put(who, list[i].communalPurchaser[y].sharePrice)
                                                }
                                            }
                                        }
                                    }

                                    divList += '<div class=col-xs-3 style=text-align:right>' + numberWithCommas(paid) + '</div>';
                                    //divList += '<div class=col-xs-2>' + numberWithCommas((sharePrice - paid)).toString() + '</div>';
                                    divList += '</div>';
                                    divList += '<hr style=border: solid 1px gray;>';
                                }
                            }
                        }
                        else {
                            for(var j=0; j < cnt; j++){

                                if(searchCategory === list[i].category[j].value
                                    && list[i].category[j].selected === 'selected'){

                                    totalPrice += Number(list[i].orderPrice);

                                    var paid = 0;

                                    divList += '<div class=row>';
                                    divList += '<div class=col-xs-2>' + list[i].dateOrdered.substring(5,10).replace('-','') + '</div>';
                                    divList += '<div class=col-xs-2>' + list[i].orderSummary + '</div>';
                                    divList += '<div class=col-xs-3 style=text-align:right>' + numberWithCommas(list[i].orderPrice) + '</div>';
                                    divList += '<div class=col-xs-2 style=text-align:right>' + communalPurchaserCnt + '</div>';
                                    //divList += '<div class=col-xs-2>' + numberWithCommas(sharePrice) + '</div>';

                                    for (var y = 0; y < memberCnt; y++) {
                                        if((Meteor.userId() === list[i].purchaser[y].value)
                                            && (list[i].purchaser[y].selected === 'selected')) {

                                            // 한명이 금액을 지불하므로 가격이 내가 낸 금액이 됨.
                                            paid = Number(list[i].orderPrice);

                                            for(var z=0; z < memberCnt; z++){
                                                if(list[i].communalPurchaser[z].checked &&
                                                    (list[i].communalPurchaser[z].value !== Meteor.userId())){
                                                    var who = list[i].communalPurchaser[z].value+'_'+list[i].communalPurchaser[z].text;
                                                    if(paidMe.get(who)){
                                                        var a = Number(paidMe.get(who)) + Math.round(Number(list[i].communalPurchaser[z].sharePrice));
                                                        paidMe.put(who, a);
                                                    }else {
                                                        paidMe.put(who, list[i].communalPurchaser[z].sharePrice)
                                                    }
                                                }
                                            }
                                        }else{
                                            var who = list[i].communalPurchaser[y].value+'_'+list[i].communalPurchaser[y].text;
                                            if(list[i].purchaser[y].selected === 'selected'){
                                                if(paidOther.get(who)){
                                                    var a = Number(paidOther.get(who)) + Math.round(Number(list[i].communalPurchaser[y].sharePrice));
                                                    paidOther.put(who, a);
                                                }else {
                                                    paidOther.put(who, list[i].communalPurchaser[y].sharePrice)
                                                }
                                            }
                                        }
                                    }

                                    divList += '<div class=col-xs-3 style=text-align:right>' + numberWithCommas(paid) + '</div>';
                                    //divList += '<div class=col-xs-2>' + numberWithCommas((sharePrice - paid)).toString() + '</div>';
                                    divList += '</div>';
                                    divList += '<hr style=border: solid 1px gray;>';
                                }
                            }
                        }
                    }
                }
            //}
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
        /!*this.$('#list').html(trList);*!/
        this.$('#divList').html(divList);

        this.$('#showNakami').attr('style', 'margin-top:10px; display:""');
    }*/

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
                    showAAA2(result, searchCategory);
                }
            });
        }
    }
});