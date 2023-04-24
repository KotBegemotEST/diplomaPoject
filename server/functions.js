function getCurrentMonthRange() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startOfMonth: Math.floor(startOfMonth.getTime() / 1000),
    endOfMonth: Math.floor(endOfMonth.getTime() / 1000)
  };
}


function formatDate(seconds) {
  const date = new Date(seconds * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;;
}


function formatDateYYMMDD(dateString) {
  let year, month, day;
  if (dateString.includes('/')) {
    const dateParts = dateString.split('/');
    if (dateParts.length !== 3) {
      throw new Error('Invalid date format');
    }
    [month, day, year] = dateParts.map(part => parseInt(part));
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      throw new Error('Invalid date format');
    }
  } else if (dateString.includes('-')) {
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) {
      throw new Error('Invalid date format');
    }
    [year, month, day] = dateParts.map(part => parseInt(part));
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      throw new Error('Invalid date format');
    }
  } else {
    throw new Error('Invalid date format');
  }
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function isDate(input) {
  input = input.split(' ')[0];
  return (new Date(input) !== "Invalid Date") && !isNaN(new Date(input));
}

function getMonthNumber(dateString) {
  const date = new Date(dateString);
  const monthIndex = date.getUTCMonth() + 1;
  const monthNumber = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
  return monthNumber;
}

module.exports = { getCurrentMonthRange, isDate,formatDate,formatDateYYMMDD,getMonthNumber};