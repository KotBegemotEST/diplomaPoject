import React from 'react'
import axios from "axios";
import { useState,useEffect} from 'react'
const ModalRow = (props) => {  
  return (
    <option className={"modalRowId-" + props.index} value={props.item.email}>{props.item.firstname}  {props.item.lastname}</option>
  )
}

export default ModalRow