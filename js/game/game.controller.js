'use strict';

class GameController {
   #view = new GameView();
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
      this.#view.hideSettingsForm();
      this.#view.showGameContainer();
      this.#view.createField(
         this.#size,
         this.#handleCellClick.bind(this),
         this.#handleCellMark.bind(this),
         this.#toggleHighlightSurroundingCells.bind(this)
      );
      this.#view.setFlagsText(`🚩: 0/${this.#bombsCount}`);

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

   #toggleHighlightSurroundingCells(x, y, highlight) {
      const cell = this.#field?.[x]?.[y];
      if (!cell || !cell?.isOpened) {
         return;
      }
      for (let i = -1; i <= 1; i++) {
         for (let j = -1; j <= 1; j++) {
            const nearCell = this.#field?.[x + i]?.[y + j];
            if (nearCell && (i || j) && !nearCell.isOpened) {
               if (highlight) {
                  this.#view.openCell(x + i, y + j);
               } else {
                  this.#view.closeCell(x + i, y + j, nearCell.isMarked);
               }
            }
         }
      }
   }

   #handleCellClick(x, y) {
      if (!this.#field) {
         this.#field = this.#createField(x, y);
      }
      const cell = this.#field?.[x]?.[y];
      if (!cell) {
         return;
      }
      if (cell.value === BOMB_INDEX && !cell.isMarked) {
         this.#finishGame(false);
      } else if (!cell.isMarked) {
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
         this.#view.openCell(x, y, cell.value);

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
      this.#view.showFinalScreen(isWin);
      if (!isWin) {
         this.#showBombs();
      }
   }

   #showBombs() {
      this.#field.forEach((row, x) =>
         row.forEach((cell, y) => {
            if (cell.value === BOMB_INDEX) {
               this.#view.setMarked(x, y, false);
               this.#view.openCell(x, y, cell.value);
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
         this.#view.setMarked(x, y, cell.isMarked);
         this.#view.setFlagsText(`🚩: ${this.#markedCellsCount}/${this.#bombsCount}`);
      }
   }

   #reset() {
      this.#view.removeAllCells();
      this.#view.hideFinalScreen();
      this.#view.hideGameContainer();
      this.#view.showSettingsForm();
   }
}
