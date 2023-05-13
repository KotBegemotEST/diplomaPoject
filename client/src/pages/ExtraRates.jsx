import React, { useEffect, useState } from 'react'
import RatesRow from '../components/RatesRow'
import axios from "axios";
import LoginedHeader from '../components/LoginedHeader';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'

const ExtraRates = () => {
  const [extraActions, setExtraActions] =  useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loginStatus');
    if (!loggedInUser) {
      navigate('/login');
    }
  
    const fetchData = async () => {
      try {
        const res = await axios.post("http://localhost:8080/extraRates",{})
        if(res.data){
          setExtraActions(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, []);


  const handleDelete = (id) => {
    setExtraActions(extraActions.filter((item) => item.idextraActions !== id));
  };

  const handleSave = (rowData) => {
    axios.post("http://localhost:8080/updateaction", rowData)
      .then((response) => {
        if (response.data) {
          console.log(response.data)
        }
      });
  }

  


  return (
    <>
    <LoginedHeader/>
      <table>
        <thead>
          <tr>
            <th>Exta action</th>
            <th>Hourly rates</th>
            <th>Control</th>
          </tr>
        </thead>
        <tbody>
          {extraActions && extraActions.map(item=>{
            return (
              <RatesRow
                key = {item.idextraActions}
                idextraActions = {item.idextraActions}
                extraName= {item.extraName}
                extraRate = {item.extraRate}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            )
          })}
        </tbody>
      </table>
      <Footer />
    </>
  )
  
}

export default ExtraRates