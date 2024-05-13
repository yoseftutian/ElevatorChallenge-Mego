const building = document.getElementById("building");
const numFloors = 5;
const elevators = [];
const floorHeight = 117; // גובה קומה בפיקסלים

// Create floors
for (let i = numFloors - 1; i >= 0; i--) {
  const floor = document.createElement("div");
  floor.classList.add("floor");

  const floorNumber = document.createElement("span");
  floorNumber.classList.add("floor-number");
  floorNumber.textContent = i;
  floor.appendChild(floorNumber);

  const callButton = document.createElement("button");
  callButton.classList.add("call-button", "metal", "linear");
  callButton.textContent = "Call Elevator";
  callButton.addEventListener("click", () => callElevator(i));
  floor.appendChild(callButton);

  building.appendChild(floor);
}

// Create elevators
for (let i = 0; i < 2; i++) {
  const elevator = document.createElement("div");
  elevator.classList.add("elevator", "elevator-container"); // הוספת הקלאס "elevator-container"
  elevator.style.backgroundImage = "url('elv.png')";
  elevator.style.transform = `translateY(${(numFloors - 1) * floorHeight}px)`;
  building.appendChild(elevator);
  elevators.push({
    element: elevator,
    currentFloor: numFloors - 1,
    queue: [],
  });
}

// Call elevator function
function callElevator(floor) {
  const callButton = building.querySelectorAll(".call-button")[floor];
  callButton.classList.add("active");

  const closestElevator = elevators.reduce((prevElevator, currentElevator) => {
    const prevDistance = Math.abs((prevElevator.currentFloor - floor) * floorHeight);
    const currentDistance = Math.abs((currentElevator.currentFloor - floor) * floorHeight);
    return prevDistance <= currentDistance ? prevElevator : currentElevator;
  }, elevators[0]);

  closestElevator.queue.push(floor);

  if (!closestElevator.isMoving) {
    processElevatorQueue(closestElevator);
  }
}

// Process elevator queue
function processElevatorQueue(elevator) {
  elevator.isMoving = true;
  const queue = elevator.queue;
  const destinationFloor = queue.shift();
  const distance = Math.abs(elevator.currentFloor - destinationFloor) * floorHeight;
  const duration = distance * 0.5; // 0.5 pixels per millisecond

  moveElevator(elevator.element, destinationFloor, duration)
    .then(() => {
      elevator.currentFloor = destinationFloor;
      const callButton = building.querySelectorAll(".call-button")[destinationFloor];
      callButton.classList.remove("active");
      playDingSound();
      return new Promise((resolve) => setTimeout(resolve, 2000));
    })
    .then(() => {
      if (queue.length > 0) {
        processElevatorQueue(elevator);
      } else {
        elevator.isMoving = false;
      }
    });
}

// Move elevator animation
function moveElevator(elevatorElement, destinationFloor, duration) {
  return new Promise((resolve) => {
    const startPosition = elevatorElement.offsetTop;
    const endPosition = (numFloors - destinationFloor - 1) * floorHeight;
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const interpolatedPosition = startPosition + (endPosition - startPosition) * easeInOutQuad(progress);

      elevatorElement.style.transform = `translateY(${interpolatedPosition}px)`;

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

// Easing function for smooth animation
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Play ding sound
function playDingSound() {
  const audio = new Audio("ding.mp3");
  audio.play();
}

const elevator = document.createElement("div");
elevator.classList.add("elevator", "elevator-container");