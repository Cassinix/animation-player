
(function fn() {
  const AppDomElements = {
    paintTool: document.getElementById('paint-tool'),
    addFrameButton: document.getElementById('add-frame-button'),
    deleteFrameButton: document.getElementById('frame-delete'),
    copyFrameButton: document.getElementById('frame-copy'),
    moveFrameButton: document.getElementById('frame-move'),
    framesList: document.getElementById('frame-list'),
    mainCanvas: document.getElementById('main-canvas'),
    previewCanvas: document.getElementById('preview-canvas'),
    fpsInput: document.getElementById('fps-input'),
    fpsOutput: document.getElementById('fps-output'),
  };

  const MainCanvasData = {
    paintingAllowed: false,
    isDrowing: false,
    context: AppDomElements.mainCanvas.getContext('2d'),
    penColor: '#c4c4c4',
  };

  const PreviewCanvasData = {
    previewContext: AppDomElements.previewCanvas.getContext('2d'),
    animationSpeed: AppDomElements.fpsOutput.value,
    order: 0,
  };

  const storage = [];

  AppDomElements.fpsInput.addEventListener('input', () => {
    AppDomElements.fpsOutput.value = AppDomElements.fpsInput.value;
    PreviewCanvasData.animationSpeed = AppDomElements.fpsOutput.value;
    clearInterval(timer);
    animate();
  });

  AppDomElements.paintTool.addEventListener('click', () => {
    if (!MainCanvasData.paintingAllowed) {
      AppDomElements.paintTool.style.boxShadow = '0px 0px 13px 4px rgba(255,252,80,1)';
      AppDomElements.paintTool.style.backgroundColor = '#fffc50';
      MainCanvasData.paintingAllowed = true;
    } else if (MainCanvasData) {
      AppDomElements.paintTool.style.boxShadow = '0px 0px 0px 0px rgba(255,252,80,1)';
      AppDomElements.paintTool.style.backgroundColor = MainCanvasData.penColor;
      MainCanvasData.paintingAllowed = false;
    }
  });


  function updateFrames() {
    const framesNumbers = document.getElementsByClassName('frame-number');
    for (let i = 0; i < framesNumbers.length; i += 1) {
      framesNumbers[i].textContent = (i + 1);
    }
    const frames = document.getElementsByClassName('frame');
    for (let i = 0; i < frames.length; i += 1) {
      frames[i].style.backgroundImage = storage[i];
    }
  }

  function deleteFrame(frame) {
    const frameIndex = frame.childNodes[0].childNodes[0].textContent - 1;
    storage.splice(frameIndex, 1);
    frame.remove();
    updateFrames();
  }

  function copyFrame(frame) {
    const frameIndex = frame.childNodes[0].childNodes[0].textContent - 1;
    const img = storage[frameIndex];
    storage.splice(frameIndex, 0, img);
    createFrame(frameIndex, img);
    updateFrames();
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      AppDomElements.previewCanvas.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  AppDomElements.previewCanvas.addEventListener('click', () => {
    toggleFullScreen();
  });

  function startDrawing(e) {
    MainCanvasData.isDrawing = true;
    MainCanvasData.context.lineWidth = 15;
    MainCanvasData.context.lineCap = 'round';
    MainCanvasData.context.strokeStyle = '#920c0c';
    MainCanvasData.context.beginPath();
    const x = e.pageX - AppDomElements.mainCanvas.offsetLeft;
    const y = e.pageY - AppDomElements.mainCanvas.offsetTop;
    MainCanvasData.context.moveTo(x, y);
  }

  function draw(e) {
    if (MainCanvasData.isDrawing && MainCanvasData.paintingAllowed) {
      const x = e.pageX - AppDomElements.mainCanvas.offsetLeft;
      const y = e.pageY - AppDomElements.mainCanvas.offsetTop;
      MainCanvasData.context.lineTo(x, y);
      MainCanvasData.context.stroke();
    }
  }

  function stopDrawing() {
    MainCanvasData.isDrawing = false;
  }

  function clearCanvas() {
    MainCanvasData.context.clearRect(0, 0, 700, 700);
  }

  AppDomElements.mainCanvas.onmousedown = startDrawing;
  AppDomElements.mainCanvas.onmouseup = stopDrawing;
  AppDomElements.mainCanvas.onmouseout = stopDrawing;
  AppDomElements.mainCanvas.onmousemove = draw;

  function createFrame(frameIndex, img) {
    const listItem = document.createElement('li');
    AppDomElements.framesList.appendChild(listItem);
    const frameDiv = document.createElement('div');
    frameDiv.className = 'frame';
    listItem.appendChild(frameDiv);

    const frameNumber = document.createElement('div');
    frameNumber.className = 'frame-detail frame-number';
    frameNumber.textContent = (frameIndex);
    frameDiv.appendChild(frameNumber);

    const deleteFrameButton = document.createElement('div');
    deleteFrameButton.className = 'frame-detail frame-delete';
    deleteFrameButton.innerHTML = '<i class="fas fa-trash-alt">';
    deleteFrameButton.addEventListener('click', () => {
      deleteFrame(listItem);
    });
    frameDiv.appendChild(deleteFrameButton);

    const moveFrameButton = document.createElement('div');
    moveFrameButton.className = 'frame-detail frame-move';
    moveFrameButton.innerHTML = '<i class="fas fa-arrows-alt">';
    frameDiv.appendChild(moveFrameButton);

    const copyFrameButton = document.createElement('div');
    copyFrameButton.className = 'frame-detail frame-copy';
    copyFrameButton.innerHTML = '<i class="fas fa-copy">';
    copyFrameButton.addEventListener('click', () => {
      copyFrame(listItem);
    });
    frameDiv.appendChild(copyFrameButton);

    frameDiv.style.backgroundImage = `url(${img})`;
    storage.push(`url(${img})`);
  }

  AppDomElements.addFrameButton.addEventListener('click', () => {
    const frameIndex = document.getElementsByClassName('frame').length + 1;
    const img = AppDomElements.mainCanvas.toDataURL();
    createFrame(frameIndex, img);

    clearCanvas();
  });

  let timer;
  function animate() {
    /*
    requestAnimationFrame(animate);
    AppDomElements.previewCanvas.style.backgroundImage = storage[Math.round(PreviewCanvasData.order / PreviewCanvasData.animationSpeed)];
    if (PreviewCanvasData.order < (storage.length) * PreviewCanvasData.animationSpeed) {
      PreviewCanvasData.order += 1;
    } else {
      PreviewCanvasData.order = 0;
    }
    */
   timer = setInterval(() => {
       if (PreviewCanvasData.order < storage.length) {
        AppDomElements.previewCanvas.style.backgroundImage = storage[PreviewCanvasData.order];
        PreviewCanvasData.order++;
        if (PreviewCanvasData.order === storage.length) {
          PreviewCanvasData.order = 0;
         }
       }
       console.log(Math.round(1000 / PreviewCanvasData.animationSpeed));
   }, Math.round(1000 / PreviewCanvasData.animationSpeed));
  }
  animate();
}());
