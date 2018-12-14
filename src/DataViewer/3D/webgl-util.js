var webglUtil = {
    createGLContext: function(canvas){
        var gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        return gl;
    },

    createProgram: function(vertexShaderId, fragmentShaderId, gl){
        var program = gl.createProgram();
        var shaders = this.loadShadersFromHTML(vertexShaderId, fragmentShaderId, gl);
        gl.attachShader(program, shaders.vertexShader);
        gl.attachShader(program, shaders.fragmentShader);
        gl.linkProgram(program);
        return program;
    },

    loadShadersFromHTML: function(vertexShaderId, fragmentShaderId, gl){
        var vertexShaderSource = document.getElementById(vertexShaderId).innerHTML.trim();
        var fragmentShaderSource = document.getElementById(fragmentShaderId).innerHTML.trim();

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
        if (!compiled) {
            console.log("Failed to compile vertex shader");
        }

        var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
        if (!compiled) {
            console.log("Failed to compile fragment shader");
        }

        return {
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        };
    },

    prepareElementBuffer: function(modelIndices, gl){
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        buffer.numOfIndices = modelIndices.length;
        return buffer;
    },

    prepareArrayBuffer: function(data, gl){
        // Create a buffer object
        var buffer = gl.createBuffer();
        // Write date into the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    },

    prepareLabelTexture: function(imageData, gl) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            imageData);

        //following settings are necessary cos Im using a NPOT texture.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    },

    prepareModelBuffers: function(gl){
        var cubeVertices = new Float32Array([
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
            1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
            1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 ]);

        var cubeNormals = new Float32Array([
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 ]);

        var cubeIndices = new Uint8Array([
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23 ]);


        // Create a wire frame
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
        var cubeWireFrameVertices = new Float32Array([
            1.001,  1.001,  1.001, // v0
            -1.001,  1.001,  1.001,// v1
            -1.001, -1.001,  1.001,// v2
            1.001, -1.001,  1.001, // v3
            1.001, -1.001, -1.001, // v4
            1.001,  1.001, -1.001, // v5
            -1.001,  1.001, -1.001,// v6
            -1.001, -1.001, -1.001// v7
        ]);

        var cubeWireFrameIndices = new Uint8Array([
            0, 1, 1, 6, 6, 5, 5, 0, //top wire frame lines
            1, 2, 6, 7, 5, 4, 0, 3, //four vertical wire frame lines
            3, 2, 2, 7, 7, 4, 4, 3 //bottom wire frame lines.
        ]);

        //  plane indices and text coordinates. The vertices for each plane is different.
        //    v4------v3
        //   /        /
        //  v1------v2

        var planeVertices = new Float32Array([
            -1.0, 0.0, 1.0, //v1
            1.0, 0.0, 1.0, //v2
            1.0, 0.0, -1.0, //v3
            -1.0, 0.0, -1.0 //v4
        ]);

        //counter clock wise
        var planeIndices = new Uint8Array([
            0, 1, 2,
            2, 3, 0
        ]);

        var planeTextureCoordinates = new Float32Array([
            0.0, 0.0, //for v1
            1.0, 0.1, //for v2
            1.0, 1.0, //for v3
            0.0, 1.0 //for v4
        ]);


        var verticesBuffer = this.prepareArrayBuffer(cubeVertices, gl);
        var normalsBuffer = this.prepareArrayBuffer(cubeNormals, gl);
        var indicesBuffer = this.prepareElementBuffer(cubeIndices, gl);
        var wireFrameVerticesBuffer = this.prepareArrayBuffer(cubeWireFrameVertices, gl);
        var cubeWireFrameIndicesBuffer = this.prepareElementBuffer(cubeWireFrameIndices, gl);
        var planeVerticesBuffer = this.prepareArrayBuffer(planeVertices, gl);
        var planeIndecesBuffer = this.prepareElementBuffer(planeIndices, gl);
        var planeTextureCoordinatesBuffer = this.prepareArrayBuffer(planeTextureCoordinates, gl);

        return {
            verticesBuffer: verticesBuffer,
            normalsBuffer: normalsBuffer,
            indicesBuffer: indicesBuffer,
            wireFrameVerticesBuffer: wireFrameVerticesBuffer,
            cubeWireFrameIndicesBuffer: cubeWireFrameIndicesBuffer,
            planeVerticesBuffer: planeVerticesBuffer,
            planeIndicesBuffer: planeIndecesBuffer,
            planeTextureCoordinatesBuffer: planeTextureCoordinatesBuffer
        };
    },

    createFrameBufferObject: function(gl) {
        var frameBuffer = gl.createFramebuffer();

        //create and configure texture.
        var texture = gl.createTexture();
        //gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //it seems that this texture needs to be a square. Thats why width here equals to height.
        //Also the webgl can draw everything in it no matter what size you choose (it can scale, even though your on screen width/height radio is not the same).
        //I choose 512 * 512 hoping that it can provide enough accuracy. If too small, image get low resolution, and you cannot get accurate information by reading pixel from that texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.viewportWidth, gl.viewportHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        //allows for NPOT texture.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
        
        //create and configure render buffer
        var depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.viewportWidth, gl.viewportHeight);

        // Attach the texture and the renderbuffer object to the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        // Unbind the buffer object
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return frameBuffer;
    }
};