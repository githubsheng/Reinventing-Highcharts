import {webglUtil} from "./webgl-util";
import {threeModels} from "./three-model";
import {mat4, vec3, mat3, vec4} from "./gl-matrix";
import {convertToCuboidModels, createLabelPlanes} from "./webgl-parse-data";
import {TipControl} from "../Sub/Tip/TipControl";

export const threeDgridWebgl = {
    draw: function(input, canvas, offScreenCanvas, canvasTrigger, tipContainer){
        //glContext and program that are used everywhere.
        let gl;
        let normalProgram;
        let simpleProgram;
        let labelProgram;
        let frameBuffer;

        //variable and statics used for calculating rotation.

        let angleYStart = 0;
        let angleY = input.startAngle; //for demonstration purpose

        //all kinds of matrices.
        let projectionMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let VPMatrix = mat4.create(); //this is static

        //the universal vertices/indices buffers that all objects in this application use
        let buffers;

        //holds the cuboids to be drawn.
        let cuboidList = [];
        //holds the planes to be drawn.
        let planeList = [];

        //flags to controls
        let isStopAnimation = false;

        //for mouse interaction.
        let mouseStartX = 0;
        let mouseStartY = 0; //I will need this for vertical angle adjust and therefore I will keep it for now.
        let mouseX = 0;
        let mouseY = 0;
        let maxAngelPerDrag = Math.PI / 2;

        //tip
        let tipControl = new TipControl(tipContainer, 7, false);
        tipControl.createTip();

        //convert input to the old day format the webgl main uses.
        input.meta = {};
        input.meta.rows = input.series.rows;
        input.meta.columns = input.series.columns;
        input.data = input.series.data;

//          how data looks like after conversion
//            input = {
//                meta : {
//                    "rows" : [ "Apple", "Orange", "Plum", "Pineapple"],
//                    "columns" : [ "Several times per day", "Once per day", "Several times per week" ]
//                },
//
//                data : [ [ 101, 122, 143 ], [ 111, 122, 143 ], [ 91, 112, 153 ], [ 34, 78, 26 ] ]
//            };

        init(input);

        function init(input) {
            gl = webglUtil.createGLContext(canvas);
            //create program for normal rendering.
            normalProgram = webglUtil.createProgram("shader-vertex", "shader-fragment", gl);
            simpleProgram = webglUtil.createProgram("shader-simple-vertex", "shader-simple-fragment", gl);
            labelProgram = webglUtil.createProgram("shader-label-vertex", "shader-label-fragment", gl);
            frameBuffer = webglUtil.createFrameBufferObject(gl);

            console.log("program successfully created");

            gl.enable(gl.DEPTH_TEST);

            cuboidList = convertToCuboidModels(input, tipContainer, 7, false, input.series.focus);
            planeList = createLabelPlanes(input, gl, offScreenCanvas);


            buffers = webglUtil.prepareModelBuffers(gl);

            console.log("model data buffers successfully created.");

            prepareStaticSettingsForNormalProgram();
            prepareStaticSettingsForWireFrameProgram();
            prepareStaticSettingsForLabelProgram();
            console.log("webgl stuffs ready");

            enableMouseInteraction(canvasTrigger);

            drawStatic();
            showAllStaticTip();
        }

        function prepareStaticSettingsForNormalProgram(){
            gl.useProgram(normalProgram);

            //feed the buffers to the shaders
            let aPositionIdx = gl.getAttribLocation(normalProgram, "MCVertex");
            normalProgram.aPositionIdx = aPositionIdx;

            let aNormalIdx = gl.getAttribLocation(normalProgram, "MCNormal");
            normalProgram.aNormalIdx = aNormalIdx;

            //get the matrix indices in the shaders.
            normalProgram.uMVPMatrixIdx = gl.getUniformLocation(normalProgram, "MVPMatrix");
            normalProgram.uNormalMatrixIdx = gl.getUniformLocation(normalProgram, "NormalMatrix");
            normalProgram.uMVMatrixIdx = gl.getUniformLocation(normalProgram, "MVMatrix");

            //projection matrix, view matrix, and VP matrix.
            mat4.perspective(projectionMatrix, Math.PI * 0.2, gl.viewportWidth / gl.viewportHeight, 1, 2000.0);
            mat4.lookAt(viewMatrix, vec3.fromValues(5, 40, 40), vec3.fromValues(0,4,0), vec3.fromValues(0,1,0));
            mat4.multiply(VPMatrix, projectionMatrix, viewMatrix);

            //directional light. I only include directional light here for the sake of simplicity. TODO: adjust the light position
            let ecDirectionalLightOneIdx = gl.getUniformLocation(normalProgram, "ecDirectionalLightPositionOne");
            let wcDirectionalLightPositionOne = vec3.fromValues(-100, 100, 100);
            let ecDirectionalLightPositionOne = vec3.create();
            vec3.transformMat4(ecDirectionalLightPositionOne, wcDirectionalLightPositionOne, viewMatrix);
            gl.uniform3fv(ecDirectionalLightOneIdx, ecDirectionalLightPositionOne);

            let ecDirectionalLightTwoIdx = gl.getUniformLocation(normalProgram, "ecDirectionalLightPositionTwo");
            let wcDirectionalLightPositionTwo = vec3.fromValues(100, -100, 0);
            let ecDirectionalLightPositionTwo = vec3.create();
            vec3.transformMat4(ecDirectionalLightPositionTwo, wcDirectionalLightPositionTwo, viewMatrix);
            gl.uniform3fv(ecDirectionalLightTwoIdx, ecDirectionalLightPositionTwo);

            //material color
            normalProgram.uMaterialColorIdx = gl.getUniformLocation(normalProgram, "materialColor");
            //translucent control
            normalProgram.uIsTranslucentIdx = gl.getUniformLocation(normalProgram, "IsTranslucent");

            //for this order independent blending to work, clear color has to be "white".
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
        }

        function prepareStaticSettingsForWireFrameProgram(){
            gl.useProgram(simpleProgram);
            //feed the buffers to the shaders
            simpleProgram.aPositionIdx = gl.getAttribLocation(simpleProgram, "MCVertex");
            simpleProgram.uMVPMatrixIdx = gl.getUniformLocation(simpleProgram, "MVPMatrix");
            simpleProgram.uMaterialColorIdx = gl.getUniformLocation(simpleProgram, "materialColor");
        }

        function prepareStaticSettingsForLabelProgram(){
            gl.useProgram(labelProgram);
            labelProgram.aPositionIdx = gl.getAttribLocation(labelProgram, "MCVertex");
            labelProgram.aTexCoordIdx = gl.getAttribLocation(labelProgram, "aTexCoord");

            labelProgram.uMVPMatrixIdx = gl.getUniformLocation(labelProgram, "MVPMatrix");
            labelProgram.uSamplerIdx = gl.getUniformLocation(labelProgram, "uSampler");
        }

        function animate(){
            if(!isStopAnimation){
                angleY = angleYStart + (((mouseX - mouseStartX) / 600) * maxAngelPerDrag);
                drawAll();
                requestAnimationFrame(animate);
            }
        }

        function startAnimation(){
            //angleX means rotate around x axis
            isStopAnimation = false;
            angleYStart = angleY;
            animate();
        }

        function stopAnimation(){
            isStopAnimation = true;
        }

        function drawStatic(){
            drawAll();
        }

        function drawAll() {
            //draw all the objects
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            drawAllLabels();
            drawAllCuboids();
            drawAllOutlines();
        }

        function drawAllCuboids(){
            gl.useProgram(normalProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.verticesBuffer);
            gl.vertexAttribPointer(normalProgram.aPositionIdx, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(normalProgram.aPositionIdx);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalsBuffer);
            gl.vertexAttribPointer(normalProgram.aNormalIdx, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(normalProgram.aNormalIdx);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indicesBuffer);

            drawAllNoneTransparentCuboids();
            drawAllSemiTransparentCuboids();
        }

        function drawAllNoneTransparentCuboids(){
            gl.uniform1i(normalProgram.uIsTranslucentIdx, 0);

            if(threeModels.isAnythingFocused()){
                for(let modelIdx in cuboidList) {
                    if(cuboidList[modelIdx].isFocus){
                        drawSingleCuboid(cuboidList[modelIdx], false);
                    }
                }
            } else {
                for(let modelIdx in cuboidList) {
                    drawSingleCuboid(cuboidList[modelIdx], false);
                }
            }
        }

        function drawAllSemiTransparentCuboids(){
            if(threeModels.isAnythingFocused()){
                gl.depthMask(false);
                gl.enable(gl.BLEND);
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
                gl.uniform1i(normalProgram.uIsTranslucentIdx, 1);

                for(let modelIdx in cuboidList) {
                    drawSingleCuboid(cuboidList[modelIdx], true);
                }

                gl.depthMask(true);
                gl.disable(gl.BLEND);
            }
        }

        function drawAllOutlines(){
            gl.useProgram(simpleProgram);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.wireFrameVerticesBuffer);
            gl.vertexAttribPointer(simpleProgram.aPositionIdx, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(simpleProgram.aPositionIdx);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.cubeWireFrameIndicesBuffer);

            for(let modelIdx in cuboidList) {
                drawSingleOutline(cuboidList[modelIdx]);
            }
        }

        function drawAllLabels(){
            gl.useProgram(labelProgram);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.planeVerticesBuffer);
            gl.vertexAttribPointer(labelProgram.aPositionIdx, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(labelProgram.aPositionIdx);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.planeTextureCoordinatesBuffer);
            gl.vertexAttribPointer(labelProgram.aTexCoordIdx, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(labelProgram.aTexCoordIdx);

            gl.activeTexture(gl.TEXTURE0);
            //bind texture happens later in draw single plane.
            gl.uniform1i(labelProgram.uSamplerIdx, 0);   // Pass the texture unit to u_Sampler

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.planeIndicesBuffer);

            for(let modelIdx in planeList){
                drawSinglePlane(planeList[modelIdx]);
            }
        }


        function drawSingleCuboid(model, isSemiTransparent) {
            //upload MVP matrix
            model.calculateModelMatrix(angleY);
            mat4.multiply(model.MVPMatrix, VPMatrix, model.modelMatrix);
            gl.uniformMatrix4fv(normalProgram.uMVPMatrixIdx, false, model.MVPMatrix);

            //upload normal transform matrix
            mat4.multiply(model.MVMatrix, viewMatrix, model.modelMatrix);
            mat3.normalFromMat4(model.normalMatrix, model.MVMatrix);
            gl.uniformMatrix4fv(normalProgram.uMVMatrixIdx, false,  model.MVMatrix);
            gl.uniformMatrix3fv(normalProgram.uNormalMatrixIdx, false, model.normalMatrix);

            //upload the object color
            if(!isSemiTransparent){
                //console.log("draw focused");
                let fillColorArray = model.fillColorArray;
                let fillColor = vec3.fromValues(fillColorArray[0], fillColorArray[1], fillColorArray[2]);
                gl.uniform3fv(normalProgram.uMaterialColorIdx, fillColor);
            }  else {
                let fillColor = vec3.fromValues(1.0, 1.0, 1.0);
                gl.uniform3fv(normalProgram.uMaterialColorIdx, fillColor);
            }

            //draw the cube.
            gl.drawElements(gl.TRIANGLES, buffers.indicesBuffer.numOfIndices, gl.UNSIGNED_BYTE, 0);
        }

        function drawSingleOutline(model){
            //now lets start to draw the wire frame.
            //make use of the mvp matrix that has been calculated.
            let strokeColor;
            if(!model.isFocus && threeModels.isAnythingFocused()){
                strokeColor = vec3.fromValues(0.6, 0.6, 0.6);
            } else {
                strokeColor = vec3.fromValues(0.8, 0.8, 0.8);
            }
            gl.uniformMatrix4fv(simpleProgram.uMVPMatrixIdx, false, model.MVPMatrix);
            gl.uniform3fv(simpleProgram.uMaterialColorIdx, strokeColor);

            gl.drawElements(gl.LINES, buffers.cubeWireFrameIndicesBuffer.numOfIndices, gl.UNSIGNED_BYTE, 0);
        }

        function drawSinglePlane(model){
            model.calculateModelMatrix(angleY);

            mat4.multiply(model.MVPMatrix, VPMatrix, model.modelMatrix);
            gl.uniformMatrix4fv(labelProgram.uMVPMatrixIdx, false, model.MVPMatrix);


            gl.bindTexture(gl.TEXTURE_2D, model.texture);

            gl.drawElements(gl.TRIANGLES, buffers.planeIndicesBuffer.numOfIndices, gl.UNSIGNED_BYTE, 0);
        }

        function pickObject(canvasX, canvasY){
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.useProgram(simpleProgram);//wire frame program seems to perfectly fit in.
            //feed the program with vertices.
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.verticesBuffer);
            gl.vertexAttribPointer(simpleProgram.aPositionIdx, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(simpleProgram.aPositionIdx);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indicesBuffer);

            let selectedModelIdx = -1;
            for (let modelIdx in cuboidList) {
                if(testSingleObject(modelIdx, canvasX, gl.viewportHeight-canvasY/*uv origin is left bottom*/)){
                    selectedModelIdx = modelIdx;
                    break;
                }
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return selectedModelIdx;
        }

        /**
         * texture here use uv coordinates system and the origin of this coordinates system is left bottom.
         * @param idxOfModelToBeTested
         * @param u
         * @param v
         * @returns {boolean}
         */
        function testSingleObject(idxOfModelToBeTested, u, v){
            //frame buffer does not automatically clear itself, do it manually.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            let pixels = new Uint8Array(4); // Array for storing the pixel value

            //draw the target object as red object and everything else black.
            for(let modelIdx in cuboidList){
                let model = cuboidList[modelIdx];
                //directly use the current MVPmatrix
                gl.uniformMatrix4fv(simpleProgram.uMVPMatrixIdx, false, model.MVPMatrix);

                if(modelIdx === idxOfModelToBeTested){
                    let testColor = vec3.fromValues(1.0, 0.0, 0.0); //red.
                    gl.uniform3fv(simpleProgram.uMaterialColorIdx, testColor);
                } else {
                    let testColor = vec3.fromValues(0.0, 0.0, 0.0); //black.
                    gl.uniform3fv(simpleProgram.uMaterialColorIdx, testColor);
                }

                gl.drawElements(gl.TRIANGLES, buffers.indicesBuffer.numOfIndices, gl.UNSIGNED_BYTE, 0);
            }

            gl.readPixels(u, v, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            //check if red
            if(pixels[0] === 255 && pixels[1] === 0 && pixels[2] === 0){
                return true;
            }
        }

        function showTip(MVPMatrix, mcColor, viewPortWidth, viewPortHeight, label, dataY, tipControl){
            let tipPosition = vec4.fromValues(0, 1, 0, 1);
            vec4.transformMat4(tipPosition, tipPosition, MVPMatrix);
            //do perspective division and get normalized device coordinates.
            //the depth value (third) is discarded since I don't need it here.
            let ndc = [tipPosition[0]/tipPosition[3], tipPosition[1]/tipPosition[3]];
            //convert ndc to dom position.
            let domX = ndc[0] * (viewPortWidth / 2) + viewPortWidth / 2;
            let domY = viewPortHeight / 2 -  ndc[1] *  (viewPortHeight / 2);

            tipControl.genericShowDoubleLineTipDataYOnly(domX, domY, label, mcColor, dataY);
        }

        function showAllStaticTip(){
            for(let i = 0; i < cuboidList.length; i ++){
                let model = cuboidList[i];
                if(model.isFocus){
                    showTip(model.MVPMatrix, model.mcColor,  gl.viewportWidth, gl.viewportHeight, model.label, model.dataY, model.staticTipControl);
                }
            }

        }

        function enableMouseInteraction(trigger){

            let dragging = false;

            function getSelectedCuboidIdx(){
                let bb = canvas.getBoundingClientRect();
                let canvasX = mouseX - bb.left;
                let canvasY = mouseY - bb.top;

                return pickObject(canvasX, canvasY);
            }

            function enableMouseTracking(trigger){
                trigger.addEventListener("mousemove", function(event){
                    mouseX = event.clientX;
                    mouseY = event.clientY;
                });
            }

            function enableMouseOverTip(trigger){
                let showTipTimerIdx = -1;
                let lastModelIdx = -1;
                trigger.addEventListener("mouseover", function(event){
                    showTipTimerIdx = window.setInterval(function(){
                        if(dragging){
                            //if still dragging, do nothing.
                            return;
                        }

                        let selectedModelIdx = getSelectedCuboidIdx();
                        if(selectedModelIdx !== -1 && cuboidList[selectedModelIdx].isFocus){
                            //如果对象已经被设置focus了，那么就当没选中任何东西
                            selectedModelIdx = -1;
                        }

                        if(lastModelIdx !== -1 && selectedModelIdx === -1){
                            tipControl.hideTip();
                            lastModelIdx = selectedModelIdx;
                        } else if(lastModelIdx !== selectedModelIdx){
                            let model = cuboidList[selectedModelIdx];
                            showTip(model.MVPMatrix, model.mcColor,  gl.viewportWidth, gl.viewportHeight, model.label, model.dataY, tipControl);
                            lastModelIdx = selectedModelIdx;
                        }

                    }, 1000);
                });

                trigger.addEventListener("mouseout", function(){
                    tipControl.hideTip();
                    window.clearInterval(showTipTimerIdx);
                });
            }

            /**
             * this function only works when 'enableMouseTracking' is called first
             * @param canvas
             */
            function enableModelDragging(trigger){
                trigger.addEventListener("mousedown", function(event){
                    dragging = true;
                    tipControl.hideTipImmediately();

                    mouseStartX = event.clientX;
                    mouseStartY = event.clientY;
                    startAnimation();
                });

                window.addEventListener("mouseup", function(){
                    if(Math.abs(mouseX - mouseStartX) > 3 || Math.abs(mouseY - mouseStartY) > 3){
                        //in this case the user has dragged the chart.
                        dragging = false;
                        stopAnimation();

                        //since when mousedown I have hide all the tips. now its time to show them up again.
                        showAllStaticTip();
                    } else {
                        //the user merely clicks on a cuboid but didn't drag the chart, that means the user wants to focus on the cuboid.
                        //in this case the user has dragged the chart.
                        dragging = false; //this is turned on anyway when mousedown, so turn it off first.
                        stopAnimation();

                        let selectedModelIdx = getSelectedCuboidIdx();
                        if(selectedModelIdx !== -1){
                            let model = cuboidList[selectedModelIdx];
                            if(model.toggleFocus()){
                                showTip(model.MVPMatrix, model.mcColor,  gl.viewportWidth, gl.viewportHeight, model.label, model.dataY, model.staticTipControl);
                            } else {
                                model.staticTipControl.hideTip();
                            }
                            drawStatic();
                        }

                    }
                });
            }

            enableMouseTracking(trigger);
            enableMouseOverTip(trigger);
            enableModelDragging(trigger);
        }
    }
};




