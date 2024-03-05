function calculateFieldValues(field, size) {
   return field.map((row, i) => row.map((x, j) => {
      if (x === BOMB_INDEX) {
         return x;
      }
      let count = 0;

      for (let x = i - 1; x <= i + 1; x++) {
         for (let y = j - 1; y <= j + 1; y++) {
            if (field?.[x]?.[y] === BOMB_INDEX) {
               count++;
            }
         }
      }

      return count;
   }))
}
