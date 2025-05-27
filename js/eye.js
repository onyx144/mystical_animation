
  function createEye(x, y, direction = 'up') {
    const container = new PIXI.Container();
    container.x = x;
    container.y = y;
  
    const eyeShape = new PIXI.Graphics();
    eyeShape.lineStyle(2, 0x00ff00);
    eyeShape.beginFill(0x000000);
  
    const width = 60;
    const height = 20;
  
    if (direction === 'up') {
      eyeShape.moveTo(-width / 2, 0);
      eyeShape.quadraticCurveTo(0, -height, width / 2, 0);
      eyeShape.quadraticCurveTo(0, height / 2, -width / 2, 0);
    } else {
      eyeShape.moveTo(-width / 2, 0);
      eyeShape.quadraticCurveTo(0, height, width / 2, 0);
      eyeShape.quadraticCurveTo(0, -height / 2, -width / 2, 0);
    }
  
    eyeShape.endFill();
    container.addChild(eyeShape);
  
    const iris = new PIXI.Graphics();
    iris.beginFill(0x8a2be2);
    iris.drawCircle(0, 0, 10);
    iris.endFill();
    container.addChild(iris);
  
    const pupil = new PIXI.Graphics();
    pupil.beginFill(0x000000);
    pupil.drawCircle(0, 0, 3);
    pupil.endFill();
    iris.addChild(pupil);
  
    app.stage.addChild(container);
  
    return { container, iris };
  }
  
  const eyes = [
    createEye(app.screen.width / 2 - 80, app.screen.height / 2, 'up'),
    createEye(app.screen.width / 2, app.screen.height / 2, 'down'),
    createEye(app.screen.width / 2 + 80, app.screen.height / 2, 'up'),
  ];
  
  // Максимальное смещение зрачка от центра
  const maxIrisOffset = 6;
  
  function moveIris(eye, mouseX, mouseY) {
    // Координаты глаза в глобальных координатах
    const eyePos = eye.container.getGlobalPosition();
  
    // Вектор от центра глаза к мыши
    let dx = mouseX - eyePos.x;
    let dy = mouseY - eyePos.y;
  
    // Ограничим смещение по максимуму
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxIrisOffset) {
      dx = (dx / dist) * maxIrisOffset;
      dy = (dy / dist) * maxIrisOffset;
    }
  
    // Устанавливаем позицию зрачка
    eye.iris.position.set(dx, dy);
  }
  
  // Обработка движения мыши
  window.addEventListener('mousemove', (e) => {
    for (const eye of eyes) {
      moveIris(eye, e.clientX, e.clientY);
    }
  });
  
  // Для сенсорных устройств — палец
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      for (const eye of eyes) {
        moveIris(eye, touch.clientX, touch.clientY);
      }
    }
  });
  
  // Начинаем с зрачками по центру
  for (const eye of eyes) {
    eye.iris.position.set(0, 0);
  }
  
  // Обработка ресайза окна
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  
    eyes[0].container.x = app.screen.width / 2 - 80;
    eyes[0].container.y = app.screen.height / 2;
  
    eyes[1].container.x = app.screen.width / 2;
    eyes[1].container.y = app.screen.height / 2;
  
    eyes[2].container.x = app.screen.width / 2 + 80;
    eyes[2].container.y = app.screen.height / 2;
  });
  