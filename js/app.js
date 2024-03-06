'use strict';

const BOMB_INDEX = 9;

let gameController;

document.getElementById('pre_settings').addEventListener('submit', e => {
   e.preventDefault();
   const size = +document.getElementById('size').value;
   const percentage = +document.getElementById('bombs').value;
   gameController = new GameController(size, percentage);
   gameController.startGame();
});
