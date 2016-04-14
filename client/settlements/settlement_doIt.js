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

        var totalPrice = 0;
        var memberCnt = 0;
        var sharePrice = 0;
        var adjustedAmount = 0;
        var trList = '';

        for(var i=0; i < list.length; i++){
            var cnt = list[i].category.length;
            memberCnt = list[0].purchaser.length;

            if(!list[i].settlementCompleted){
                if(searchDate === list[i].dateSettlement){
                    if(searchCategory === 'all'){
                        for(var j=0; j < cnt; j++){
                            if(list[i].category[j].selected === 'selected'){
                                totalPrice += Number(list[i].orderPrice);

                                memberCnt = list[i].purchaser.length;
                                if(memberCnt !== 0) {
                                    sharePrice = Number(list[i].orderPrice) / memberCnt;
                                }

                                var paid = 0;

                                trList += '<tr>';
                                trList += '<td align=center>' + list[i].dateOrdered + '</td>';
                                trList += '<td>' + list[i].orderSummary + '</td>';
                                trList += '<td align=right>' + numberWithCommas(list[i].orderPrice) + '</td>';
                                trList += '<td align=center>' + memberCnt + '</td>';
                                trList += '<td align=right>' + numberWithCommas(sharePrice) + '</td>';
                                for(var k=0; k < memberCnt; k++){
                                    if((Meteor.userId() === list[i].purchaser[k].value)
                                        && (list[i].purchaser[k].selected === 'selected') ){
                                        paid = Number(list[i].orderPrice);
                                        break;
                                    }
                                }
                                adjustedAmount += (sharePrice - paid);

                                trList += '<td align=right>' + numberWithCommas(paid) + '</td>';
                                trList += '<td align=right>' + numberWithCommas((sharePrice - paid)).toString() + '</td>';
                                trList += '</tr>';
                            }
                        }
                    }
                    else {
                        for(var j=0; j < cnt; j++){

                            if(searchCategory === list[i].category[j].value
                                && list[i].category[j].selected === 'selected'){

                                totalPrice += Number(list[i].orderPrice);

                                memberCnt = list[i].purchaser.length;
                                if(memberCnt !== 0) {
                                    sharePrice = Number(list[i].orderPrice) / memberCnt;
                                }

                                var paid = 0;

                                trList += '<tr>';
                                trList += '<td align=center>' + list[i].dateOrdered + '</td>';
                                trList += '<td>' + list[i].orderSummary + '</td>';
                                trList += '<td align=right>' + numberWithCommas(list[i].orderPrice) + ' 원</td>';
                                trList += '<td align=center>' + memberCnt + '</td>';
                                trList += '<td align=right>' + numberWithCommas(sharePrice) + ' 원</td>';
                                for(var k=0; k < memberCnt; k++){
                                    if((Meteor.userId() === list[i].purchaser[k].value)
                                        && (list[i].purchaser[k].selected === 'selected') ){
                                        paid = Number(list[i].orderPrice);
                                        break;
                                    }
                                }
                                adjustedAmount += (sharePrice - paid);

                                trList += '<td align=right>' + numberWithCommas(paid) + ' 원</td>';
                                trList += '<td align=right>' + numberWithCommas((sharePrice - paid)).toString() + ' 원</td>';
                                trList += '</tr>';
                            }
                        }
                    }
                }
            }
        }

        if(trList === '') {
            trList = '<tr><td colspan=7 align=center>해당 내역이 없습니다.</td></tr>';
        }

        this.$('#totalPrice').html(numberWithCommas(totalPrice));
        this.$('#adjustedAmount').html(numberWithCommas(adjustedAmount).toString());
        this.$('#list').html(trList);

        this.$('#showNakami').attr('style', 'display:""');
    }
});

Template.settlementDoIt.events({
    'change #category' : function(e){

        if($('#dateSettlement').val() === ''){
            alert('selected settlement date!!');
        }
        else{
            var findOptions = {
                dateSettlement:$('#dateSettlement').val()
            };

            if($('category').val !== 'all'){
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