import React, { Component } from "react";
import ReactDOM from "react-dom";
class CheckBox extends Component {
  constructor() {
    super();
    this.state = { isChecked: false };
    this.handleChecked = this.handleChecked.bind(this); // set this, because you need get methods from CheckBox
  }

  handleChecked() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  render() {
    var txt;
    if (this.state.isChecked) {
      txt = "checked";
    } else {
      txt = "unchecked";
    }

    // remove () after handleChecked because you need pass
    // reference to function
    // also add return before <div>
    return (
      <div>
        <input
          type="checkbox"
          onChange={() => this.props.handleCheckTrader()}
        />
      </div>
    );
  }
}
export default CheckBox;
