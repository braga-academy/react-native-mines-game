import React, {Component} from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import params from './params'
import MineField from './components/MineField'
import Header from './components/Header'
import LevelsSelect from './screens/LevelsSelect'

import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed
} from './functions'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()

    return Math.ceil(cols * rows * params.difficultLevel)
  }

  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()

    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelect: false
    }
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wonGame(board)

    if(lost) {
      showMines(board)
      Alert.alert('Perdeeeeeu!', 'Que buuuuuurro!!')
    }

    if (won) {
      Alert.alert('Parabéns!', 'Você Venceu!')
    }

    this.setState({ board, lost, won })
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if(won) {
      Alert.alert('Parabéns', 'Vocês Venceu!')
    }

    this.setState({ board, won })
  }

  onLevelSelected = level => {
    params.difficultLevel = level

    this.setState(this.createState())
  }

  render() {
    return (
      <View style={styles.container}>
        <LevelsSelect
          isVisible={this.state.showLevelSelect}
          onLevelSelected={this.onLevelSelected}
          onCancel={() => this.setState({ showLevelSelect: false })} />
        <Header flagsLeft={this.minesAmount() - flagsUsed(this.state.board)}
          onNewGame={() => this.setState(this.createState())}
          onFlagPress={() => this.setState({ showLevelSelect: true })}/>
        <View>
          <MineField board={this.state.board}
            onOpenField={this.onOpenField}
            onSelectField={this.onSelectField}/>
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#aaa'
  }
});
