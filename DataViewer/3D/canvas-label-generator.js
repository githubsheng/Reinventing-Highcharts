/**
 * Created by wangsheng on 22/7/14.
 */

var canvasLabelGenerator = {

    ctx : null,
    width: 1500,
    height: 40,
    create: function(offScreenCanvas){
        if(this.ctx === null){
            offScreenCanvas.width = this.width; //make it wide enough so that I can render whatever text i want.
            offScreenCanvas.height = this.height; //should be enough if the font size is 20px.
            this.ctx = offScreenCanvas.getContext("2d");
        }
        return this;
    },

    generateLabelImageDataBasedOnText: function(text){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "black";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        var textWidth = this.ctx.measureText(text).width + 10;//plus 10 to allow some buffer...
        this.ctx.fillText(text, textWidth/2, this.height/2);

        return {
            imageData: this.ctx.getImageData(0, 0, textWidth, this.height),
            textWidth: textWidth,
            textHeight: this.height
        };
    }
};
