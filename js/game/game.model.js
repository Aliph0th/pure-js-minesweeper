'use strict';

class GameModel {
   #fieldElement = document.getElementById('field');
   #flagsElement = document.getElementById('state');
   #cells = [];

   createField(size, callbackClick, callbackMark) {
      this.#fieldElement.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
      for (let i = 0; i < size; i++) {
         const cellRow = [];
         for (let j = 0; j < size; j++) {
            const newCell = document.createElement('div');
            newCell.classList.add('cell');
            newCell.addEventListener('click', () => callbackClick(i, j));
            newCell.addEventListener('contextmenu', e => callbackMark(e, i, j));
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

   openCell(x, y, value) {
      const cell = this.#cells[x][y];
      let text;
      if (value === BOMB_INDEX) {
         text = '💣'
      } else if (value === 0) {
         text = ''
      } else {
         text = value;
         cell.classList.add(`color-${value}`);
      }
      cell.classList.add('opened');
      cell.innerText = text;
   }
}
