import React, { useEffect, useState } from 'react'
import LoginedHeader from '../components/LoginedHeader'
import Footer from '../components/Footer'
import axios from "axios";

const Total = () => {
  const [months, setMonths] = useState([]);
  const [month, setMonth] = useState()
  const [monthName, setMonthName] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);
  const [summInfo, setSummInfo] = useState([])

  let getMonthName = (dateObjects) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return dateObjects.map((dateObject) => {
      const date = new Date(dateObject.endDate);
      const monthIndex = date.getUTCMonth();
      return months[monthIndex];
    });
  }

  let handleSelectedMonth = async (month) => {
    setMonth(monthName[month - 1])
    const res = await axios.post("http://localhost:8080/getInfoFor", { month });
    setSummInfo(res.data)
    console.log(summInfo)
  }

  useEffect(() => {
    const getMonth = async () => {
      try {
        const res = await axios.post("http://localhost:8080/getMonthInfo");
        const monthNames = getMonthName(res.data);
        setMonths(monthNames);
        const lastMonth = monthNames[0];
        setMonth(lastMonth);
        const resSumm = await axios.post("http://localhost:8080/getInfoFor", { month: monthName.indexOf(lastMonth) + 1 });
        setSummInfo(resSumm.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    getMonth();
  }, []);

  return (
    <>
      <LoginedHeader />

      <div className='pageContent'>


        <div className='totalDiv'>
          <select id="monthSelect" name="monthSelect" onChange={(event) => handleSelectedMonth(event.target.value)}>
            {months.map((month, index) => (
              <option key={index} value={monthName.indexOf(month) + 1}>
                {month}
              </option>
            ))}
          </select>

          <p className='totalText'>Estimated expenses for: <span className='redBold'>{month}</span></p>
          {summInfo?.message && (
            <>
              {summInfo.message.usualSalary && (
                <p className='totalText salary'>Usual salary: <span className='redBold'>{summInfo.message.usualSalary}</span> €.</p>
              )}
              {summInfo.message.extraSalary && (
                <p className='totalText salary'>Extra salary: <span className='redBold'>{summInfo.message.extraSalary}</span> €.</p>
              )}
              <div className='total'>Total: <span className='redBold'>{summInfo.message.extraSalary + summInfo.message.usualSalary}</span> €.</div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>

  )
}

export default Total