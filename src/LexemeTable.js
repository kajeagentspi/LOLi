import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';



class LexemeTable extends Component{
  constructor(props) {
    super(props);
    this.state = {
      lexemes: []
    }
  }
  componentDidMount() {
    console.log(this.props.lexemes)
   this.updateLexemes();
  }
  updateLexemes(){
    this.setState({lexemes: this.props.lexemes})
  }
  render(){
    return(
      <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Lexeme</Table.HeaderCell>
          <Table.HeaderCell>Classification</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
        <Table.Body>
          {this.state.lexemes.map((lexeme,index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{lexeme[0]}</Table.Cell>
                <Table.Cell>{lexeme[1]}</Table.Cell>
              </Table.Row>
                )
              }
            )
          }
        </Table.Body>
      </Table>
    )
  }

}
export default LexemeTable
