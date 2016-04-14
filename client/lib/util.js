/**
 * Created by hyelim on 2016. 4. 7..
 */
/*
* file scope
* var fun = function(){}
*
* package scope
* fun = function(){}
*
* 공통으로 사용할 함수는 client/lib, 혹은 lib 안에 넣어야 사용할 수 있음
*
* */

// 3자리마다 , 찍기
numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}