/**
 * Created by ZJN on 2017/9/13.
 */
//想要操作谁，就先获取谁
var oTab = document.getElementById("tab");
var tHead = oTab.tHead; //获取表格中的thead
var oThs = tHead.rows[0].cells; //获取第一行的所有的列
var tBody = oTab.tBodies[0];
var oRows = tBody.rows;
//只有table才能用这些元素

var data = null;
//1、首先获取后台（data.txt）中的数据，是JSON格式的字符串
//Ajax（async javascript and xml）
//(1)首先创建一个ajax对象
var xhr = new XMLHttpRequest;
//(2)打开需要请求的那个文件地址
xhr.open("get", "data.txt", false);
//(3)监听请求状态
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
        var val = xhr.responseText;
        data = utils.jsonParse(val); //把数据都保存在data中
    }
};
//(4)发送请求：
xhr.send(null);

//2、实现数据绑定
function bind() {
    var frg = document.createDocumentFragment(); //创建一个文档碎片
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        var oTr = document.createElement("tr"); //每一次循环创建一个tr
        //每一个tr中还需要创建4个td，因为每一个对象中有四组键值对
        for (var key in cur) {
            var oTd = document.createElement("td");
            //对性别进行特殊处理 0变成男 1变成女
            if (key === "sex") {
                oTd.innerHTML = cur[key] === 0 ? "女" : "男";
            } else {
                oTd.innerHTML = cur[key];
            }
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg = null;
}
bind();


//实现隔行变色：
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();


//编写表格排序的方法，按照年龄这一列进行排序：
function sort(n) { //n是当前点击这一列的索引
    var _this = this;
    //把存储所有行的类数组转换为数组
    var ary = utils.listToArray(oRows);
    //给数组进行排序,按照每一行第二列中的内容进行由小到大排序

    //点击当前列，需要让其他的列的flag存储的值回归到初始值-1，这样再点击其他列才按照升序排列
    for(var k=0;k<oThs.length;k++){
        if(oThs[k]!==this){
            oThs[k].flag=-1;
        }
    }

    _this.flag *= -1; //每一次执行sort，进来第一步就是让flag的值*-1。第一次flag=-1，flag=1 升序 第二次是-1 降序
    ary.sort(function (a, b) {
        //匿名函数 this是window
        var curInn = a.cells[n].innerHTML;
        var nexInn = b.cells[n].innerHTML;
        var curInnNum = parseFloat(a.cells[n].innerHTML);
        var nexInnNum = parseFloat(b.cells[n].innerHTML);
        if (isNaN(curInn) || isNaN(nexInn)) {
            return (curInn.localeCompare(nexInn)) * _this.flag;
        } else {
            return (curInnNum - nexInnNum) * _this.flag;
        }
    });
    //按照ary中的最新顺序，把每一行重新的添加到tBody中
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;

    //按照最新的顺序重新进行隔行变色
    changeBg();
}


/*
 //点击第二列的时候实现排序
 oThs[1].flag = -1;//給当前点击这一列增加自定义属性
 oThs[1].onclick = function () {
 sort.call(oThs[1]);
 //或者sort.call(this);
 }
 */

//所有具有class="cursor"这个样式的列都可以实现点击排序
for (var i = 0; i < oThs.length; i++) {
    var curTh = oThs[i];
    if (curTh.className === "cursor") {
        curTh.index = i; //用来存储索引的
        curTh.flag = -1; //用来实现升降序的
        curTh.onclick = function () {
            sort.call(this, this.index);
        }
    }
}
