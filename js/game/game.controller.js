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
   }

   startGame() {
      this.#model.hideSettingsForm();
      this.#model.showGameContainer();
      this.#model.createField(
         this.#size,
         this.#handleCellClick.bind(this),
         this.#handleCellMark.bind(this)
      );
      this.#model.setFlagsText(`🚩: 0/${this.#bombsCount}`);

      document
         .getElementById('restart')
         .addEventListener('click', this.#reset.bind(this));
   }

   #createField(x, y) {
      const field = Array(this.#size)
         .fill()
         .map(() => Array(this.#size).fill(0));
      let currentCount = 0;
      while (currentCount < this.#bombsCount) {
         const a = Math.floor(Math.random() * this.#size);
         const b = Math.floor(Math.random() * this.#size);
         if (!field[a][b] && x !== a && y !== b) {
            field[a][b] = BOMB_INDEX;
            currentCount++;
         }
      }
      return calculateFieldValues(field, this.#size).map(row =>
         row.map(value => ({ value, isMarked: false, isOpened: false }))
      );
   }

   #handleCellClick(x, y) {
      if (!this.#field) {
         this.#field = this.#createField(x, y);
      }
      const cell = this.#field?.[x]?.[y];
      if (cell?.value === BOMB_INDEX) {
         this.#finishGame(false);
      } else if (!cell?.isMarked) {
         this.#openAvaiableCells(x, y);
         this.#checkWin();
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

   #checkWin() {
      if (
         this.#size ** 2 - this.#openedCellsCount === this.#markedCellsCount &&
         this.#markedCellsCount === this.#bombsCount
      ) {
         this.#finishGame(true);
      }
   }

   #finishGame(isWin) {
      this.#model.showFinalScreen(isWin);
      if (!isWin) {
         this.#showBombs();
      }
   }

   #showBombs() {
      this.#field.forEach((row, x) =>
         row.forEach((cell, y) => {
            if (cell.value === BOMB_INDEX) {
               this.#model.setMarked(x, y, false);
               this.#model.openCell(x, y, cell.value);
            }
         })
      );
   }

   #handleCellMark(e, x, y) {
      e.preventDefault();
      const cell = this.#field?.[x]?.[y];
      if (cell && !cell.isOpened) {
         if (cell.isMarked) {
            cell.isMarked = false;
            this.#markedCellsCount--;
         } else {
            cell.isMarked = true;
            this.#markedCellsCount++;
            this.#checkWin(true);
         }
         this.#model.setMarked(x, y, cell.isMarked);
         this.#model.setFlagsText(`🚩: ${this.#markedCellsCount}/${this.#bombsCount}`);
      }
   }

   #reset() {
      this.#model.removeAllCells();
      this.#model.hideFinalScreen();
      this.#model.hideGameContainer();
      this.#model.showSettingsForm();
   }
}
