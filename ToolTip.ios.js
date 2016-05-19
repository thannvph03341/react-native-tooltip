'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  requireNativeComponent,
  TouchableHighlight,
  View,
  NativeModules,
} = ReactNative;

var ToolTipMenu = NativeModules.ToolTipMenu;

var RCTToolTipText = requireNativeComponent('RCTToolTipText', null);

var propTypes = {
  actions: React.PropTypes.arrayOf(React.PropTypes.shape({
    text: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
  })),
  longPress: React.PropTypes.bool,
  ...TouchableHighlight.propTypes,
};

var ViewClass = React.createClass({
  showMenu: function() {
    ToolTipMenu.show(ReactNative.findNodeHandle(this.refs.toolTipText), this.getOptionTexts());
  },

  getOptionTexts: function() {
    return this.props.actions.map((option) => option.text);
  },

  // Assuming there is no actions with the same text
  getCallback: function(optionText) {
    var selectedOption = this.props.actions.find((option) => option.text === optionText);

    if (selectedOption) {
      return selectedOption.onPress;
    }

    return null;
  },

  getTouchableHighlightProps: function() {
    var props = {};

    Object.keys(TouchableHighlight.propTypes).forEach((key) => props[key] = this.props[key]);

    if (this.props.longPress) {
      props.onLongPress = this.showMenu;
    } else {
      props.onPress = this.showMenu;
    }

    return props;
  },

  handleToolTipTextChange: function(event) {
    var callback = this.getCallback(event.nativeEvent.text);

    if (callback) {
      callback(event);
    }
  },

  render: function() {
    return (
      <RCTToolTipText ref='toolTipText' onChange={this.handleToolTipTextChange}>
        <TouchableHighlight
          {...this.getTouchableHighlightProps()}
        >
          <View>
            {this.props.children}
          </View>
        </TouchableHighlight>
      </RCTToolTipText>
    );
  }
});

ViewClass.propTypes = propTypes;

module.exports = ViewClass;
