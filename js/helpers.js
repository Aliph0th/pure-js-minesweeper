function loopAround(fn) {
   for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
         fn(i, j);
      }
   }
}

function calculateFieldValues(field) {
   return field.map((row, i) =>
      row.map((x, j) => {
         if (x === BOMB_INDEX) {
            return x;
         }
         let count = 0;

         loopAround((x, y) => {
            if (field?.[i - x]?.[j - y] === BOMB_INDEX) {
               count++;
            }
         });

         return count;
      })
   );
}
