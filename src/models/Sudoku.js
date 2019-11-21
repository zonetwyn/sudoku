import Cell from './Cell';

class Sudoku {
  constructor() {
    this.init();
  }

  init() {
    // Generate cells
    const cells = [];
    for (let i=1; i<=9; i++) {
      for (let j=1; j<=9; j++) {
        cells.push(new Cell(0, i, j, this.getBlockIndex(i, j)));
      }
    }
    this.cells = cells;
    this.error = false;
    this.steps = [];
  }

  getBlockIndex(i = 0, j = 0) {
    let index = 1;
    if ((i >= 1 && i <= 3)) {
      if (j >= 1 && j <= 3) index = 1;
      else if (j >= 4 && j <= 6) index = 4;
      else if (j >= 7 && j <= 9) index = 7;
    } else if (i >= 4 && i <= 6) {
      if (j >= 1 && j <= 3) index = 2;
      else if (j >= 4 && j <= 6) index = 5;
      else if (j >= 7 && j <= 9) index = 8;
    } else if (i >= 7 && i <= 9) {
      if (j >= 1 && j <= 3) index = 3;
      else if (j >= 4 && j <= 6) index = 6;
      else if (j >= 7 && j <= 9) index = 9;
    }

    return index;
  }

  isValueValid(x, y, value) {
    let valid = true;
    const i = this.getBlockIndex(x, y);
    for (let k=0; k<this.cells.length; k++) {
      if (this.cells[k].x === x || this.cells[k].y === y || this.cells[k].i === i) {
        if (this.cells[k].currentValue === value) {
          valid = false;
          break;
        }
      }
    }
    return valid;
  }

  updateAllCells(cellArray) {
    for (let k=0; k<cellArray.length; k++) {
      this.updateCell(cellArray[k].x, cellArray[k].y, cellArray[k].currentValue);
    }
  }

  setCell(x = 0, y = 0, value) {
    this.cells = this.cells.map(cell => {
      if (cell.x === x && cell.y === y) {
        const newCell = new Cell(value, cell.x, cell.y, cell.i);
        newCell.setUserEntry(true);
        return newCell;
      } else return cell;
    });
  }

  reset(dispatch) {
    this.cells = this.cells.map(cell => {
      cell.setPotentialValues([]);
      cell.currentValue = 0;
      cell.setUserEntry(false);
      return cell;
    });
    if (this.steps.length > 0) {
      this.setSteps([]);
    }
    this.error = false;
    dispatch(this.cells);
  }

  updateCell(x = 0, y = 0, value) {
    if (value !== 0) {
      const valid = this.isValueValid(x, y, value);
      if (!valid) return false;
    }

    this.cells = this.cells.map(cell => {
      if (cell.x === x && cell.y === y) {
        const newCell = new Cell(value, cell.x, cell.y, cell.i);
        newCell.setUserEntry(true);
        return newCell;
      } else return cell;
    });

    return true;
  }

  getEntriesCount() {
    let count = 0;
    for (let i=0; i<this.cells.length; i++) {
      if (this.cells[i].currentValue !== 0 && this.cells[i].isUserEntry) count++;
    }
    return count;
  }

  getCellArray() {
    return this.cells;
  }

  getCells(dispatch) {
    let grid = '';
    const array = [];
    for (let j=1; j<=9; j++) {
      let row = '';
      for (let i=1; i<=9; i++) {
        const cell = this.getCell(i, j);
        array.push(cell);
        if (row.length < 17) {
          if (row.length < 16) row += cell.currentValue + ' ';
          else {
            row += String(cell.currentValue)
            grid += row + '\n';
            row = '';
          }
        }
      }
    }
    console.log(grid);
    if (dispatch && typeof dispatch === 'function') dispatch(array);
  }

  getCell(i, j) {
    const cell = this.cells.find((cell) => {
      return (cell.x === i && cell.y === j);
    });
    return cell;
  }

