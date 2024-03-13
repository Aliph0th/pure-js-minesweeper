'use strict';

class GameView {
   #fieldElement = document.getElementById('field');
   #flagsElement = document.getElementById('flags');
   #finalScreen = document.getElementById('end_game_screen');
   #finalTextElement = document.getElementById('end_game_text');
   #containerElement = document.getElementById('container');
   #formElement = document.getElementById('pre_settings');

   #cells = [];

   createField(
      size,
      callbackClick,
      callbackMark,
      callbackHighlight
   ) {
      this.#fieldElement.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
      for (let i = 0; i < size; i++) {
         const cellRow = [];
         for (let j = 0; j < size; j++) {
            const newCell = document.createElement('div');
            newCell.classList.add('cell');
            newCell.addEventListener('click', () => callbackClick(i, j));
            newCell.addEventListener('contextmenu', e => callbackMark(e, i, j));
            newCell.addEventListener('mousedown', () => callbackHighlight(i, j, true));
            newCell.addEventListener('mouseup', () => callbackHighlight(i, j, false));
            newCell.addEventListener('mouseleave', () => callbackHighlight(i, j, false));
            cellRow.push(newCell);
            this.#fieldElement.appendChild(newCell);
         }
         this.#cells.push(cellRow);
      }
   }

   setFlagsText(text) {
      this.#flagsElement.innerHTML = text;
   }

   setMarked(x, y, state) {
      this.#cells[x][y].innerText = state ? '🚩' : '';
   }

   showFinalScreen(isWin) {
      const bgColor = isWin ? '#3baf2796' : '#af272796';
      const text = isWin ? 'Вы победили 👌' : 'Вы проиграли 💥';

      this.#finalScreen.classList.remove('hidden');
      this.#finalScreen.style.backgroundColor = bgColor;
      this.#finalTextElement.innerText = text;
   }
   hideFinalScreen() {
      this.#finalScreen.classList.add('hidden');
   }

   openCell(x, y, value) {
      const cell = this.#cells[x][y];
      let text = '';
      if (value === BOMB_INDEX) {
         text = '💣';
      } else if (value > 0) {
         text = value;
         cell.classList.add(`color-${value}`);
      }
      cell.classList.add('opened');
      cell.innerText = text;
   }

   closeCell(x, y, isMarked) {
      const cell = this.#cells[x][y];
      cell.classList.remove('opened');
      if (isMarked) {
         cell.innerText = '🚩';
      }
   }

   showSettingsForm() {
      this.#formElement.classList.remove('hidden');
   }
   hideSettingsForm() {
      this.#formElement.classList.add('hidden');
   }

   showGameContainer() {
      this.#containerElement.classList.remove('hidden');
   }
   hideGameContainer() {
      this.#containerElement.classList.add('hidden');
   }

   removeAllCells() {
      this.#fieldElement.innerHTML = '';
      this.#cells = [];
   }
}
