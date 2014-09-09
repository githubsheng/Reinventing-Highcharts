function stepForward(input: number): number {
    return input + 1;
}
function stepBackward(input: number): number {
    return input - 1;
}

function chooseStepFunction(backwards: boolean): (input: number) => number {
    return backwards ? stepBackward : stepForward;
}

chooseStepFunction(true)(1);