  getPotentialValues(cell) {
    const values = [];
    for (let i=1; i<=9; i++) {
      // check presence
      let xPresents = false, yPresents = false, iPresents = false;
      for (let k=0; k<this.cells.length; k++) {
        const c = this.cells[k];
        // row
        if (c.x === cell.x) {
          if (c.currentValue === i) {
            xPresents = true;
          }
        }
        // col
        if (c.y === cell.y) {
          if (c.currentValue === i) {
            yPresents = true;
          }
        }
        // block
        if (c.i === cell.i) {
          if (c.currentValue === i) {
            iPresents = true;
          }
        }
        if (xPresents || yPresents || iPresents) break;
      }
      if (!xPresents && !yPresents && !iPresents) values.push(i);
    }
    return values;
  }

  // check if sudoku does not contains empty cell
  isSolved() {
    let solved = true;
    for (let k=0; k<this.cells.length; k++) {
      if (this.cells[k].currentValue === 0) {
        solved = false;
        break;
      }
    }
    return solved;
  }

  setSteps(steps) {
    this.steps = steps;
  }

  setCells(cells) {
    this.cells = cells;
  }

  setError(error) {
    this.error = error;
  }


  // resolve grid
  resolve(dispatch, update) {
    // Get potential values
    this.setError(false);
    let validGrid = true;
    for (let i=1; i<=9; i++) {
      for (let j=1; j<=9; j++) {
        const cell = this.getCell(i, j);
        if (cell.currentValue === 0) {
          const values = this.getPotentialValues(cell);
          if (values.length === 0) {
            validGrid = false;
            break;
          } else {
            cell.setPotentialValues(values);
          }
        }
      }
    }

    if (!validGrid) {
      this.setError(true);
      return false;
    }

    // Resolve
    while (!this.isSolved()) {
      let nearestOneFound = false;
      for (let k=0; k<this.cells.length; k++) {
        if (this.cells[k].currentValue === 0) {
          // Find the nearest one with one potential value
          if (this.cells[k].potentialValues.length === 1) {
            this.cells[k].setCurrentValue(this.cells[k].potentialValues[0]);
            this.cells[k].setPotentialValues([]);
            this.updateGrid(this.cells[k]);
            nearestOneFound = true;
            const steps = [...this.steps, {
              level: 1,
              type: 'Cellule avec une seule valeur potentielle',
              message: `Cellule [${this.cells[k].x}, ${this.cells[k].y}] résolue avec la valeur ${this.cells[k].currentValue}`
            }];
            this.setSteps(steps);
            dispatch(this.cells);
            break;
          }
        }
      }
      if (!nearestOneFound) {
        let rowValueFound = false, colValueFound = false, blockValueFound = false;
        for (let k=0; k<this.cells.length; k++) {
          if (this.cells[k].currentValue === 0) {
            const cell = this.cells[k];
            const rowValue = this.getValue(cell, 'x');
            if (rowValue !== -1) {
              this.cells[k].setCurrentValue(rowValue);
              this.cells[k].setPotentialValues([]);
              this.updateGrid(this.cells[k]);
              rowValueFound = true;
              const steps = [...this.steps, {
                level: 2,
                type: 'Unique cellule possédant la valeur potentielle dans la ligne',
                message: `Cellule [${this.cells[k].x}, ${this.cells[k].y}] résolue avec la valeur ${this.cells[k].currentValue}`
              }];
              this.setSteps(steps);
              dispatch(this.cells);
              break;
            }
            const colValue = this.getValue(cell, 'y');
            if (colValue !== -1) {
              this.cells[k].setCurrentValue(colValue);
              this.cells[k].setPotentialValues([]);
              this.updateGrid(this.cells[k]);
              colValueFound = true;
              const steps = [...this.steps, {
                level: 2,
                type: 'Unique cellule possédant la valeur potentielle dans la colonne',
                message: `Cellule [${this.cells[k].x}, ${this.cells[k].y}] résolue avec la valeur ${this.cells[k].currentValue}`
              }];
              this.setSteps(steps);
              dispatch(this.cells);
              break;
            }
            const blockValue = this.getValue(cell, 'i');
            if (blockValue !== -1) {
              this.cells[k].setCurrentValue(blockValue);
              this.cells[k].setPotentialValues([]);
              this.updateGrid(this.cells[k]);
              blockValueFound = true;
              const steps = [...this.steps, {
                level: 2,
                type: 'Unique cellule possédant la valeur potentielle dans le bloc',
                message: `Cellule (${this.cells[k].x}, ${this.cells[k].y}) résolue avec la valeur ${this.cells[k].currentValue}`
              }];
              this.setSteps(steps);
              dispatch(this.cells);
              break;
            }
          }
        }

        // Brute force
        if (!rowValueFound && !colValueFound && !blockValueFound) {
          // Which means our algorithm was not be able to resolve this grid :(
          const steps = [...this.steps, {
            level: 3,
            type: 'Brute force',
            message: 'La grille a été résolue par brute force; le resultat sera uniquement disponible sur la console via l\'outil d\'inspection'
          }];
          this.setSteps(steps);
          forceResolve(this, update);
          break;
        }
      }
    }

    return true;
  }

