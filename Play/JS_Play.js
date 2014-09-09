function stepForward(input){
    return input + 1
}
function stepBackward(input){
    return input - 1
}

function chooseStepFunction(backwards){
    return backwards ? stepBackward : stepForward
}



chooseStepFunction();
