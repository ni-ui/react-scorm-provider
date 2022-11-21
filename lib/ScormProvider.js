"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ScoContext = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactAutobind = _interopRequireDefault(require("react-autobind"));

var _pipwerksScormApiWrapper = require("pipwerks-scorm-api-wrapper");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function isNumOrString(item) {
  if (typeof item === 'number') return true;
  if (typeof item === 'string' && item.length > 0) return true;
  return false;
}

var ScoContext = _react["default"].createContext({
  apiConnected: false,
  learnerName: '',
  completionStatus: 'unknown',
  suspendData: {},
  scormVersion: '',
  getSuspendData: function getSuspendData() {},
  setSuspendData: function setSuspendData() {},
  clearSuspendData: function clearSuspendData() {},
  setStatus: function setStatus() {},
  setScore: function setScore() {},
  set: function set() {},
  get: function get() {},
  close: function close() {}
});

exports.ScoContext = ScoContext;

var ScormProvider = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ScormProvider, _Component);

  var _super = _createSuper(ScormProvider);

  function ScormProvider(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ScormProvider);
    _this = _super.call(this, props); // this state will be passed in 'sco' to consumers

    _this.state = {
      apiConnected: false,
      learnerName: '',
      completionStatus: 'unknown',
      suspendData: {},
      scormVersion: ''
    };
    (0, _reactAutobind["default"])((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ScormProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createScormAPIConnection();
      window.addEventListener("beforeunload", this.closeScormAPIConnection);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.closeScormAPIConnection();
      window.removeEventListener("beforeunload", this.closeScormAPIConnection);
    }
  }, {
    key: "createScormAPIConnection",
    value: function createScormAPIConnection() {
      var _this2 = this;

      if (this.state.apiConnected) return;
      if (this.props.version) _pipwerksScormApiWrapper.SCORM.version = this.props.version;
      if (typeof this.props.debug === "boolean") _pipwerksScormApiWrapper.debug.isActive = this.props.debug;

      var scorm = _pipwerksScormApiWrapper.SCORM.init();

      if (scorm) {
        var version = _pipwerksScormApiWrapper.SCORM.version;
        var learnerName = version === '1.2' ? _pipwerksScormApiWrapper.SCORM.get('cmi.core.student_name') : _pipwerksScormApiWrapper.SCORM.get('cmi.learner_name');

        var completionStatus = _pipwerksScormApiWrapper.SCORM.status('get');

        this.setState({
          apiConnected: true,
          learnerName: learnerName,
          completionStatus: completionStatus,
          scormVersion: version
        }, function () {
          _this2.getSuspendData();
        });
      } else {
        // could not create the SCORM API connection
        if (this.props.debug) console.error("ScormProvider init error: could not create the SCORM API connection");
      }
    }
  }, {
    key: "closeScormAPIConnection",
    value: function closeScormAPIConnection() {
      if (!this.state.apiConnected) return;
      this.setSuspendData();

      _pipwerksScormApiWrapper.SCORM.status('set', this.state.completionStatus);

      _pipwerksScormApiWrapper.SCORM.save();

      var success = _pipwerksScormApiWrapper.SCORM.quit();

      if (success) {
        this.setState({
          apiConnected: false,
          learnerName: '',
          completionStatus: 'unknown',
          suspendData: {},
          scormVersion: ''
        });
      } else {
        // could not close the SCORM API connection
        if (this.props.debug) console.error("ScormProvider error: could not close the API connection");
      }
    }
  }, {
    key: "getSuspendData",
    value: function getSuspendData() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (!_this3.state.apiConnected) return reject('SCORM API not connected');

        var data = _pipwerksScormApiWrapper.SCORM.get('cmi.suspend_data');

        var suspendData = data && data.length > 0 ? JSON.parse(data) : {};

        _this3.setState({
          suspendData: suspendData
        }, function () {
          return resolve(_this3.state.suspendData);
        });
      });
    }
  }, {
    key: "setSuspendData",
    value: function setSuspendData(key, val) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (!_this4.state.apiConnected) return reject('SCORM API not connected');
        var currentData = _objectSpread({}, _this4.state.suspendData) || {};
        if (isNumOrString(key)) currentData[key] = val;

        var success = _pipwerksScormApiWrapper.SCORM.set('cmi.suspend_data', JSON.stringify(currentData));

        if (!success) return reject('could not set the suspend data provided');

        _this4.setState({
          suspendData: currentData
        }, function () {
          _pipwerksScormApiWrapper.SCORM.save();

          return resolve(_this4.state.suspendData);
        });
      });
    }
  }, {
    key: "clearSuspendData",
    value: function clearSuspendData() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        if (!_this5.state.apiConnected) return reject('SCORM API not connected');

        var success = _pipwerksScormApiWrapper.SCORM.set('cmi.suspend_data', JSON.stringify({}));

        if (!success) return reject('could not clear suspend data');

        _this5.setState({
          suspendData: {}
        }, function () {
          _pipwerksScormApiWrapper.SCORM.save();

          return resolve(_this5.state.suspendData);
        });
      });
    }
  }, {
    key: "setStatus",
    value: function setStatus(status, deferSaveCall) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        if (!_this6.state.apiConnected) return reject('SCORM API not connected');
        var validStatuses = ["passed", "completed", "failed", "incomplete", "browsed", "not attempted", "unknown"];

        if (!validStatuses.includes(status)) {
          if (_this6.props.debug) console.error("ScormProvider setStatus error: could not set the status provided");
          return reject('could not set the status provided');
        }

        var success = _pipwerksScormApiWrapper.SCORM.status("set", status);

        if (!success) return reject('could not set the status provided');

        _this6.setState({
          completionStatus: status
        }, function () {
          if (!deferSaveCall) _pipwerksScormApiWrapper.SCORM.save();
          return resolve(_this6.state.completionStatus);
        });
      });
    }
  }, {
    key: "setScore",
    value: function setScore(scoreObj) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        if (!_this7.state.apiConnected) return reject('SCORM API not connected');
        var value = scoreObj.value,
            min = scoreObj.min,
            max = scoreObj.max,
            status = scoreObj.status;
        var coreStr = _this7.state.scormVersion === '1.2' ? '.core' : '';
        var promiseArr = [];
        if (typeof value === 'number') promiseArr.push(_this7.set("cmi".concat(coreStr, ".score.raw"), value, true));
        if (typeof min === 'number') promiseArr.push(_this7.set("cmi".concat(coreStr, ".score.min"), min, true));
        if (typeof max === 'number') promiseArr.push(_this7.set("cmi".concat(coreStr, ".score.max"), max, true));
        if (typeof status === 'string') promiseArr.push(_this7.setStatus(status, true));
        Promise.all(promiseArr).then(function (values) {
          _pipwerksScormApiWrapper.SCORM.save();

          return resolve(values);
        })["catch"](function (err) {
          return reject('could not save the score object provided');
        });
      });
    }
  }, {
    key: "set",
    value: function set(param, val, deferSaveCall) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        if (!_this8.state.apiConnected) return reject('SCORM API not connected');

        var success = _pipwerksScormApiWrapper.SCORM.set(param, val);

        if (!success) return reject("could not set: { ".concat(param, ": ").concat(val, " }"));
        if (!deferSaveCall) _pipwerksScormApiWrapper.SCORM.save();
        return resolve([param, val]);
      });
    }
  }, {
    key: "get",
    value: function get(param) {
      if (!this.state.apiConnected) return;
      return _pipwerksScormApiWrapper.SCORM.get(param);
    }
  }, {
    key: "render",
    value: function render() {
      var val = _objectSpread({}, this.state, {
        getSuspendData: this.getSuspendData,
        setSuspendData: this.setSuspendData,
        clearSuspendData: this.clearSuspendData,
        setStatus: this.setStatus,
        setScore: this.setScore,
        set: this.set,
        get: this.get,
        close: this.closeScormAPIConnection
      });

      return /*#__PURE__*/_react["default"].createElement(ScoContext.Provider, {
        value: val
      }, this.props.children);
    }
  }]);
  return ScormProvider;
}(_react.Component);

ScormProvider.propTypes = {
  version: _propTypes["default"].oneOf(['1.2', '2004']),
  debug: _propTypes["default"].bool
};
var _default = ScormProvider;
exports["default"] = _default;