"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "withScorm", {
  enumerable: true,
  get: function get() {
    return _withScorm["default"];
  }
});
exports["default"] = void 0;

var _withScorm = _interopRequireDefault(require("./withScorm"));

var _ScormProvider = _interopRequireDefault(require("./ScormProvider"));

var _default = _ScormProvider["default"];
exports["default"] = _default;