import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios";
import Modal from '../modal/Modal'
import Popupinfo from '../modal/Popupinfo';
const TableRow = (props) => {
  const [editable, setEditable] = useState("");
  const [workerid, setWorkerId] = useState(props.item.workerid);
  const [firstName, setFirstName] = useState(props.item.firstName)
  const [lastName, setLastName] = useState(props.item.lastName)
  const [city, setCity] = useState(props.item.city)
  const [hours, setHours] = useState(props.item.teachingHours)
  const [job_name, setJobName] = useState(props.item.lastName)
  const [hourly_rates, setHourlyRates] = useState(props.item.hourlyRates)
  const [fixed_fee, setFee] = useState(props.item.fixedFee)
  const [totalExtraHours, setTotalExtraHours] = useState(props.item.totalExtraHours)
  const [modalActive,setModalActive] = useState(false)
  const [extraNaming,setExtraNaming] =  useState(null)
  const [userDate,setUserDate] =  useState(props.item.date)
  const [showPopup, setShowPopup] =  useState({ nameclass: "", active: false, text: "" });
  

  const deleteInfo = async () => {
    setEditable(false)
    try {
      const res = await axios.post("http://localhost:8080/deleteWorker", { workerid: props.item.workerid })
        .then((response) => {
          if (response.data) {
            props.setShowPopup({ nameclass: "succes", active: true, text: response.data });
          } else {
            props.setShowPopup({ nameclass: "error", active: true, text: response.data });
          }
        })
    } catch (error) {
      console.log(error)
    }
  }


  const saveInfo = async () => {
    setEditable(false)
    try {
      const res = axios.post("http://localhost:8080/saveWorkerInfo", {
        workerid: workerid,
        firstName: firstName,
        lastName: lastName,
        city:city,
        hours:hours,
        job_name: job_name,
        hourly_rates: hourly_rates,
        fixed_fee: fixed_fee,

      }).then((response) => {
        if (response.data) {
          props.setShowPopup({ nameclass: "success", active: true, text: response.data });
        }
        else {
          props.setShowPopup({ nameclass: "error", active: true, text: response.data });
        }

      })
    } catch (error) {
      console.log(error)
    }

  }


  const editInfo = () => {
    console.log("I am editing row with id: " + workerid)
    setEditable(true)
    const workerString = document.querySelectorAll(".id-" + workerid.toString() + " input")
    workerString.forEach(input => {
      input.addEventListener("change", () => {
        const inputName = input.name
        const inputValue = input.value
        switch (inputName) {
          case "firstName":
            input.disabled = false
            setFirstName(inputValue)
            break
          case "lastName":
            input.disabled = false
            setLastName(inputValue)
            break
          case "city":
            input.disabled = false
            setCity(inputValue)
            break
          case "jobName":
            input.disabled = false
            setJobName(inputValue)
            break
          case "teachingHours":
            input.disabled = false
            setHours(inputValue)
            break          
          case "hourlyRates":
            input.disabled = false
            setHourlyRates(inputValue)
            break
          case "fixedFee":
            input.disabled = false
            setFee(inputValue)
            break
          default:
            break
        }
      })
    })
  }

  const changedInfo = (row) => {
    console.log(row)
    Object.keys(row).map((item) => {
      row[item].disabled = false
    })
  }

  const openExtra = (e)=>{

  }

  
  useEffect(() => {
    const getExtra = async () => {
      try {
        const res = await axios.post("http://localhost:8080/getExtra", { firstName: props.item.firstName, lastName: props.item.lastName, date: new Date(props.item.startDate).toLocaleDateString()})

        setExtraNaming(res.data)
 
      } catch (error) {
        console.log(error)
      }
    }
    if (modalActive) {
      getExtra()
    }
  }, [modalActive])

  return (
    <>
      <tr key={workerid} className={"id-" + workerid} >
        <td>
          <input disabled={!editable} type="text" className='workerInput' value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
          <input disabled={!editable}  type="text" className='workerInput' value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
        </td>
        <td>
          <input disabled={!editable} type="text" className='workerInput' value={city} onChange={(e) => { setCity(e.target.value) }} />
        </td>
  
        <td>
          <input disabled={!editable} type="text" className='workerInput' value={hours} onChange={(e) => { setHours(e.target.value) }} />
        </td>

        <td onClick={()=> setModalActive(true)}>
          <input disabled="false" type="text" className='workerInput' name="totalExtraHours" value={totalExtraHours}  />
        </td>
        <td>
          <input disabled={!editable} type="text" className='workerInput' value={hourly_rates} onChange={(e) => { setHourlyRates(e.target.value) }} />
        </td>
        <td>
          <input disabled={!editable} type="text" className='workerInput' value={fixed_fee} onChange={(e) => { setFee(e.target.value) }} />
        </td>
        <td className='control-btn'>
          <button className='edit' onClick={() => editInfo()}>Edit</button>
          <button className='delete' onClick={() => deleteInfo()}>Delete</button>
          <button className='save' onClick={() => saveInfo()}>Save</button>
        </td>
      </tr>

      <Modal active={modalActive} setModalActive={setModalActive}>
        <div className='content'>
          {extraNaming?.data?.map(item => (
            <p> <span className='extraName'>  {item.extraName} </span> <span className='extrahours'> {item.extrahours} h.</span>   <span className='extradate'>{new Date(item.date).toLocaleDateString()} </span></p>
          ))}
        </div>
      </Modal>
      <Popupinfo nameclass={showPopup.nameclass} text={showPopup.text} active={showPopup.active} setShowPopup={setShowPopup} />

    </>
  )
}

export default TableRow;