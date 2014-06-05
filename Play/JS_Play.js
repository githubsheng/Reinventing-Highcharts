/**
 * Created by wangsheng on 27/5/14.
 */

function A(){
    this.x = 0;
}

A.prototype.m1 = function(){
    console.log(this instanceof B);
    this.x = 2;
};


function B(){
}

B.prototype = new A();
B.prototype.constructor = B;

var b = new B();
console.log(b.x);
console.log(b.hasOwnProperty("x"));
b.m1();
console.log(b.x);
console.log(b.hasOwnProperty("x"));
var b2 = new B();
console.log(b2.x);
console.log(b2.hasOwnProperty("x"));