  getValue(cell, type) {
    let value = -1;
    const values = cell.potentialValues;
    for (let l=0; l<values.length; l++) {
      let presents = false;
      for (let m=0; m<this.cells.length; m++) {
        if (this.cells[m].currentValue === 0) {
          if (this.cells[m].x === cell.x && this.cells[m].y === cell.y) continue;
          else {
            if (type === 'x') {
              if (this.cells[m].x === cell.x) {
                if (this.cells[m].potentialValues.includes(values[l])) {
                  presents = true;
                }
              }
            } else if (type === 'y') {
              if (this.cells[m].y === cell.y) {
                if (this.cells[m].potentialValues.includes(values[l])) {
                  presents = true;
                }
              }
            } else if (type === 'i') {
              if (this.cells[m].i === cell.i) {
                if (this.cells[m].potentialValues.includes(values[l])) {
                  presents = true;
                }
              }
            }
          }
        }
      }
      if (!presents) {
        value = values[l];
        break;
      }
    }
    return value;
  }

  updateGridCell(cell) {
    for (let k=0; k<this.cells.length; k++) {
      if (this.cells[k].x === cell.x && this.cells[k].y === cell.y) {
        this.cells[k].currentValue = cell.currentValue;
      }
    }
  }

  updateGrid(cell) {
    for (let k=0; k<this.cells.length; k++) {
      if (this.cells[k].currentValue === 0) {
        let values = this.cells[k].potentialValues;
        if (cell.x === this.cells[k].x) {
          const index = values.indexOf(cell.currentValue);
          if (index !== -1) values.splice(index, 1);
        }
        if (cell.y === this.cells[k].y) {
          const index = values.indexOf(cell.currentValue);
          if (index !== -1) values.splice(index, 1);
        }
        if (cell.i === this.cells[k].i) {
          const index = values.indexOf(cell.currentValue);
          if (index !== -1) values.splice(index, 1);
        }
        this.cells[k].potentialValues = values;
      }
    }
  }
}

function forceResolve(sudoku, update) {
  try {
    if (sudoku.isSolved()) {
      console.clear();
      update(sudoku);
    }
  
    let cell;
    for (let i=1; i<=9; i++) {
      for (let j=1; j<=9; j++) {
        const c = sudoku.getCell(i, j);
        if (c.currentValue === 0) {
          cell = c;
          break;
        }
      }
    }
  
    const potentialValues = sudoku.getPotentialValues(cell);
    for (let i=0; i<potentialValues.length; i++) {
      cell.setCurrentValue(potentialValues[i]);
      sudoku.updateGridCell(cell);
      forceResolve(sudoku, update);
    }
    // backtracking
    cell.setCurrentValue(0);
    sudoku.updateGridCell(cell);
  } catch (error) {
  }
}

export default Sudoku;
