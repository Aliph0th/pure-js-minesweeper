'use strict';

const BOMB_INDEX = 9;

const formElement = document.getElementById('pre_settings');
let gameController;

formElement.addEventListener('submit', e => {
   e.preventDefault();
   formElement.classList.add('hidden');
   document.getElementById('container').classList.remove('hidden');

   const size = +document.getElementById('size').value;
   const percentage = +document.getElementById('bombs').value;

   gameController = new GameController(size, percentage);
   gameController.startGame();
});
