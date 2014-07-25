var threeModels = (function(){
    function CuboidModel(translate/* [x,y,z] */, scale, mcColor, dataY, rowName, columnName, htmlContainer, staticTipControlTopShift, isStaticTipControlSingleLine) {
        this.translate = translate;
        this.scale = scale;
        this.modelMatrix = mat4.create();
        this.MVMatrix = mat4.create();
        this.MVPMatrix = mat4.create();
        this.normalMatrix = mat3.create();
        this.isFocus = false;
        this.identityMatrix = mat4.create();

        this.mcColor = mcColor;
        this.fillColorArray = colors.convertToWebGLcolorArray(mcColor.fillColor);
        this.strokeColorArray = colors.convertToWebGLcolorArray(mcColor.strokeColor);

        this.label = rowName ;
        this.dataY = columnName + " -- " + dataY;
        this.staticTipControl = new StaticTipControl(htmlContainer, staticTipControlTopShift, isStaticTipControlSingleLine);
        this.staticTipControl.createTip();
    }

    CuboidModel.prototype.calculateModelMatrix = function(angleY) {
        // calculate the model's model matrix and save it.
        mat4.rotate(this.modelMatrix, this.identityMatrix, angleY, [0,1,0]/*auto rotate around Y axis*/);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.translate);
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
    };

    var numOfFocus = 0;
    function isAnythingFocused(){
        return numOfFocus !== 0;
    }

    CuboidModel.prototype.toggleFocus = function(){
        if(this.isFocus){
            this.cancelFocus();
        } else {
            this.setFocus();
        }
        return this.isFocus;
    };

    CuboidModel.prototype.setFocus = function(){
        numOfFocus++;
        this.isFocus = true;
    };

    CuboidModel.prototype.cancelFocus = function(){
        numOfFocus--;
        this.isFocus = false;
    };

    function PlaneModel(translate,  scale, isReverse/*to tell whether I should display the text up side down.*/){
        this.translate = translate;
        this.modelMatrix = mat4.create();
        this.MVMatrix = mat4.create();
        this.MVPMatrix = mat4.create();
        this.identityMatrix = mat4.create();
        this.scale = scale;
        this.texture = null;
    }

    PlaneModel.prototype.connectWithTexture = function(imageData, gl){
        this.texture = webglUtil.prepareLabelTexture(imageData, gl);
    };

    PlaneModel.prototype.calculateModelMatrix = function(angleY){
        // calculate the model's model matrix and save it.
        mat4.rotate(this.modelMatrix, this.identityMatrix, angleY, [0,1,0]/*auto rotate around Y axis*/);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.translate);
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
    };

    return {
        CuboidModel: CuboidModel,
        isAnythingFocused: isAnythingFocused,
        PlaneModel: PlaneModel
    }
})();




