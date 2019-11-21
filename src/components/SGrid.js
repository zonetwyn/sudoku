import React, { useState, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import SModal from './SModal';
import Cell from '../models/Cell';

const values = [0,1,2,3,4,5,6,7,8,9];

function SGrid(props) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      try {
        const value = Number(event.key);
        if (!values.includes(value)) return;
        if (cell.i !== 0) {
          const updated = props.updateCell(cell.x, cell.y, value);
          if (updated) setCell(initCell());
          else setOpen(true);
        }
      } catch (error) { }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  const [open, setOpen] = useState(false);
  const initCell = () => new Cell(0, 0, 0, 0);
  const [cell, setCell] = useState(initCell());
  const selectCell = c => {
    setCell(c);
  }
  const closeModal = () => {
    setOpen(false);
  }

  const displayGrid = () => {
    const grid = [];
    for (let j=1; j<=9; j++) {
      for (let i=1; i<=9; i++) {
        const c = props.sudoku.getCell(i, j);
        grid.push({
          view: (
            <Grid.Column key={''+c.x+''+c.y}>
              {
                c.currentValue === 0 ? (
                  <Button basic onClick={() => selectCell(c)}>
                    <label>{c.currentValue}</label>
                  </Button>
                ) : (
                  c.isUserEntry ? (
                    <Button onClick={() => selectCell(c)}>
                      <label>{c.currentValue}</label>
                    </Button>
                  ) : (
                    <Button color='green'>
                      <label>{c.currentValue}</label>
                    </Button>
                  )
                )
              }
            </Grid.Column>
          )
        })
      }
    }
    return grid;
  }

  
  return (
    <section className="Sudoku">
      <Grid> 
        {
          props.sudoku && props.sudoku.cells ? (
            <Grid.Row columns="9">
              {
                displayGrid().map(a => {
                  return a.view;
                })
              }
            </Grid.Row>
          ) : (
            <div></div>
          )
        }
      </Grid>
      <SModal modalOpen={open} onHide={() => closeModal()} />
    </section>
  )
}

export default SGrid;