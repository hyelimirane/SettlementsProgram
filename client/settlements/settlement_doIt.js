/**
 * Created by hyelim on 2016. 4. 7..
 */
Template.settlementDoIt.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-05'
    });

    showAAA = function(list){
        var searchDate = $('#dateSettlement').val();
        var searchCategory = $('#category').val();

        // 총금액
        var totalPrice = 0;
        // 할당액
        var sharePrice = 0;
        // 정산액
        var adjustedAmount = 0;
        // 지불할 사람
        var paidOther = new Map();
        // 받을 사람
        var paidMe = new Map();

        var memberCnt = 0;
        var trList = '';
        var divList = '';

        for(var i=0; i < list.length; i++){
            var cnt = list[i].category.length;
            var memberCnt = list[i].purchaser.length;
            var communalPurchaserCnt = 0;
            $(list[i].communalPurchaser).each(function(){
                if(this.checked) { communalPurchaserCnt++; }
            });

            if(!list[i].settlementCompleted){

                if(i === 0){
                    divList += '<div class="col-md-1">구매일자</div>'
                        + '<div class="col-md-2">내용</div>'
                        + '<div class="col-md-2">구매금액</div>'
                        + '<div class="col-md-1">구매인원</div>'
                        + '<div class="col-md-2">할당액</div>'
                        + '<div class="col-md-2">내가 낸 금액</div>'
                        + '<div class="col-md-2">정산액</div>';
                }

                for(var k=0; k < memberCnt; k++) {
                    if(list[i].purchaser[k].value === Meteor.userId()) {
                        if(searchCategory === 'all'){
                            for(var j=0; j < cnt; j++){
                                if(list[i].category[j].selected === 'selected'){

                                    totalPrice += Number(list[i].orderPrice);

                                    if (communalPurchaserCnt !== 0) {
                                        sharePrice = Number(list[i].orderPrice) / communalPurchaserCnt;
                                    }

                                    // 구매내역 건당 내가 낸 금액
                                    var paid = 0;

                                    divList += '<div class=col-md-1>' + list[i].dateOrdered.substring(5,10) + '</div>';
                                    divList += '<div class=col-md-2>' + list[i].orderSummary + '</div>';
                                    divList += '<div class=col-md-2>' + numberWithCommas(list[i].orderPrice) + '</div>';
                                    divList += '<div class=col-md-1>' + communalPurchaserCnt + '</div>';
                                    divList += '<div class=col-md-2>' + numberWithCommas(sharePrice) + '</div>';

/*                                    trList += '<tr>';
                                    trList += '<td align=center>' + list[i].dateOrdered + '</td>';
                                    trList += '<td>' + list[i].orderSummary + '</td>';
                                    trList += '<td align=right>' + numberWithCommas(list[i].orderPrice) + '</td>';
                                    trList += '<td align=center>' + communalPurchaserCnt + '</td>';
                                    trList += '<td align=right>' + numberWithCommas(sharePrice) + '</td>';*/

                                    for (var y = 0; y < memberCnt; y++) {
                                        if((Meteor.userId() === list[i].purchaser[y].value)
                                            && (list[i].purchaser[y].selected === 'selected')) {
                                            paid = Number(list[i].orderPrice);

                                            for(var z=0; z < memberCnt; z++){
                                                if(list[i].communalPurchaser[z].checked &&
                                                    (list[i].communalPurchaser[z].value !== Meteor.userId())){
                                                    var who = list[i].communalPurchaser[z].value+'_'+list[i].communalPurchaser[z].text;
                                                    if(paidMe.get(who)){
                                                        var a = Number(paidMe.get(who)) + Number(list[i].communalPurchaser[z].sharePrice);
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
                                                    var a = Number(paidOther.get(who)) + Number(list[i].communalPurchaser[y].sharePrice);
                                                    paidOther.put(who, a);
                                                }else {
                                                    paidOther.put(who, list[i].communalPurchaser[y].sharePrice)
                                                }
                                            }
                                        }
                                    }
                                    adjustedAmount += (sharePrice - paid);

                                    divList += '<div class=col-md-2>' + numberWithCommas(paid) + '</div>';
                                    divList += '<div class=col-md-2>' + numberWithCommas((sharePrice - paid)).toString() + '</div>';


/*                                    trList += '<td align=right>' + numberWithCommas(paid) + '</td>';
                                    trList += '<td class=\'adjust\' align=right>' + numberWithCommas((sharePrice - paid)).toString() + '</td>';
                                    trList += '</tr>';*/
                                }
                            }
                        }
                        else {
                            for(var j=0; j < cnt; j++){

                                if(searchCategory === list[i].category[j].value
                                    && list[i].category[j].selected === 'selected'){

                                    totalPrice += Number(list[i].orderPrice);

                                    if(communalPurchaserCnt !== 0) {
                                        sharePrice = Number(list[i].orderPrice) / Number(communalPurchaserCnt);
                                    }

                                    var paid = 0;

                                    divList += '<div class=col-md-1>' + list[i].dateOrdered.substring(5,10) + '</div>';
                                    divList += '<div class=col-md-2>' + list[i].orderSummary + '</div>';
                                    divList += '<div class=col-md-2>' + numberWithCommas(list[i].orderPrice) + '</div>';
                                    divList += '<div class=col-md-1>' + communalPurchaserCnt + '</div>';
                                    divList += '<div class=col-md-2>' + numberWithCommas(sharePrice) + '</div>';

                                    /*trList += '<tr>';
                                    trList += '<td align=center>' + list[i].dateOrdered + '</td>';
                                    trList += '<td>' + list[i].orderSummary + '</td>';
                                    trList += '<td align=right>' + numberWithCommas(list[i].orderPrice) + ' 원</td>';
                                    trList += '<td align=center>' + communalPurchaserCnt + '</td>';
                                    trList += '<td align=right>' + numberWithCommas(sharePrice) + ' 원</td>';*/

                                    for (var y = 0; y < memberCnt; y++) {
                                        if((Meteor.userId() === list[i].purchaser[y].value)
                                            && (list[i].purchaser[y].selected === 'selected')) {
                                            paid = Number(list[i].orderPrice);

                                            for(var z=0; z < memberCnt; z++){
                                                if(list[i].communalPurchaser[z].checked &&
                                                    (list[i].communalPurchaser[z].value !== Meteor.userId())){
                                                    var who = list[i].communalPurchaser[z].value+'_'+list[i].communalPurchaser[z].text;
                                                    if(paidMe.get(who)){
                                                        var a = Number(paidMe.get(who)) + Number(list[i].communalPurchaser[z].sharePrice);
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
                                                    var a = Number(paidOther.get(who)) + Number(list[i].communalPurchaser[y].sharePrice);
                                                    paidOther.put(who, a);
                                                }else {
                                                    paidOther.put(who, list[i].communalPurchaser[y].sharePrice)
                                                }
                                            }
                                        }
                                    }
                                    adjustedAmount += (sharePrice - paid);

                                    divList += '<div class=col-md-2>' + numberWithCommas(paid) + '</div>';
                                    divList += '<div class=col-md-2>' + numberWithCommas((sharePrice - paid)).toString() + '</div>';

                                    /*trList += '<td align=right>' + numberWithCommas(paid) + ' 원</td>';
                                    trList += '<td align=right>' + numberWithCommas((sharePrice - paid)).toString() + ' 원</td>';
                                    trList += '</tr>';*/
                                }
                            }
                        }
                    }
                }
            }
        }

        /*if(trList === '') {
            trList = '<tr><td colspan=7 align=center>해당 내역이 없습니다.</td></tr>';
        }*/

        if(divList === '') {
            divList = '<div class=col-md-12>해당 내역이 없습니다.</div>';
        }

        var array1 = paidMe.keys();
        var paidToMe = '';
        for(var a in array1){
            var key = array1[a].toString();
            key = key.substring(key.lastIndexOf('_')+1, key.length);
            paidToMe += key + '에게 ' + numberWithCommas(paidMe.get(array1[a])) + '원 받으세요. <br>';
        }

        var array2 = paidOther.keys();
        var paidToOther = '';
        for(var a in array2){
            var key = array2[a].toString();
            key = key.substring(key.lastIndexOf('_')+1, key.length);
            paidToOther += key + '에게 ' + numberWithCommas(paidOther.get(array2[a])) + '원 지불하세요. <br>';
        }

        if(paidToMe === '') paidToMe = '받을 금액이 없습니다';
        if(paidToOther === '') paidToOther = '지불 할 금액이 없습니다';

        this.$('#totalPrice').html(numberWithCommas(totalPrice));
        this.$('#adjustedAmount').html(numberWithCommas(adjustedAmount).toString());
        this.$('#paidMe').html(paidToMe);
        this.$('#paidOther').html(paidToOther);
        /*this.$('#list').html(trList);*/
        this.$('#divList').html(divList);

        this.$('#showNakami').attr('style', 'margin-top:10px; display:""');
    }
});

Template.settlementDoIt.events({
    'click #doItBtn' : function(e){

        if($('#dateSettlement').val() === ''){
            alert('selected settlement date!!');
        }
        else{
            var findOptions = {
                dateSettlement:$('#dateSettlement').val()
            };

            if($('#category').val() !== 'all'){
                findOptions.category = {$elemMatch: { value: $('#category').val(), selected: 'selected'}};
            }

            Meteor.call('settlementsSelect', findOptions, function(error, result){
                // display the error to the user and abort
                if(error) {
                    console.log('error!');
                    return throwError(error.reason);
                }else{
                    showAAA(result);
                }
            });
        }
    }
});