'use strict';

class GameController {
   #model = new GameModel();
   #size;
   #bombsCount;
   #field;
   #openedCellsCount = 0;
   #markedCellsCount = 0;

   constructor(size, bombsPercentage) {
      this.#size = size;
      this.#bombsCount = Math.ceil((size ** 2 * bombsPercentage) / 100);
      this.#field = this.#createField();
   }

   startGame() {
      this.#model.createField(
         this.#size,
         this.#handleCellClick.bind(this),
         this.#handleCellMark.bind(this)
      );
   }

   #createField() {
      const field = Array(this.#size)
         .fill()
         .map(() => Array(this.#size).fill(0));
      let currentCount = 0;
      while (currentCount < this.#bombsCount) {
         const x = Math.floor(Math.random() * this.#size);
         const y = Math.floor(Math.random() * this.#size);
         if (!field[x][y]) {
            field[x][y] = BOMB_INDEX;
            currentCount++;
         }
      }
      return calculateFieldValues(field, this.#size).map(row =>
         row.map(value => ({ value, isMarked: false, isOpened: false }))
      );
   }

   #handleCellClick(x, y) {
      const cell = this.#field?.[x]?.[y];
      if (cell?.value === BOMB_INDEX) {
         console.log('bob');
      } else if (!cell?.isMarked) {
         this.#openAvaiableCells(x, y);
      }
   }

   #openAvaiableCells(x, y) {
      const cell = this.#field?.[x]?.[y];
      if (cell && !cell.isOpened) {
         cell.isOpened = true;
         this.#openedCellsCount++;
         if (cell.isMarked) {
            cell.isMarked = false;
            this.#markedCellsCount--;
         }
         this.#model.openCell(x, y, cell.value);

         if (!cell.value) {
            for (let i = -1; i <= 1; i++) {
               for (let j = -1; j <= 1; j++) {
                  if (i || j) {
                     this.#openAvaiableCells(x + i, y + j);
                  }
               }
            }
         }
      }
   }

   #handleCellMark(e, x, y) {
      e.preventDefault();
      const cell = this.#field[x][y];
      if (!cell.isOpened) {
         cell.isMarked = !cell.isMarked;
         this.#model.setMarked(x, y, cell.isMarked);
      }
   }
}
