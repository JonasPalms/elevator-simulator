// DOM setup
const floorButtons = document.querySelector('.floor-buttons').children
const floors = document.querySelectorAll('.floor')
const shafts = document.getElementsByClassName('shaft')
const callButtonsQuerySelector = 'button.down, button.up'
const callButtons = document.querySelectorAll(callButtonsQuerySelector)
const elevator = document.querySelector('#elevator')

/**
 * Data setup
 */
let currentFloor = 0
let nextFloor
let currentFloorNode = floors.item(floors.length - 1)
const queue = new Array()

function init() {
  setElevatorPosition(currentFloor)
}

function setElevatorPosition(floor) {
  document.documentElement.style.setProperty('--current-floor', floor)
}

/**
 * Setup floor buttons event
 */
Array.from(floorButtons).forEach((floorButton) => {
  floorButton.addEventListener('click', handleFloorClick)
})

function handleFloorClick(e) {
  e.target.classList.add('clicked')
  const targetFloor = e.target.dataset.floor

  const newRequest = {
    calledBy: currentFloor,
    target: targetFloor,
  }

  if (currentFloor == targetFloor) {
    setTimeout(() => e.target.classList.remove('clicked'), 1000)
    return
  }

  const hasIdenticalRequest = queue.some(
    (request) => request.target === newRequest.target
  )

  if (!hasIdenticalRequest) pushRequest(newRequest)
}

/* 
  Setup call-buttons events
*/
callButtons.forEach((callButton) =>
  callButton.addEventListener('click', handleCallElevatorClick)
)

function handleCallElevatorClick(e) {
  const selectedFloor = e.target.closest('.floor').dataset.floor

  e.target.classList.add('clicked')

  if (currentFloor == selectedFloor) {
    setTimeout(() => e.target.classList.remove('clicked'), 1000)
    return
  }

  const newRequest = {
    calledBy: selectedFloor,
    target: selectedFloor,
  }

  const hasIdenticalRequest = queue.some(
    (request) => request.target === newRequest.target
  )

  if (!hasIdenticalRequest) pushRequest(newRequest)
}

function pushRequest(request) {
  queue.push(request)
  if (queue.length === 1) {
    setElevatorPosition(request.target)
  }
}

/* Queue setup */
elevator.addEventListener('transitionend', (e) => {
  if (e.target !== elevator) return

  const finishedRequest = queue.shift()

  currentFloor = finishedRequest.target

  currentFloorNode = Array(...floors).find((floor) => {
    return floor.dataset.floor == currentFloor
  })

  currentFloorNode.querySelector('.shaft').classList.add('open')

  // remove clicked classes
  currentFloorNode
    .querySelectorAll(callButtonsQuerySelector)
    .forEach((button) => button.classList.remove('clicked'))

  Array(...floorButtons).forEach((button) => {
    if (button.dataset.floor == currentFloor) {
      button.classList.remove('clicked')
    }
  })

  // Handle next request if it exists
  if (queue.length) {
    console.log(queue[0].target)
    setElevatorPosition(queue[0].target)
  }
})

elevator.addEventListener('transitionrun', (e) => {
  if (e.target !== elevator) return
  currentFloorNode.querySelector('.shaft').classList.remove('open')
})

init()
