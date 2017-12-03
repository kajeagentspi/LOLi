import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Button, TextArea, Table, Grid } from 'semantic-ui-react';
import { parser } from './scripts/lexical.js';
import { syntax } from './scripts/syntax.js';


var divStyle = {
  background: "#eee",
  padding: "20px",
  margin: "20px",
  height: "500px"
};

class MainWindow extends Component{
  constructor(props) {
    super(props);
    this.state = {
      input: 'HAI\nO RLY?\nYA RLY                   BTW if\nVISIBLE "FUCK0i"\nO RLY?\nYA RLY                   BTW if\nVISIBLE "FUCK1ii"\nNO WAI                   BTW else\nVISIBLE "SHIT1ie"\nOIC\nNO WAI                   BTW else\nVISIBLE "SHIT0e"\nO RLY?\nYA RLY                   BTW if\nVISIBLE "FUCK1ei"\nNO WAI                   BTW else\nVISIBLE "SHIT1ee"\nOIC\nOIC\nKTHXBYE',
      lexemes: [],
      output: '',
      symbolTable: {}
    }
    this.inputChange = this.inputChange.bind(this);
    this.outputChanger = this.outputChanger.bind(this);

    this.updateTables = this.updateTables.bind(this);
    this.loadFile = this.loadFile.bind(this);
  }

  loadFile(e,load){
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => this.setState({ input: reader.result })
    try {
      reader.readAsText(input.files[0]);
    } catch (e) {
      console.log('No File Selected');
    }
  }


  inputChange(e){
    this.setState({input: e.target.value})
  }
  outputChanger(output){
    this.setState({output:output},()=>{
      console.log(this.state.output);
    })
  }
  updateTables(){
    const lexemes=parser(this.state.input)
    this.setState({lexemes: lexemes})
    syntax(this.outputChanger,this.state.symbolTable, lexemes)
    // console.log(this.state);

    // this.setState({output: output})
    // console.log(this.state.symbolTable);
  }

  render(){
    return(
      <DocumentTitle title="Ang Ganda ni Ma'am Kat LOLterpreter">
        <div style={divStyle}>
        <Grid columns={3} divided stackable>
          <Grid.Row style={{height:'500px',width: '100%'}}>
            <Grid.Column color={'black'}>
              <Grid.Row style={{width: '100%',height: '10%'}}>
                  <input accept='lol/*' type='file' style={{width: '100%', height:'100%'}} onChange={this.loadFile} value={this.state.file}/>
              </Grid.Row>
              <Grid.Row style={{width: '100%', height:'90%'}}>
                <TextArea placeholder='Code here' style={{height:'100%', width: '100%'}} value={this.state.input} onChange={this.inputChange}/>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column color={'blue'}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Lexeme</Table.HeaderCell>
                  <Table.HeaderCell>Classification</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
            <div style={{height:'400px', width: '100%', overflow: 'scroll'}}>
            <Table fixed>
                <Table.Body>
                  {
                    this.state.lexemes.map(
                      (line,lineindex) => {
                        return(
                          line.map(
                            (lexeme,index) =>{
                              return (
                                <Table.Row key={index}>
                                  <Table.Cell>{lexeme[0]}</Table.Cell>
                                  <Table.Cell>{lexeme[1]}</Table.Cell>
                                </Table.Row>
                                  )
                            }
                          )
                        )
                      }
                    )
                  }


                </Table.Body>

            </Table>
            </div>
            </Grid.Column>
            <Grid.Column color={'red'}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Identifier</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
            <div style={{height:'400px', width: '100%', overflow: 'scroll'}}>
            <Table fixed>
                <Table.Body>
                  {
                    Object.keys(this.state.symbolTable).map(
                      (key) => {
                        return(
                          <Table.Row key={key}>
                          <Table.Cell>{key}</Table.Cell>
                          <Table.Cell>{this.state.symbolTable[key][0]}</Table.Cell>
                          <Table.Cell>{this.state.symbolTable[key][1]}</Table.Cell>
                          </Table.Row>
                        )
                      }
                    )
                  }
                </Table.Body>
            </Table>
            </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Button style={{width: '100%'}} onClick={this.updateTables}>
            RUN
            </Button>
          </Grid.Row>
          <Grid.Row>
            <TextArea placeholder='Output'  style={{width: '100%', height: '150px'}} value={this.state.output} readOnly/>
          </Grid.Row>
          </Grid>
        </div>
      </DocumentTitle>
    )
  }
}

export default MainWindow
