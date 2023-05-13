import {React, useState} from 'react'
import axios from "axios";

const MntRow = (props) => {
  const [modalActive,setModalActive] = useState(false)

  const sendSalary = async () =>{
    const mentor = props.item
    try {
      const res = await axios.post("http://localhost:8080/sendSalary",{
        mentor: mentor,
      });
      props.setShowPopup({ nameclass: "success", active: true, text: res.data });
    } catch (error) {
      props.setShowPopup({ nameclass: "error", active: true, text: error });
    }
  }

  return (
    <>
    <tr>
      <td>
        <a onClick={()=> setModalActive(true)} href="#">{props.item.firstName} {props.item.lastName}</a>
      </td>
      <td>
        {props.item.workerEmail}
      </td>
      <td>
      <button onClick={sendSalary} className='send-btn'>Generate Excel</button>
      </td>
    </tr>

    </>
  );
};

export default MntRow