import React, { useEffect, useState } from 'react'
import LoginedHeader from '../components/LoginedHeader'
import Footer from '../components/Footer'
import axios from "axios";
import MntRow from '../components/MntRow';
import { useNavigate } from 'react-router-dom';
import Popupinfo from '../modal/Popupinfo';


const Salary = () => {
  const [info,setInfo] =  useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] =  useState({ nameclass: "", active: false, text: "" });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loginStatus');
    if (!loggedInUser) {
      navigate('/login');
    }
  
    const getInfo = async () => {
      try {
        const res = await axios.post("http://localhost:8080/getInfo")
        if (res.data) {
          setInfo(res.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
  
    getInfo()
  }, [showPopup])

    return (
        <>
            <LoginedHeader/>
            <table className='salary-table'>
            <thead>
              <tr >
                <th>Mentor name</th>
                <th>E-mail</th>
                <th>Button</th>
              </tr>
            </thead>
              <tbody>
                
                { info && info.map(item=>(
                   <MntRow key={item.id}
                    item={item}
                    setShowPopup={setShowPopup}
                    />
                    
                ))}
              </tbody>
            </table>
            <Footer />
            <Popupinfo nameclass={showPopup.nameclass} text={showPopup.text} active={showPopup.active} setShowPopup={setShowPopup} />
        </>
      )
}

export default Salary