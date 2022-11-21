"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _ScormProvider = require("./ScormProvider");

function withScorm() {
  return function (WrappedComponent) {
    var WithScorm = function WithScorm(props) {
      return /*#__PURE__*/_react["default"].createElement(_ScormProvider.ScoContext.Consumer, null, function (value) {
        return /*#__PURE__*/_react["default"].createElement(WrappedComponent, (0, _extends2["default"])({}, props, {
          sco: value
        }));
      });
    };

    return WithScorm;
  };
}

var _default = withScorm;
exports["default"] = _default;