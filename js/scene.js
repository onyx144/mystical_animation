document.addEventListener('DOMContentLoaded', () => {
  if (typeof PIXI === 'undefined') {
    console.error('PIXI is not loaded!');
    return;
  }
  console.log(PIXI.filters);

  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000, // Фиолетовый фон
    antialias: true
  });
  
  document.body.appendChild(app.view);
  
  // Создаем контейнер для тумана
  const fogContainer = new PIXI.Container();
  app.stage.addChildAt(fogContainer, 0);

  // Создаем частицы тумана
  const particles = [];
  const numParticles = 80; // Увеличиваем количество частиц

  for (let i = 0; i < numParticles; i++) {
    const particle = new PIXI.Graphics();
    
    // Создаем сложную форму для частицы тумана
    const width = 250 + Math.random() * 150; // Увеличиваем размер
    const height = 200 + Math.random() * 100;
    
    // Создаем градиентную заливку серого цвета
    particle.beginFill(0x808080, 0.2); // Серый цвет с небольшой прозрачностью
    
    // Рисуем неправильную форму для более естественного вида
    particle.moveTo(-width/2, 0);
    particle.quadraticCurveTo(
      -width/4, -height/2,
      0, -height/3
    );
    particle.quadraticCurveTo(
      width/4, -height/2,
      width/2, 0
    );
    particle.quadraticCurveTo(
      width/4, height/2,
      0, height/3
    );
    particle.quadraticCurveTo(
      -width/4, height/2,
      -width/2, 0
    );
    
    particle.endFill();
    
    // Распределяем частицы по всему экрану при создании
    particle.x = Math.random() * (app.screen.width + 500) - 250;
    particle.y = Math.random() * app.screen.height;
    
    // Скорость и направление - преимущественно вправо
    particle.vx = 0.3 + Math.random() * 0.2; // Более медленное движение вправо
    particle.vy = (Math.random() - 0.5) * 0.1; // Меньшее вертикальное движение
    
    // Масштаб
    particle.scale.set(0.8 + Math.random() * 0.4);
    
    // Добавляем размытие
    particle.filters = [new PIXI.filters.BlurFilter(30)]; // Увеличиваем размытие для более плавного вида
    
    fogContainer.addChild(particle);
    particles.push(particle);
  }

  // Анимация тумана
  app.ticker.add(() => {
    particles.forEach(particle => {
      // Обновляем позицию
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Очень плавное вертикальное движение
      particle.y += Math.sin(Date.now() * 0.0002 + particle.x) * 0.1;
      
      // Фиксированная прозрачность без мерцания
      particle.alpha = 0.2;
      
      // Возвращаем частицы, которые ушли за пределы экрана
      if (particle.x > app.screen.width + 300) {
        particle.x = -300 - Math.random() * 500;
        particle.y = Math.random() * app.screen.height;
      }
    });
  });
  
  const SYMBOLS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ'];
  ;
  
  function createSymbol() {
    const symbol = new PIXI.Text(
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      {
        fontFamily: 'Arial',
        fontSize: 30 + Math.random() * 40,
        fill: 0xffffff,
        align: 'center'
      }
    );
  
    symbol.anchor.set(0.5);
    symbol.x = Math.random() * app.screen.width;
    symbol.y = Math.random() * app.screen.height;
    symbol.alpha = 0;
    symbol.scale.set(0.5);
  
    app.stage.addChild(symbol);
  
    let time = 0;
  
    const ticker = new PIXI.Ticker();
    ticker.add((delta) => {
      time += delta;
  
      // Дрожание
      symbol.x += (Math.random() - 0.5) * 3;
      symbol.y += (Math.random() - 0.5) * 3;
  
      // Пульсация
      const scale = 0.8 + Math.sin(time * 0.05) * 0.5;
      symbol.scale.set(scale);
  
      // Появление / исчезновение
      if (time < 20) {
        symbol.alpha += 0.05;
      } else if (time > 100) {
        symbol.alpha -= 0.02;
        if (symbol.alpha <= 0) {
          ticker.stop();
          app.stage.removeChild(symbol);
        }
      }
    });
  
    ticker.start();
  }
  
  // Появление символов каждые 500 мс
  setInterval(() => {
    createSymbol();
  }, 500);
  
  // Обработка ресайза окна
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
  
  function createEye(x, y, direction = 'up') {
    const container = new PIXI.Container();
    container.x = x;
    container.y = y;
  
    const eyeShape = new PIXI.Graphics();
    eyeShape.lineStyle(2, 0x00ff00);
    eyeShape.beginFill(0x000000);
  
    const width = 60;
    const height = 80;
  
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

});
  
//loock
