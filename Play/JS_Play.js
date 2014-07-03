/**
 * Created by wangsheng on 27/5/14.
 */

function A(){
    this.lala = "a";
}

A.prototype.m1 = function(){
    console.log(this.lala);
};

function B(){
    this.lala = "b";
}

B.prototype = new A();
B.prototype.constructor = B;

B.prototype.m1 = function(){
    A.prototype.m1.call(this);
};

var a = new Array(3);
console.log(a);
console.log(a.length);