/*
    Author : Sanjaykumar Rathod
*/



alert("Basic Calculator Pro\n\nWelcomes you\u{1F60A}\nTry it,\nUpvote it if you have liked it.\nReport \u{1F41E} in the comment.");


// try to evaluate the function as user is typing

window.onload = function() {
    var expr = document.getElementById("expr");
    var cal = ""; // to store the java expression
    var ans_value = ""; // to store the answer
    // answer input box
    var answer = document.getElementById("answer");
    
    // All Clear
    var ac = document.getElementById("AC");
    ac.onclick = function() {
        expr.value = ""; 
        cal = "";
        answer.value = "";
    }
    
    // DELete a char from exression
    var del = document.getElementById("DEL");
    del.onclick = function(){
        // delete ANS number
        if (expr.value.endsWith("ANS")) {
            expr.value = expr.value.slice(0, expr.value.length - 3);
            cal = cal.slice(0, cal.length - ans_value.length - 2)
        }
        // delete % expression
        else if (expr.value.endsWith("%")) {
            expr.value = expr.value.slice(0, expr.value.length - 1);
            cal = cal.slice(0, cal.length - 5)
        }
        // delete a number or operator
        else {
            expr.value = expr.value.slice(0, expr.value.length - 1);
            cal = cal.slice(0, cal.length - 1)
        }
        answer.value = evaluate();
    }
    
    // taked value of previously evaluated expression.
    var ans = document.getElementById("ans");
    ans.onclick = function() {
        if (ans_value != "") {
            expr.value += "ANS";
            cal += "(" + ans_value +")";
            answer.value = evaluate(); // calling this, ans_value becomes 0, look later.
        }
    }
    
    // operators
    
    var div = document.getElementById("div");
    div.onclick = function() {
        // if there is number at the end, just append it
        
        checkOp("/", "÷");
        answer.value = evaluate();    
    }
    var mult = document.getElementById("mult");
    mult.onclick = function() {
        checkOp("*", "×");
        answer.value = evaluate();
    }
    var sub  = document.getElementById("sub");
    sub.onclick = function() {
        checkOp("-", "-");
        answer.value = evaluate();
    }
    var add = document.getElementById("add");
    add.onclick = function() {
        checkOp("+", "+");
        answer.value = evaluate();
    }
    
    var plumin = document.getElementById("plumin");
    plumin.onclick = function() {
        let rare = "";
        let pattern = /\b[0-9]+\.?[0-9]*$/;
        if (pattern.test(expr.value)) {
            rare = pattern.exec(expr.value).toString();
            front_expr = expr.value.slice(0, expr.value.length - rare.length);
            front_cal = cal.slice(0, cal.length - rare.length);
            expr.value = front_expr + "(-"+ rare +")";
            cal = front_cal + "(-"+ rare +")";
        }
        
        else if (/\(-[0-9]+\.?[0-9]*\)$/.test(expr.value)) {
            rare = /\(-[0-9]+\.?[0-9]*\)$/.exec(expr.value).toString();
            front_expr = expr.value.slice(0, expr.value.length - rare.length);
            front_cal = cal.slice(0, cal.length - rare.length);
            expr.value = front_expr + /[0-9]+\.?[0-9]*/.exec(rare).toString();
            cal = front_cal + /[0-9]+\.?[0-9]*/.exec(rare).toString();
        }
    }
    
    var percent = document.getElementById("percent");
    percent.onclick = function() {
        expr.value += "%";
        cal += "*0.01";
        answer.value = evaluate();
    }
    
    // Numbers
    var zero = document.getElementById("zero");
    zero.onclick = function() {
         if (/\.[0-9]*$/.test(expr.value) || /\b[1-9]+0*$/.test(expr.value)) {
             insert(0);
         }
         else if (/.*\b0$/.test(expr.value)) {
             expr.value += "";
             cal += "";
         }
         else {
             insert(0);
         }
    }
    var one = document.getElementById("one");
    one.onclick = function() {
        insert(1);
        //answer.value = evaluate();
    }
    var two = document.getElementById("two");
    two.onclick = function() {
        insert(2);
        //answer.value = evaluate();
    }
    var three = document.getElementById("three");
    three.onclick = function() {
        insert(3);
        //answer.value = evaluate();
    }
    var four = document.getElementById("four");
    four.onclick = function() {
        insert(4);
    }
    var five = document.getElementById("five");
    five.onclick = function() {
        insert(5);
    }
    var six = document.getElementById("six");
    six.onclick = function() {
        insert(6);
    }
    var seven = document.getElementById("seven");
    seven.onclick = function() {
        insert(7);
    }
    var eight = document.getElementById("eight");
    eight.onclick = function() {
        insert(8);
    }
    var nine = document.getElementById("nine");
    nine.onclick = function() {
        insert(9);
    }
    
    var dot = document.getElementById("dot");
    dot.onclick = function() {
        if (/^$|[\+\-×÷]$/.test(expr.value)) {
            expr.value += "0.";
            cal += "0.";
        }
        else if (/\b[0-9]+\.{1}[0-9]*$/.test(expr.value)){
            expr.value += "";
            cal += "";
        }
        else {
            expr.value += ".";
            cal += ".";
        }
    }
    
    var lparen = document.getElementById("lparen");
    lparen.onclick = function() {
        if (/.*[0-9]+\)?$/.test(expr.value)) {
            expr.value += "×(";
            cal += "*(";
        }
        else {
            expr.value += "(";
            cal += "(";
        }
    }
    
    var rparen = document.getElementById("rparen");
    rparen.onclick = function() {
        expr.value += ")";
        cal += ")";
    }
    
    equals = document.getElementById("equals");
    equals.onclick = function() {
        if (expr.value.length > 0) {
            answer.value = evaluate();
            if (answer.value != "Error") {
                ans_value = answer.value;
            }
            else {
                ans_value = "";
            }
            expr.value = "";
            cal = "";
        }
        else if (answer.value.length > 0 && answer.value != "Error") {
            expr.value = answer.value;
            cal = expr.value;
            answer.value = evaluate();
        }
        else {
            answer.value = "";
            cal = "";
            expr.value = "";         
       }
    }
    
    // function to evaluate string as user types
    
    
    function evaluate() {
        if (expr.value.length == 0) {
            return "";
        }
        // taking care of erratic syntax
        if (isError()) {
            return "Error";
        }
        
        
        // taking care of parenthesis
        let cal_pat = "";
        pattern = /.*\b\)*/;
        try {
            cal_pat = pattern.exec(cal).toString();
        }
        catch {
            return "Error";
        } 
        
        let lparen_count = 0;
        let rparen_count = 0;
        if (cal.length == cal_pat.length) {
            if (/\(|\)/.test(cal_pat)) {
                try {
                let lpar = cal_pat.match(/\(/g);
                lparen_count = lpar.length;
                }
                catch {
                    lparen_count = 0;
                }
                try {
                    let rpar = cal_pat.match(/\)/g);
                    rparen_count = rpar.length;
                }
                catch {
                    rparen_count = 0;
                }
                if (lparen_count > rparen_count) {
                let temp_cal = cal + ")".repeat(lparen_count - rparen_count);     
                    try {
                        return eval(temp_cal);
                    }
                    catch {
                        return "Error";
                    }
                }
                else if (lparen_count < rparen_count) {
                let temp_cal = "(".repeat(rparen_count - lparen_count) + cal;
            
                    try {
                        return eval(temp_cal);
                    }
                    catch {
                        return "Error";
                    }
                }
                else {
                    try {
                        return eval(cal);
                    }
                    catch {
                        return "Error";
                    }
                }
            }
            else {
                try {
                    return eval(cal);
                }
                catch {
                    return "Error";
                }
            }
        }
        else if (cal.length != cal_pat.length){
            try {
                return eval(cal);
            }
            catch {
                return "Error";
            }
        }
    }
    
    
    // function for debugging
    function test(string) {
        var tst = document.getElementsByClassName("test");
        tst[0].innerHTML = string+"<br><hr>" + tst[0].innerHTML ;
    }
    
    function insert(num) {
        if (expr.value.endsWith(")") || expr.value.endsWith("%")) {
            expr.value += "×" + num;
            cal += "*" + num;
        }
        else {
            expr.value += num;
            cal += num;
        }
        answer.value = evaluate();
    }
    
    
    
    function checkOp(op, dop) {
    // try not to add an operator when a string ends with operator
    // takes 4 arguments, 
    // uses expr.value : expression input : global
    // uses cal : cal expression : global
    // op : actual java operator
    // dop : display operator
        // if exprValue does not end with operator
        /*
        if (/^[\+\-×÷]/.test(expr.value)) {
            test("checking");
        // do not take initial /, *
            //if (op == "+" || op == "-"){
                cal = op;
                expr.value = dop;
            //}
        } */
        // check if the there is opening parenthesis at the end
        if (/\($/.test(cal)) {
            if (op == "+" || op == "-"){
                cal += op;
                expr.value += op;
            }
        }
        // 
        else if (/.*[0-9]+$|ANS$|\.$|%$|\)$/.test(expr.value)) {        
             expr.value += dop;
             cal += op;
        // if there is operator at the end
        }
        else {
             expr.value = expr.value.slice(0, expr.value.length - 1) + dop;
             cal = cal.slice(0, cal.length - 1) + op;
        }
    }
    
    function isError() {
        // expression has +% like syntax
        if (/[\+\-÷×]+%+|^%+|%\./g.test(expr.value) || /^\/.*\/$/.test(cal)) {
            //test ("error like +%");
            return true;
        }
        // ANS. like syntax
        if (/ANS\./g.test(expr.value)) {
            //test ("error like ANS.");
            return true;
        }
        
        // ANS123 or 123ANS like syntax
        if (/[1-9]+ANS|ANS[0-9]+|SA/g.test(expr.value)) {
            //test ("error like ANS123");
            return true;
        }
     }
}
