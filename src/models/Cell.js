class Cell {
  constructor(currentValue = 0, x = 0, y = 0, i = 0) {
    this.currentValue = currentValue;
    this.x = x;
    this.y = y;
    this.i = i;
  } 

  setCurrentValue(currentValue) {
    this.currentValue = currentValue;
  }

  setUserEntry(isUserEntry) {
    this.isUserEntry = isUserEntry;
  }

  setPotentialValues(potentialValues = []) { 
    this.potentialValues = potentialValues;
  }

  getPotentialValues() {
    return this.potentialValues;
  }
}

export default Cell;