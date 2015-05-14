/**
 * Copyright (c) 2013 zenboss.com
 *
 */
"use strict";




(function(){
    
    

    var undefined = (function(){})();

    var objProto = Object.prototype;


    var __,
        foxjs,
        fox;

    __ = foxjs = function(){
        // return __._main.apply(__,arguments);
    };

    fox = __.fox = __.prototype = {};


    //判断是不是NODEJS
    if(typeof process !== 'undefined' && !!process.version){
        __.isNode = fox.isNode = true;
    }else{
        __.isNode = fox.isNode = false;
    }

    fox.undefined = __.undefined = undefined;

    __.getUndefined = function(){
        return undefined;
    };

    __.isUndefined = function(val){
        return val === __.getUndefined();
    };


    //总是返回数字的parseInt
    __.parseInt = function(val){
        return parseInt(val)||0;
    };
    //总是返回一个数字
    __.parseNumber = function(val){
        return Number(val)||0;
    };

    //可以对数组和对象进行排序的函数
    __.sort = function(vals,context){
        var val = vals;
        context = context || function(n1,n2){return n1>n2};
        var i=Object.keys(val).length, j;
        var isObject = false;
        if(!Array.isArray(val) && 'object' == typeof val){
            isObject = true;
            val = Object.keys(vals);
        }
        var tempExchangVal;

        while(i>0){
            for(j=0;j<i-1;j++){
                if(context(val[j],val[j+1],vals)){
                    tempExchangVal = val[j];
                    val[j]=val[j+1];
                    val[j+1]=tempExchangVal;
                }
            }
            i--;
        }
//        val.sort(context);
        return val;
    };
    //数组升序
    __.asc = function(arrOrObj){
        var isArr = true;
        var arr = [];
        if(!!Array.isArray(arrOrObj)){
            isArr = true;
            arr = arrOrObj;
        }else{
            isArr = false;
            arr = Object.keys(arrOrObj);
        }
        var keyS = arr.sort(function(min,max){
            if(!isNaN(min) && !isNaN(max)){
                return __.parseNumber(min)>__.parseNumber(max);
            }else{
                return min>max;
            }

        });
        if(isArr){
            return keyS;
        }else{
            var retObj = {};
            for(var i in keyS){
                retObj[keyS[i]] = arrOrObj[keyS[i]];
            }
            return retObj;
        }
    };
    //数组降序
    __.desc = function(arrOrObj){
        var isArr = true;
        var arr = [];
        if(!!Array.isArray(arrOrObj)){
            isArr = true;
            arr = arrOrObj;
        }else{
            isArr = false;
            arr = Object.keys(arrOrObj);
        }
        var keyS = arr.sort(function(min,max){
            if(!isNaN(min) && !isNaN(max)){
                return __.parseNumber(min)<__.parseNumber(max);
            }else{
                return min<max;
            }

        });
        if(isArr){
            return keyS;
        }else{
            var retObj = {};
            for(var i in keyS){
                retObj[keyS[i]] = arrOrObj[keyS[i]];
            }
            return retObj;
        }
    };

    //数组最近的一个大于VAL的数
    __.arrayCeil = function(arr,val,tropic){

        var ret = __.undefined;
        if('object' == typeof arr){
            arr = Object.keys(arr);
        }
        if(!arr.length){
            return ret;
        }

        val = __.parseNumber(val);

        if(isNaN(val))return val;
//        console.log(arr,__.numberItems(arr));
        arr = __.asc(__.numberItems(arr));
//        arr = __.desc(__.numberItems(arr));
//        console.log(arr)
        var lastNumber = null;//最近一个结果
        for(var i in arr){
            var _arrI = __.parseNumber(arr[i]);
            if(!isNaN(_arrI)){
                lastNumber = _arrI;
//                console.log(_arrI,val)
                if(_arrI>=val){

                    ret = _arrI;

                    break;
                }
            }
        }

        if(!!tropic && ret===__.getUndefined()){//如果总是需要一个结果 并且没有找到结果
            ret = lastNumber;
        }
        return ret;
    };
    //数组中最近的小于VAL的数
    __.arrayFloor = function(arr,val,tropic){

        var ret = null;
        if(!arr.length){
            return ret;
        }
        val = __.parseNumber(val);
        if(isNaN(val))return val;
        arr = __.desc(__.numberItems(arr));
        var lastNumber = null;//最近一个结果
        for(var i in arr){
            var _arrI = __.parseNumber(arr[i]);
            if(!isNaN(_arrI)){
                lastNumber = _arrI;
                if(_arrI<=val){
                    ret = _arrI;
                    break;
                }
            }
        }
        if(!!tropic && ret===null){//如果总是需要一个结果 并且没有找到结果
            ret = lastNumber;
        }
        return ret;
    };
    //获得数组中最小的数字
    __.arrayMin = function(arr){
        return Math.min.apply(this,arr);
    };
    //获得数组中最大的数字
    __.arrayMax = function(arr){
        return Math.max.apply(this,arr);
    };

    //数组求和
    __.arraySum = function(arrA){
        if(Array.isArray(arrA)){
            var arr = arrA;
        }else{
            var arr = [];
            for(var i =0;i<arguments.length;i++){
                arr[i]=arguments[i];
            }
        }

        var sum = 0;
        arr.map(function(n){sum+=__.parseNumber(n)});
        return sum;
    };
    //求数组平均值
    __.arrayAverage = function(arr){

        var sum = __.arraySum(arr);
        return sum/arr.length;

    };

    //耙子，就是为OBJ数组纵向过滤
    __.rake = function(arg,cb){

        for(var key in arg[0]){
            var values = [];
            for(var i in arg){//取得每一行的每一个KEY
                values.push(arg[i][key]);
            }
            cb(key,values);
        }

    };
    //收割函数，将数组或argument中每一项归总
    __.reap = function(someArg){
        if(!!someArg)return null;

        var ret = {};
        for(var i in someArg){
            var row = someArg[i];
            for(var key in row){
                ret[key] = ret[key]||[];
                ret[key].push(row[key]);
            }
        }
        return ret;
    };

    //构造一个对象
    __.object = function(){
        var obj = {};
        for(var i=0;i<arguments.length;i=i+2){
            obj[arguments[i]]=arguments[i+1];
        }
        return obj;
    };
    //获得数组或对象的所有数字项目,但不改变项目的类型
    __.numberItems = function(arrOrObj){
        var isArr = true;
        if(Array.isArray(arrOrObj)){
            isArr = true;
        }else{
            isArr = false;
        }


        if(!isArr){ //如果是对象
            var retObjVal = {};
            for(var key in arrOrObj){

                if(!isNaN(Number(arrOrObj[key]))){
                    retObjVal[key] = arrOrObj[key];
                }

            }
            return retObjVal;
        }else{
            var retArrVal = [];
            for(var i in arrOrObj){

                if(!isNaN(Number(arrOrObj[i]))){

                    retArrVal.push(arrOrObj[i]);
                }

            }
            return retArrVal;
        }
    };

    //获得数组或对象的项目转换为数字的表现
    __.items2Number = function(arrOrObj){
        var numVal = __.numberItems(arrOrObj);
        for(var key in numVal){
            numVal[key] = __.parseNumber(numVal[key]);
        }
        return numVal;
    };

    __.arg2Arr = __.toArray = function(arg){
        var ret = [];
        for(var i =0;i<arg.length;i++){
            ret[i]=arg[i];
        }
        return ret;
    }

    //数组去重
    __.arrayUniq = function(arr){
        var retArr = {};
        for(var i in arr){
            retArr[arr[i]] = true;
        }
        return Object.keys(retArr);
    };

    //随机从数组中取一个出来
    __.arrayRandPop = function(arr){
        var len = arr.length;
        if(!len)return this.getUndefined();

        var r = parseInt(Math.random()*len);
        return arr.splice(r,1);
    };
    //随机获得一个
    __.arrayRand = function(arr){
        var len = arr.length;

        if(!len)return this.getUndefined();

        var r = parseInt(Math.random()*len);

        return arr[r];
    };

    //判断是否有一个或多个在数组中
    __.inArray = function(val,other){
        var arr = [];
        if(Array.isArray(val)){
            arr = val||[];
        }else{
            arr = __.keys(val||{});
        }
        for(var i=1;i<arguments.length;i++){
            var row = arguments[i];

            if(!!~arr.indexOf(row)){
                return true;
            }else if(!!~arr.indexOf(Number(row))){
                return true;
            }else if(!!~arr.indexOf(row+'')){
                return true;
            }
        }
        return false;
    };
    //判断是否全部都在数组中
    __.inArrayAll = function(val,other){
        var arr = [];
        if(Array.isArray(val)){
            arr = val;
        }else{
            arr = __.keys(val);
        }
        for(var i=1;i<arguments.length;i++){
            if(!~arr.indexOf(arguments[i])){
                return false;
            }
        }
        return true;
    };
    //倒序数组或对象
    __.reverse = function(val){

        if(Array.isArray(val)){
            return val.reverse();
        }else{
            var retVal = {};
            var valKey = __.reverse(__.keys(val));
            for(var i in valKey){
                retVal[valKey[i]] = val[valKey[i]];
            }
            val = retVal;
            return val;
        }
    };
    //获得数组或对象的下一个项目
    __.next = function(arrOrObj,now,_return){

        var arr = [];
        var isArr = true;
        if(!Array.isArray(arrOrObj)){
            arr = Object.keys(arrOrObj||{});
            isArr = false;
        }else{
            arr = arrOrObj;
            isArr = true;
        }
        _return = _return||false;
        var retVal = __.getUndefined();
        var i = arr.indexOf(now);
        i = i==-1?arr.indexOf(now+''):i;//如果按数字没有找到就按字符串找
        if(!!~i){//如果找到了
            if(i==arr.length-1){
                if(_return){//允许返回找



//                    retVal=isArr?arr[0]:arrOrObj[arr[0]];
                    retVal=arr[0];
                }

            }else{

//                retVal=isArr?arr[i+1]:arrOrObj[arr[i+1]];
                retVal=arr[i+1];
            }
        }
        return retVal;
    };

    //在一个数组或对象对环形找下一个
    __.loop = function(arr,now){
        now = __.parseNumber(now);
        if(isNaN(now)){
            return false;
        }

        if(!Array.isArray(arr)){
            if('object' == typeof arr){
                arr = Object.keys(arr);
            }else{
                return false;
            }
        }

        arr = __.asc(arr);//升序排列

        for(var i in arr){
            var arrI = __.parseNumber(arr[i]);
            if(!isNaN(arrI) && arrI>now){
                return arrI;
            }
        }
        return arr[0];



    };


    //获得对象的全部值
    __.values = function(obj){
        if(Array.isArray(obj))return obj;

        var vals = [];
        var keys = __.keys(obj);
        for(var i in keys){
            var key = keys[i];
            vals.push(obj[key]);
        }
        return vals;
    };
    __.keys = function(obj){

        if(!obj)return [];

        return Object.keys(obj);
    };
    //获得OBJ的值和KEY交换后的对象，相同的KEY被最后的一个取代
    __.values2Keys = function(obj){
        var ret = {};
        for(var key in obj){
            ret[obj[key]] = key;
        }
        return ret;
    };
    //获得子数组
    __.sub = function(arr,start,end){
        if(start<0){
            start = __.len(arr)+start;
        }
        if(end===true){
            end = __.len(arr);
        }else if(end<0){
            end = __.len(arr)+end;

        }else{
            end = start;
        }

        if(Array.isArray(arr)){
            return arr.slice(start,end+1);
        }else if('string' == typeof arr){
            return arr.substring(start,end+1);
        }else{

            var keys = __.keys(arr);
            keys = keys.slice(start,end+1);

            var retVal = {};
            for(var i in keys){
                var key = keys[i];
                retVal[key] = arr[key];

            }
            return retVal;
        }
    };


    //将两个或多个对象合并，返回值永远是对象
    __.objectConcat = __.merge = function(){
        var obj = {};
        for(var i=0;i<arguments.length;i++){
            if('object' != typeof arguments[i])continue;
            arguments[i] = Object(arguments[i]);
            var keys = __.keys(arguments[i]);
            for(var ii in keys){
                var key = keys[ii];
                obj[key] = arguments[i][key];
            }
        }
        return obj;
    };

    //按对象值降序排列
    __.descValues = function(obj){
        var ret = {};
        var values = __.desc(__.values(obj));
        for(var i in values){
            for(var key in obj){
                if(obj[key]==values[i]){
                    ret[key]=obj[key];
                }
            }
        }
        return ret;
    };
    //按对象值升序排列
    __.ascValues = function(obj){
        var ret = {};
        var values = __.asc(__.values(obj));
        for(var i in values){
            for(var key in obj){
                if(obj[key]==values[i]){
                    ret[key]=obj[key];
                }
            }
        }
        return ret;
    };

    __.trim = function(val,hask){
        if(!val)return val;
        if('string' == typeof val){
            hask = hask||'\\s';
            /*var lIndex = 0;
            var rIndex = -1;
            for(var i=0;i<val.length;i++){
                if(val[i]!=hask){
                    lIndex=i;
                    break;
                }
            }
            for(var i=(val.length-1);i>=0;i--){
                if(val[i]!=hask){
                    rIndex=i;
                    break
                }
            }

            return val.substring(lIndex,rIndex+1);*/
            var rL = new RegExp("^"+hask+hask+"*");
            var rR = new RegExp(hask+hask+"*$");
            return val.replace(rL,'').replace(rR,'');

        }else if(Array.isArray(val)){
            for(var i in val){
                if(val[i]==hask){
                    val.shift();
                }else{
                    break;
                }
            }
            for(var i=(val.length-1);i>=0;i--){
                if(val[i]==hask){
                    val.pop();
                }else{
                    break;
                }
            }
            return val;
        }else{
            return val;
        }
    };

    //洗牌
    __.shuffle = function(arr){
        if(!Array.isArray(arr)){
            arr = Object.keys(arr);
        }
        var len = arr.length;

        for(var i in arr){
            var rand = Math.floor(Math.random() * len);//随机找一个人和当前的人换位置
            var tmp = arr[rand];
            arr[rand]=arr[i];
            arr[i]=tmp;
        }
        return arr;
    };

    //萃取
    __.each = function(val,func,other){

        var arg = __.arg2Arr(arguments);
        var arg = arg.slice(2);
        var retVal = null;
        if(Array.isArray(val)){
            retVal = [];
        }else{
            retVal = {};
        }
//        var keys = __.keys(val);
        for(var key in val){
//            func(val[key],key,val,arg);
            var ret = func.apply(this,[].concat(val[key],key,val,arg));

            if(ret!==__.getUndefined()){
                retVal[key] = ret;
            }
        }
        return retVal;

    };

    var _typeObj = {};
    __.each("Boolean,Number,String,Function,Array,Date,RegExp,Object,Error".split(","),function(typeName){
        _typeObj[typeName] = "[object " + typeName + "]";
        __['is'+typeName] = function(val){
            return objProto.toString.call(val) === _typeObj[typeName];
        }
    });



    //寻找
    __.find = function(val,func,other){
        var arg = __.arg2Arr(arguments);
        var arg = arg.slice(2);
        for(var key in val){
//            func(val[key],key,val,arg);
            var ret = func.apply(this,[].concat(val[key],key,val,arg));
            if(!!ret){
                return val[key];
            }
        }

    };
    //指定循环次数
    __.times = function(num,func){
        var retVal = [];
        for(var i=0;i<num;i++){
            retVal[i]=func(i);
        }
        return retVal;
    };
    //获得数组或对象的长度
    __.len = function(val){
        if(!val)return 0;
        if('string'==typeof val){
            return val.length;
        }else{
            return Object.keys(val).length;
        }

    };

    //获得多少天前或后的时间戳
    __.time = function(optArray,timeMSec){
        optArray = optArray||[];
        var now = timeMSec||Date.now();
        if(!!optArray.length){
            //        optArray.reverse();
            now += __.parseInt(optArray[4]);//毫秒
            now += __.parseInt(optArray[3])*1000;//秒
            now += __.parseInt(optArray[2])*60000;//分钟
            now += __.parseInt(optArray[1])*3600000;//小时
            now += __.parseInt(optArray[0])*86400000;//天
        }
        return now;
    };

    //获得连续的数字
    __.isLink = function(numArr,sorted){

        if(!sorted){//如果没有排序
            numArr = __.asc(numArr);//升序排列
        }
        var numArrLen = numArr.length;
        if(Math.abs(numArr[0]-numArr[numArrLen-1])+1 == numArrLen){
            return true;
        }else{
            return false;
        }
    };

    //空函数
    __.funcNone = function(){

        if(!!arguments.length && 'function' == typeof arguments[arguments.length-1]){
            var arg = [];

            for(var i=0;i<arguments.length;i++){
                arg[i] = arguments[i];
            }
            var len = arg.length;

            arg[len-1].apply(this,arg.slice(0,arg.length-1));
        }
    };

    //随机数
    __.rand = function(min,max){
        if(Array.isArray(min)){
            return min[__.rand(0,min.length-1)];
        }else if(arguments.length>=2){
            if(min>max){
                var _tmp = max;
                max = min;
                min = _tmp;
            }else if(min==max){
                return parseInt(min);
            }
            return parseInt(Math.random()*(max-min+1)+min);
        }else{
            return __.getUndefined();
        }
    };


    //几率
    __.odds = function(){

//        var args = __.arg2Arr(arguments);
        var args = arguments;
        var len = args.length;
        if(!len)return __.getUndefined();
        var oddsArr = [];//所有设定的概率

        for(var i=0;i<len;i++){
            if(Array.isArray(args[i]) && args[i].length==2 && args.hasOwnProperty(i) && !isNaN(args[i][0])){
                args[i][0] = __.parseNumber(args[i][0]);
                oddsArr.push(args[i]);
            }
        }

        oddsArr = oddsArr.sort(function(n1,n2){return n2[0]<n1[0]});

        var nowOddsNumber = 0;
        for(var i in oddsArr){

            oddsArr[i][0] +=nowOddsNumber;
            nowOddsNumber = oddsArr[i][0];
        }

        var r = Math.random();
        for(var i in oddsArr){
            if(r<=oddsArr[i][0]){
                return oddsArr[i][1];
            }
        }

        return oddsArr[oddsArr.length-1][1];


    };

    //傻瓜盒子，假概率
    var allGumpBoxs = __.allGumpBoxs = {};
    __.gumpBox = function(boxid){//第一个参数是盒子名称
        var args = arguments;
        var argLen = args.length;
        if(argLen==1){//get one gump box
            return allGumpBoxs[boxid];
        }else if(argLen==0){// fulsh gump box
            allGumpBoxs = {};
            return allGumpBoxs;
        }else if(args[1]===null){// fulsh one gump box
            delete allGumpBoxs[boxid];
            return null;
        }else if(__.isObject(args[1])){// set a gump box
            allGumpBoxs[boxid] = args[1];
            return __.getUndefined();
        }

        var args = {};
        for(var i=1;i<arguments.length;i++){
            args[i-1] = arguments[i];
        }
        if(!allGumpBoxs[boxid] && Object.keys(args).length>0){//大于0就是设置
            allGumpBoxs[boxid] = args;

        }
        var giftKey = Object.keys(allGumpBoxs[boxid]);//获得全部物品的KEY
        var giftLen = giftKey.length;//获得又多少个物品
//        var giftIndex = giftKey[__.rand(0,giftLen-1)];//原始的没有用概率做随机
        //======================
        var giftTotalNumber = 0;//一共还有多少个物品
        for(var i in allGumpBoxs[boxid]){
            var row = allGumpBoxs[boxid][i];
            giftTotalNumber+=row[0];
        }
        var oddsArgs = [];
        for(var key in allGumpBoxs[boxid]){
            var row = allGumpBoxs[boxid][key];
            oddsArgs.push([row[0]/giftTotalNumber,key]);
        }

        var giftIndex = __.odds.apply(__,oddsArgs);
        //======================
        var gift = allGumpBoxs[boxid][giftIndex];

        if(!!gift){
            allGumpBoxs[boxid][giftIndex][0] = __.parseInt(allGumpBoxs[boxid][giftIndex][0])-1;
            if(allGumpBoxs[boxid][giftIndex][0]<1){ //如果这种物品已经没有了，就吧位置也删除掉
                delete allGumpBoxs[boxid][giftIndex];
            }
            if(Object.keys(allGumpBoxs[boxid]).length==0){ //如果整个BOXID都空了，就吧BOX删除掉
                delete allGumpBoxs[boxid];
            }

            return gift[1];
        }


    };

    //深度克隆
    __.deepClone = function(val){
        if(__.isUndefined(val) || val==null){
            return null;
        }
        return JSON.parse(JSON.stringify(val));
    };



    //现在就做超时
    __.doTimeout = function(){
        var args = __.arg2Arr(arguments);
        args[1] = args[1]||0;
        var arg = args.slice(2);
        var func = args[0];
        var hd = 0;
        args[0] = function(){
            func.apply(hd,arg);
        };
        hd = setTimeout.apply(null,args);
        args[0].call(hd);
        return hd;
    };
    //现在就做间隙
    __.doInterval = function(){
        var args = __.arg2Arr(arguments);
        args[1] = args[1]||0;
        var arg = args.slice(2);
        var func = args[0];
        var hd = 0;
        args[0] = function(){
            func.apply(hd,arg);
        };
        hd = setInterval.apply(null,args);
        args[0].call(hd);
        return hd;
    };

    __.syncLoop = function(func,args){
        args = args||{};
        setImmediate(func,function(){
            syncLoop(func,args);
        },args)
    };
    __.syncInterval = function(func,time){
        var args = Array.prototype.slice.call(arguments,2);
        var hd = __.uuid();
        __.syncInterval._hd[hd] = true;
        __.syncLoop(function(next,args){
            if(__.syncInterval._hd[hd]){
                func.apply(null,args);
                setTimeout(next,time);
            }
        },args);
        return hd;
    };
    __.syncInterval._hd = {};
    __.clearSyncInterval = function(hd){
        delete __.syncInterval._hd[hd];
    };




    __.now = function(){
        return (Date.now()/1000)|0;
    };


    __.dateFormat = function(formatStr,time,milli){ //日期函数
        var d = null;
        if(!isNaN(time = parseInt(time))){
            d = new Date(time*1000);
        }else if(!isNaN(milli = parseInt(milli))){//如果是毫秒
            d = new Date(milli);
        }else{
            d = new Date();
        }

        var year = d.getYear()+1900;
        formatStr = formatStr.replace('Y',year);
        formatStr = formatStr.replace('y',(year+'').substr(-2));
        formatStr = formatStr.replace('m',('0'+(d.getMonth()+1)).substr(-2));
        formatStr = formatStr.replace('d',('0'+d.getDate()).substr(-2));

        var hour = d.getHours();
        formatStr = formatStr.replace('H',('0'+hour).substr(-2));
        formatStr = formatStr.replace('h',('0'+((hour|0)%12||12)).substr(-2));

        //上下午
        formatStr = formatStr.replace('a',hour<12?'am':'pm');

        formatStr = formatStr.replace('i',('0'+d.getMinutes()).substr(-2));
        formatStr = formatStr.replace('s',('0'+d.getSeconds()).substr(-2));
        return formatStr;

    };

    //将数组转为人类可识别的文字
    __.n2h = function(num){
        if(num>=1000000){
            num = __.parseInt(num/1000000)+"百万";
        }else if(num>=10000){
            num = __.parseInt(num/10000)+"万";
        }else if(num>=1000){
            num = __.parseInt(num/1000)+"千";
        }else if(num>=100){
            num =  __.parseInt(num/100)+"百";
        }else{
            num = num;
        }
        return num;
    };

    //解UNICODE
    __.escapeUnicode = function(str){
        return escape(str).replace(/%/g, '\\');
    };

    //反解UNICODE
    __.unEscapeUnicode = function(unicode){
        return unescape(unicode.replace(/\\u/gi,'%u'));
    };

    var uuid = 1;
    __.uuid = function(){
        return uuid++;
    };

    __.isNumber = function(val){
        return (isFinite(val) && __.typeof(val)=='Number');
    };



    //获得变量类型
    __.type = function(val){
        return objProto.toString.call(val);
    };

    __.typeof = function(val){
        var type = __.type(val);
        return type.replace(/\[object\ (.*)\]/,'$1');
    };

    //常量
    __.CONST={};
    __.define = function(key,val){
        if(arguments.length<=0){
            __.CONST = {};
            return __;
        }
        key = key+'';
        __.CONST[key.toUpperCase()] = val;
        return __;
    };

    //数据仓库
    var _data = {};
    __.data = function(name,val){
        var argLen = arguments.length;
        if(argLen==0){
            _data = {};
            return __;
        }else if(argLen==1){
            return _data[name];
        }else{
            _data[name] = val;
            return val;
        }
    };

    var __nodeJSInit = function(){

        __.nextTick = setImmediate;

    };
    var __noNodeJSInit = function(){

        __.nextTick = function(fn){
            var args = Array.prototype.slice.call(arguments,1);
            return setTimeout(function(){
                fn.apply(null,args);
            },0);
        };

    };



    if(__.isNode){
        __nodeJSInit();
        module.exports = foxjs;
    }else{
        __noNodeJSInit();
        window.foxjs = window.__ = foxjs;
    }


})();