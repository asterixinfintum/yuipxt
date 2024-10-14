"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function addAndConvertToNumber(num1, num2) {
  var result = (num1 + num2).toFixed(8);
  return parseFloat(result);
}
function subtractAndConvertToNumber(num1, num2) {
  var result = (num1 - num2).toFixed(8);
  return parseFloat(result);
}
var _default = exports["default"] = {
  addAndConvertToNumber: addAndConvertToNumber,
  subtractAndConvertToNumber: subtractAndConvertToNumber
};