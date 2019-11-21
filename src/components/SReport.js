import React, { useState} from 'react';
import { Grid, Button, Divider, Message, Transition, List, Header } from 'semantic-ui-react';

const GRIDS = [
  [
    {x: 1, y: 1, v: 1},
    {x: 5, y: 1, v: 3},
    {x: 7, y: 1, v: 5},
    {x: 8, y: 1, v: 9},
    {x: 1, y: 2, v: 3},
    {x: 4, y: 2, v: 5},
    {x: 8, y: 2, v: 2},
    {x: 2, y: 3, v: 5},
    {x: 4, y: 3, v: 9},
    {x: 6, y: 3, v: 2},
    {x: 7, y: 3, v: 6},
    {x: 8, y: 3, v: 3},
    {x: 9, y: 3, v: 8},
    {x: 1, y: 4, v: 4},
    {x: 2, y: 4, v: 3},
    {x: 4, y: 5, v: 6},
    {x: 6, y: 5, v: 1},
    {x: 8, y: 6, v: 8},
    {x: 9, y: 6, v: 7},
    {x: 1, y: 7, v: 6},
    {x: 2, y: 7, v: 4},
    {x: 3, y: 7, v: 7},
    {x: 4, y: 7, v: 3},
    {x: 6, y: 7, v: 8},
    {x: 8, y: 7, v: 5},
    {x: 2, y: 8, v: 1},
    {x: 6, y: 8, v: 5},
    {x: 9, y: 8, v: 9},
    {x: 2, y: 9, v: 9},
    {x: 3, y: 9, v: 2},
    {x: 5, y: 9, v: 7},
    {x: 9, y: 9, v: 3},
  ],
  [
    {x: 1, y: 1, v: 2},
    {x: 3, y: 1, v: 6},
    {x: 9, y: 1, v: 9},
    {x: 5, y: 2, v: 5},
    {x: 3, y: 3, v: 1},
    {x: 8, y: 3, v: 2},
    {x: 1, y: 4, v: 9},
    {x: 5, y: 4, v: 2},
    {x: 9, y: 4, v: 7},
    {x: 3, y: 5, v: 5},
    {x: 6, y: 5, v: 1},
    {x: 9, y: 5, v: 6},
    {x: 2, y: 6, v: 2},
    {x: 5, y: 6, v: 4},
    {x: 8, y: 6, v: 9},
    {x: 1, y: 8, v: 3},
    {x: 8, y: 8, v: 5},
    {x: 2, y: 9, v: 5},
    {x: 3, y: 9, v: 4},
    {x: 5, y: 9, v: 1},
    {x: 6, y: 9, v: 7},
    {x: 9, y: 9, v: 8},
  ]
]

function SReport(props) {
  const [message, setMesssage] = useState('');

  const resolve = () => {
    setMesssage('');
    const entriesCount = props.sudoku.getEntriesCount();
    if (entriesCount < 17) {
      showMessage('Le nombre minimum de valeurs à saisir est de 17 pour une solution unique');
    } else {
      const solved = props.sudoku.resolve(dispatch, update);
      if (!solved) {
        showMessage('La grille fournie ne peut pas être résolue');
      }
    }
  }

  const update = (sudoku) => {
    // print values on command line
    sudoku.getCells();
  }

  const dispatch = (cells) => {
    props.setCells(cells);
  }

  const showMessage = m => {
    setMesssage(m);
    setTimeout(() => {
      setMesssage('');
    }, 3000);
  }

  const initGrid = () => {
    if (props.sudoku.isSolved()) return;
    const grid = GRIDS[0];
    setTimeout(() => {
      grid.forEach(item => {
        setTimeout(() => {
          props.updateCell(item.x, item.y, item.v)
        });
      });
    }, 1000)
  }

  const reset = () => {
    props.sudoku.reset(dispatch);
  }

  return (
    <section className="SReport">
      <Transition visible={message !== ''} animation='zoom' duration={500}>
        <Message
          error
          compact
          content={message}
        />
      </Transition>
      <Grid columns={3}>
        <Grid.Column>
          <Button secondary onClick={(e) => initGrid()}>Init</Button>
        </Grid.Column>
        <Grid.Column>
          <Button color='green' onClick={(e) => resolve()}>Solve</Button>
        </Grid.Column>
        <Grid.Column>
          <Button onClick={(e) => reset()}>Reset</Button>
        </Grid.Column>
      </Grid>
      {
        props.sudoku && props.sudoku.steps && props.sudoku.steps.length > 0 ? (
          <section>
            <Divider />
            <div className="Steps">
              <Header as='h4'>Steps</Header>
              <List>
                {
                  props.sudoku.steps.map(step => {
                    return (
                      <List.Item key={step.message}>
                        <p>{step.message}</p>
                        <label>{step.type}</label>
                      </List.Item>
                    )
                  })
                }
              </List>
            </div>
          </section>
        ) : (
          <section></section>
        )
      }
    </section>
  )
}

export default SReport;