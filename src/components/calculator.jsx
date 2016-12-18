import React, { Component } from 'react';
var math = require('mathjs');

//below stateless component is ordered by the sequence of these component on UI.
const Screen = ({value}) => {
  return (
      <div className="screen">
        <div className="bottom">
          {value}
        </div>
      </div>
  );
  
}
const Buttons = ({children}) => {
	return (
      <div className="buttons">
      	{children}
      </div>
	)
}
const DeleteButton = ({clear}) => {
  return (
    <div>
        <div className="delete">
          <div className="rec">REC</div>
          <div onClick={clear} className="delete-button">C/AC</div>
        </div>
      </div>
  )
}
const CreateRows = ({children}) => {
  return <div>{children}</div>
}
const SinglelineButtons = ({row, click, buttonMap, operatorMap}) => {
	const jsx = [];
	const str = buttonMap[row];
	for(var i = 0; i < buttonMap[row].length; i++){
      jsx.push(<div className={operatorMap[str.charAt(i)] ? "operator singlebutton" : "number singlebutton" } onClick={click} key={str.charAt(i)}>
      	<span className="text">{str.charAt(i)}</span>
      </div>);
	}

	return (
      <div className="button-row">
      	{jsx}
      </div>
	);
}

const GenerateRows = ({buttonMap, click, operatorMap}) => {
	const rows = [];
	for(var j = 0; j < buttonMap.length; j++){
      rows.push(<SinglelineButtons operatorMap={operatorMap} buttonMap={buttonMap} key={j}row={j} click={click}/>);
	}
	return <div>{rows}</div>
}

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0, //numbers shows on screen
      string: "0" //string that keep track of each calculation 
    };
    this.equalClicked = false;//check if user has clicked "=" to start a new calculation
  }
  render() {
  	console.log(this.state);
    const operatorMap = {
		"+" : true,
		"-" : true,
		"*" : true,
		"/" : true,
		"=" : true,
	};
	const formatFloat = (string)=> {//use math.js to fix javascript float issue
      let arr, result;
      if(string.indexOf('+') !== -1){
         arr = string.split('+');
         result = math.add(arr[0], arr[1]);
      } else if (string.indexOf('-') !== -1) {
         arr = string.split('-');
         result = math.subtract(arr[0], arr[1]);
      } else if (string.indexOf('*') !== -1) {
         arr = string.split('*');
         result = math.multiply(arr[0], arr[1]);
      } else if (string.indexOf('/') !== -1) {
         arr = string.split('/');
         result = math.divide(arr[0], arr[1]);
      }
      return math.format(result, {precision: 14});
	}
    const doCalculate = (e) => {
    	let newValue = e.target.innerText;//new value when user clicks
    	let oldValue = this.state.value;//old value.
    	let oldString = this.state.string;//old string

        let regNum = new RegExp('^[0-9]$');
        let regDot = new RegExp('^[.]{1}$');
	    if(operatorMap[newValue]) {//new value is an operator
	      if(this.equalClicked) this.equalClicked = false;
	      //if new value is an operator,
	      //we should set equalclicked to false;
           this.setState({
	    	value: oldValue,
	    	string: oldString + newValue
	       });
           if(newValue === "=") {//if it's '='
           	 if(operatorMap[oldString.charAt(oldString.length - 1)]) {
           	 //if the previous char of oldString is an operator
               this.setState({// we should ignore this '='
	    	    value: oldValue,
	    	    string: oldString
	           });
           	 } else {
           	 	//calculation
           	 	this.setState({value: formatFloat(this.state.string), string: formatFloat(this.state.string)+""});
                this.equalClicked = true;
           	 }
           }
           if(operatorMap[oldString.charAt(oldString.length - 1)] && newValue !== '=') {
           //if the last char of oldstring is also an operator, 
           	//we should rewrite that operator with new operator, but not when new value is '='
           	this.setState({value: oldValue, string: oldString.substr(0, oldString.length - 1) + newValue});
           }
	    } else if (operatorMap[oldString.charAt(oldString.length - 1)]) {
	    //last char of oldvalue is an operator,we should clean the screen due to calculator behaviour
           this.setState({
	    	value: newValue,
	    	string: oldString + newValue
	       });
	    } else if (regNum.test(newValue) || regDot.test(newValue)) {//regular number and dot
            if(this.equalClicked || (oldString.length == 1 && oldValue === 0)) {
            // if it's a new calculation or it's from the very beginning. we should rewrite all the things.  
              if(newValue === '.') {
                this.setState({
	    	      value: "0.",
	    	      string: "0."
	            });
              } else {
                this.setState({
	    	      value: newValue,
	    	      string: newValue
	            });
              }
	          this.equalClicked = false;//new calculation, user has not clicked the '='
            } else {//it's not from the begining
              if(oldValue.indexOf('.') === -1 || regNum.test(newValue)){
              //here is just for checking there can't be two dots in oldvalue.
                this.setState({
	    	      value: oldValue + newValue,
	    	      string: oldString + newValue
	            });
              } else {
              	this.setState({
	    	      value: oldValue,
	    	      string: oldString
	            });
              }
            }
	    }
	}
    const clear = (e) => { // when user clicks clear.
		let newValue = e.target.innerText;
		let oldValue = this.state.value;
		let oldString = this.state.string;
      if(oldString.indexOf('+') !== -1) {
        if(oldString.indexOf('+') === oldString.length - 1) {//when + is the last char of oldstring
         this.setState({value: oldValue, string: oldString.substr(0, oldString.length - 1)});//delete +
        }
        if(oldString.indexOf('+') < oldString.length - 1) {//when there's number after +
         this.setState({value: oldValue, string: oldString.substr(0, oldString.indexOf('+') + 1)});
         //we want the string before +
        }
      } else if (oldString.indexOf('-') !== -1) {//same logic as above
        if(oldString.indexOf('-') === oldString.length - 1) {
         this.setState({value: oldValue, string: oldString.substr(0, oldString.length - 1)});
        }
        if(oldString.indexOf('-') < oldString.length - 1) {
         this.setState({value: oldValue, string: oldString.substr(0, oldString.indexOf('-') + 1)});
        }
      } else if (oldString.indexOf('*') !== -1) {
        if(oldString.indexOf('*') === oldString.length - 1) {
         this.setState({value: oldValue, string: oldString.substr(0, oldString.length - 1)});
        }
        if(oldString.indexOf('*') < oldString.length - 1) {
         this.setState({value: oldValue, string: oldString.substr(0, oldString.indexOf('*') + 1)});
        }
      } else if (oldString.indexOf('/') !== -1) {
        if(oldString.indexOf('/') === oldString.length - 1) {
         this.setState({value: oldValue, string: oldString.substr(0, oldString.length - 1)});
        }
        if(oldString.indexOf('/') < oldString.length - 1) {
         this.setState({value: oldValue, string: oldString.substr(0, oldString.indexOf('/') + 1)});
        }
      } else {
         this.setState({value: 0, string: "0"});
      }
    }
    return (
      <div className="calculator">
        Calculator simple starter
        <Screen value={this.state.value}/>
        <Buttons>
          <DeleteButton clear={clear}/>
          <CreateRows>
             <GenerateRows operatorMap={operatorMap} buttonMap={["789/", "456*", "123-", ".0=+"]}
             click={doCalculate}/>
          </CreateRows>
        </Buttons>
      </div>
    );
  }
}
