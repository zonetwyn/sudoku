import React, { Component } from 'react';
import './App.css';
import { Header, Container, Grid, Message } from 'semantic-ui-react';
import SGrid from './components/SGrid';
import SReport from './components/SReport';
import Sudoku from './models/Sudoku';

class App extends Component {
  state = {
    sudoku: null,
    cells: []
  }

  componentDidMount() {
    this.initSudoku();
  }

  // Create new instance of sudoku
  initSudoku = () => {
    this.setState({
      sudoku: new Sudoku()
    })
  }

  setCells = (items) => {
    let cells = this.state.cells;
    if (cells.length === 0) {
      this.setState({
        cells: items
      });
      return;
    }

    cells = cells.map(cell => {
      for (let i=0; i<items.length; i++) {
        if (items[i].x === cell.x && items[i].y === cell.y) {
          cell.currentValue = items[i].currentValue;
          break;
        }
      }
      return cell;
    });
    this.setState({
      cells: cells
    })
  }

  updateCell = (x, y, value) => {
    const grid = this.state.sudoku;
    const updated = grid.updateCell(x, y, value);
    this.setState({
      sudoku: grid
    });
    return updated;
  }

  render() {
    const { sudoku, cells } = this.state;

    return (
      <div className="App f-h">
        <header>
          <Header as='h1'><span className="logo"><i className="fas fa-border-all"></i> SUDOKU</span> SOLVER</Header>
        </header>
        <section className="Tips">
          <Container>
            <Message info>
              <Message.Header>Notes du développeur</Message.Header>
              <p>L'algorithme a été pensé pour une méthode de résolution à solution unique. De ce fait, suivant les études internationales, le nombre minimal d'entrées est de <b>17</b>. Vous pouvez consulter plus d'informations via le lien <a href="https://www.technologyreview.com/s/426554/mathematicians-solve-minimum-sudoku-problem/" target="_blank" rel="noopener noreferrer">Sudoku Review</a></p>
              <p>Pour rentrer une valeur, cliquer sur la case puis pressez la touche du clavier correspondante</p>
              <p>Le bouton <b>Init</b> permet de de charger une grille prédéfinie</p>
            </Message>
          </Container>
        </section>
        <section>
          <Container className="Main">
            <Grid>
              <Grid.Column width={10}>
                <SGrid sudoku={sudoku} updateCell={this.updateCell} />
              </Grid.Column>
              <Grid.Column width={6}>
                <SReport sudoku={sudoku} updateCell={this.updateCell} setCells={this.setCells} />
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      </div>
    );
  }
}

export default App;
