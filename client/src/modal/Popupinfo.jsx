import React from 'react'
import "./popup.css"
import { useState, useEffect } from 'react'

const Popupinfo = ({ nameclass, text, active, setShowPopup }) => {
  useEffect(() => {
    if (active) {
      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }
  }, [active, setShowPopup]);

  return (
    <div className={`popup ${nameclass === 'success' ? 'success' : 'error'} ${active ? 'active' : ''}`}>
      <span>{text}</span>
    </div>
  )
}

export default Popupinfo