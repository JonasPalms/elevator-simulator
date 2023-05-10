// DOM setup
const floorButtons = document.querySelector('.floor-buttons').children
const floors = document.querySelectorAll('.floor')
const callButtons = document.querySelectorAll('button.down, button.up')

const elevator = document.querySelector('#elevator')

/**
 * Data setup
 */

let currentFloor = 0

function init() {
  setElevatorPosition()
}

function setElevatorPosition() {
  document.documentElement.style.setProperty('--current-floor', currentFloor)
}

/**
 * Setup floor buttons event
 */
Array.from(floorButtons).forEach((floorButton) => {
  floorButton.addEventListener('click', handleFloorClick)
})

function handleFloorClick(e) {
  console.log(e.target.dataset.floor)
}

/* 
  Setup call-buttons events
*/
callButtons.forEach((callButton) =>
  callButton.addEventListener('click', handleCallElevatorClick)
)

function handleCallElevatorClick(e) {
  const floor = e.target.closest('.floor').dataset.floor

  if (currentFloor === floor) return

  e.target.classList.add('clicked')

  const newRequest = {
    calledBy: floor,
    target: floor,
  }

  const hasIdenticalRequest = queue.some(
    (request) => request.target === newRequest.target
  )

  if (!hasIdenticalRequest) moveElevator(newRequest)
}

function moveElevator(request) {
  queue.push(request)
  document.documentElement.style.setProperty('--current-floor', request.target)
}

/* Queue setup */
const queue = new Array()

elevator.addEventListener('transitionend', (e) => {
  const finishedRequest = queue.pop()

  let currentFloor

  floors.forEach((floor) => {
    if (floor.dataset.floor == finishedRequest.target) {
      currentFloor = floor
    }
  })
})

init()
