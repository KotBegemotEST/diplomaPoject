import React, { useState,useEffect } from 'react'
import Popupinfo from '../modal/Popupinfo';
import axios from "axios";

const RatesRow = ({idextraActions,extraName,extraRate, onSave,onDelete }) => {
  const [extraNameA,setExtraNameA] = useState(extraName)
  const [extraRateA,setExtraRateA] = useState(extraRate)
  const [isEditable, setIsEditable] = useState(false)
  const [showPopup, setShowPopup] =  useState({ nameclass: "", active: false, text: "" });


    const extraNameChanger = (value) =>{
        setExtraNameA(value)
    }

    const extraRateChanger = (value) =>{
        setExtraRateA(value)
    }

    const deleteInfo = async () =>{
      const res = await axios.post("http://localhost:8080/deleteaction",{idextraActions:idextraActions})
      .then((response)=>{
        if(response.data){
          setShowPopup({ nameclass: "success", active: true, text: "Additional action has been removed" });
          onDelete(idextraActions);
        }else{
          setShowPopup({ nameclass: "error", active: true, text: "Error" });
        }
      })
    }

    const editInfo = () => {
      setIsEditable(true)
    }


    useEffect(() => {
      if (isEditable) {
        onSave({ id: idextraActions, name: extraNameA, rate: extraRateA });
      }
    }, [extraNameA, extraRateA, isEditable, onSave, idextraActions,showPopup]);
    const handleBlur = () => {
      setIsEditable(false);
    };

    
  return (
    <tr key={idextraActions} className= {"id-" + idextraActions} >
        <td>
            <input onBlur={handleBlur} disabled={!isEditable} type="text" value={extraNameA} onChange={(e)=>{ extraNameChanger(e.target.value)}} />
        </td>
        <td>
            <input onBlur={handleBlur} disabled={!isEditable} type="text" value={extraRateA} onChange={(e)=>{ extraRateChanger(e.target.value)}} />
        </td>
        <td className='control-btn'>
          <button className="edit" onClick={() => editInfo()}>Edit</button>
          <button className="delete" onClick={() => deleteInfo()}>Delete</button>
        </td>
    </tr>
  )
}


export default RatesRow