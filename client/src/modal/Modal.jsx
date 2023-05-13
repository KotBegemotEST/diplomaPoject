import React from 'react'
import "./modal.css"
const Modal = ({active,setModalActive,children}) => {
  return (
    <div className={active ? "modal active" : "modal"} onClick={()=>setModalActive(false)}>
        <div className={active ? "modal-content active" : "modal-content"}>
            <span className='modal-close' onClick={()=>setModalActive(false)}></span>
            {children}
        </div>
    </div>
  )
}
export default Modal