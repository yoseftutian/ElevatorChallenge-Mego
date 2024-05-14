// הגדרת מספר הקומות והמעליות
const numFloors = 10;
const numElevators = 2;

// יצירת אובייקטים למעליות
const elevators = Array.from({ length: numElevators }, () => ({
  currentFloor: 1,
  targetFloor: null,
  isMoving: false,
}));

// יצירת אלמנטי HTML לבניין
const buildingDiv = document.getElementById('building');

// יצירת קומות ופקדים
for (let i = numFloors; i >= 1; i--) {
  const floor = document.createElement('div');
  floor.classList.add('floor');
  floor.style.height = '110px';

  const button = document.createElement('button');
  button.classList.add('metal', 'linear');
  button.textContent = `Floor ${i}`;
  button.addEventListener('click', () => callElevator(i));
  floor.appendChild(button);

  buildingDiv.appendChild(floor);
}

// יצירת מעליות
for (let i = 0; i < numElevators; i++) {
  const elevator = document.createElement('img');
  elevator.src = 'elv.png';
  elevator.classList.add('elevator');
  elevator.style.bottom = '0';
  buildingDiv.appendChild(elevator);
}

// פונקציה לקריאת מעלית
function callElevator(floor) {
  const availableElevator = elevators.find(
    (elevator) => !elevator.isMoving && elevator.targetFloor === null
  );

  if (availableElevator) {
    availableElevator.targetFloor = floor;
    moveElevator(availableElevator);
  } else {
    const buttons = document.querySelectorAll(`.floor:nth-child(${numFloors - floor + 1}) button`);
    buttons.forEach((button) => {
      button.style.color = 'green';
      let countdown = 10; // זמן המתנה לדוגמה
      const interval = setInterval(() => {
        button.textContent = `Floor ${floor} (${countdown})`;
        countdown--;
        if (countdown === 0) {
          clearInterval(interval);
          button.style.color = '';
          button.textContent = `Floor ${floor}`;
          callElevator(floor); // הזמנת מעלית שוב אם אין פנויה
        }
      }, 1000);
    });
  }
}

// פונקציה לתזוז מעלית
function moveElevator(elevator) {
  elevator.isMoving = true;
  const elevatorImg = document.querySelectorAll('.elevator')[elevators.indexOf(elevator)];
  const targetFloor = elevator.targetFloor;
  const distance = Math.abs(elevator.currentFloor - targetFloor);
  const duration = distance * 500; // 500ms לכל קומה

  let currentTime = 0;
  const interval = setInterval(() => {
    currentTime += 50; // עדכון מיקום כל 50ms
    const progress = currentTime / duration;
    const currentFloor =
      elevator.currentFloor < targetFloor
        ? elevator.currentFloor + Math.floor(progress * distance)
        : elevator.currentFloor - Math.floor(progress * distance);

    elevatorImg.style.bottom = `${(currentFloor - 1) * 117}px`; // עדכון מיקום המעלית

    if (currentTime >= duration) {
      clearInterval(interval);
      elevator.currentFloor = targetFloor;
      elevator.targetFloor = null;
      elevator.isMoving = false;
      const audio = new Audio('ding.mp3');
      audio.play();
      setTimeout(() => {
        callElevator(elevator.currentFloor); // קריאה למעלית הבאה
      }, 2000);
    }
  }, 50);
}