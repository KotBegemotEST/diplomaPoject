"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function getCurrentMonthRange() {
  var now = new Date();
  var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startOfMonth: Math.floor(startOfMonth.getTime() / 1000),
    endOfMonth: Math.floor(endOfMonth.getTime() / 1000)
  };
}

function formatDate(seconds) {
  var date = new Date(seconds * 1000);
  var day = String(date.getDate()).padStart(2, "0");
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var year = date.getFullYear();
  return "".concat(year, "-").concat(month, "-").concat(day);
  ;
}

function formatDateYYMMDD(dateString) {
  var year, month, day;

  if (dateString.includes('/')) {
    var dateParts = dateString.split('/');

    if (dateParts.length !== 3) {
      throw new Error('Invalid date format');
    }

    var _dateParts$map = dateParts.map(function (part) {
      return parseInt(part);
    });

    var _dateParts$map2 = _slicedToArray(_dateParts$map, 3);

    month = _dateParts$map2[0];
    day = _dateParts$map2[1];
    year = _dateParts$map2[2];

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      throw new Error('Invalid date format');
    }
  } else if (dateString.includes('-')) {
    var _dateParts = dateString.split('-');

    if (_dateParts.length !== 3) {
      throw new Error('Invalid date format');
    }

    var _dateParts$map3 = _dateParts.map(function (part) {
      return parseInt(part);
    });

    var _dateParts$map4 = _slicedToArray(_dateParts$map3, 3);

    year = _dateParts$map4[0];
    month = _dateParts$map4[1];
    day = _dateParts$map4[2];

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      throw new Error('Invalid date format');
    }
  } else {
    throw new Error('Invalid date format');
  }

  return "".concat(year, "-").concat(month.toString().padStart(2, '0'), "-").concat(day.toString().padStart(2, '0'));
}

function isDate(input) {
  input = input.split(' ')[0];
  return new Date(input) !== "Invalid Date" && !isNaN(new Date(input));
}

function getMonthNumber(dateString) {
  var date = new Date(dateString);
  var monthIndex = date.getUTCMonth() + 1;
  var monthNumber = monthIndex < 10 ? "0".concat(monthIndex) : monthIndex;
  return monthNumber;
}

module.exports = {
  getCurrentMonthRange: getCurrentMonthRange,
  isDate: isDate,
  formatDate: formatDate,
  formatDateYYMMDD: formatDateYYMMDD,
  getMonthNumber: getMonthNumber
};