import Footer from '../components/Footer'
import {React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import LoginedHeader from '../components/LoginedHeader'
import Modal from '../modal/Modal'
import Popupinfo from '../modal/Popupinfo';
import ModalRow from '../modal/ModalRow'
import TableRow from '../components/TableRow'
import axios from "axios";

const HourlyRates = () => {
  const [workers, setworkers] = useState(null)
  const [mentorsFromMoodle, setMentorsFromMoodle] = useState(null)
  const [modalActive, setModalActive] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [savedMentor, setSavedMentor] = useState(null)
  const [filterParams, setFilterParams] = useState({})
  const [showPopup, setShowPopup] = useState({ nameclass: "", active: false, text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const timeUntilTarget = targetTime - now;
      setTimeout(() => {
        insertExtra();
      }, timeUntilTarget);
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getData();
  }, [modalActive, filterParams, showPopup]);


  async function getData() {
    try {
      const loggedInUser = localStorage.getItem('loginStatus');
      if (!loggedInUser) {
        navigate('/login');
      }
      const response1 = await axios.post("http://localhost:8080/hourlyRates", {});
      if (response1.data) {
        setworkers(response1.data);
      } else {
        console.log("--");
      }
      if (modalActive) {
        const response2 = await axios.get("http://localhost:8080/getMentor", {});
        if (response2) {
          setMentorsFromMoodle(response2.data);
        }
      }
      filterMentors(filterParams);
    } catch (error) {
      setShowPopup({ nameclass: "error", active: true, text: error });
    }
  }




  const saveMentor = async () => {
    try {
      const res = await axios.post("http://localhost:8080/saveMentor", {
        mentorEmail: selectedMentor,
      });
      if (res.data.error){
        setShowPopup({ nameclass: "error", active: true, text: res.data.error });
      }else{
        const savedMentor = res.data.data[0];
        if (savedMentor.firstname === null && savedMentor.lastname === null) {
          const newRes = await axios.post("http://localhost:8080/saveMentorWithout", {
            mentorEmail: selectedMentor,
          });
          const newSavedMentor = newRes.data.data[0];
          newSavedMentor.email = selectedMentor;
          setSavedMentor(newSavedMentor);
          saveMentorToPMS(newSavedMentor);
          insertExtra();
        } else {
          savedMentor.email = selectedMentor;
          setSavedMentor(savedMentor);
          saveMentorToPMS(savedMentor);
          insertExtra();
        }
      }


    } catch (error) {
      setShowPopup({ nameclass: "error", active: true, text: error });
    }
  };

  const insertExtra = async () => {
    try {
      const res = await axios.post("http://localhost:8080/getSheets");
    } catch (error) {
      setShowPopup({ nameclass: "error", active: true, text: error });
    }
  }

  const handleModalSelectedCity = async (city) => {
    setSelectedCity(city);
    try {
      const res = await axios.post("http://localhost:8080/hourlyRates/filterByCity", {
        selectedCity: city,
      });
      setMentorsFromMoodle(res.data);
    } catch (error) {
      setShowPopup({ nameclass: "error", active: true, text: error });
    }
  }

  const filterMentors = async (params) => {
    try {
      const res = await axios.post("http://localhost:8080/hourlyRates/mentorFilter", { params });
      setworkers(res.data);
    } catch (error) {
      setShowPopup({ nameclass: "error", active: true, text: error });
    }
  };

  const handleStartDateChange = (event) => {
    setFilterParams({
      ...filterParams,
      startDate: event.target.value
    })
  }

  const handleEndDateChange = (event) => {
    setFilterParams({
      ...filterParams,
      endDate: event.target.value
    })
  }

  const handleCityChange = (event) => {
    setFilterParams({
      ...filterParams,
      city: event.target.value
    })
  }

  const handleMentorNameChange = (event) => {
    setFilterParams({
      ...filterParams,
      mentorName: event.target.value
    })
  }

  const handleSelectedMentor = (mentor) => {
    setSelectedMentor(mentor);
  };

  const handleButtonClick = () => {
    saveMentor();
    setShowPopup(true);
  };

  const saveMentorToPMS = async (savedMentor) => {
    try {
      const res = await axios.post("http://localhost:8080/saveMentorPMS", {
        savedMentor,
      });
      if (res.data.exists) {
        setShowPopup({ nameclass: "error", active: true, text: "A mentor already exists" });
      } else {
        setShowPopup({ nameclass: "success", active: true, text: "Mentor was added" });
      }
      insertExtra()
    } catch (error) {
      console.log(error);
    }
  }

  const getAllMentors = async () => {
    try {
      const res = await axios.post("http://localhost:8080/getAllMentors");
      const mentors = res.data.data;
      for (let i = 0; i < mentors.length; i++) {
        await saveMentorToPMS(mentors[i])
      }

    } catch (error) {
      setShowPopup({ nameclass: "error", active: true, text: error });
    }
  }


  return (
    <>
      <LoginedHeader />
      <div className='mentorsControl'>
        <button onClick={() => setModalActive(true)}>add mentor</button>
      </div>

      <div className='filter'>
        <div className='date-filter'>
          <input type="date" value={filterParams.startDate} onChange={handleStartDateChange} />
          <input type="date" value={filterParams.endDate} onChange={handleEndDateChange} />
        </div>
        <div className='city-filter'>
          <select id="city" className='city' name="city" value={filterParams.city} onChange={handleCityChange} >
            <option value="">Kõik</option>
            <option value="Tallinn">Tallinn</option>
            <option value="Narva">Narva</option>
            <option value="Kohtla-Jarve">Kohtla-Jarve</option>
            <option value="Tartu">Tartu</option>
          </select>
        </div>
        <div className='mentorName-filter'>
          <input className='mentorName' type="text" value={filterParams.mentorName} onChange={handleMentorNameChange} />
        </div>
        <div className='buttonsControll'>
          <button onClick={getAllMentors}> Get all attendance for this month </button>
        </div>
      </div>
      <table className='mentorTable'>
        <thead>
          <tr >
            <th>Mentor name</th>
            <th>City</th>
            <th>Teaching hours</th>
            <th>Extra hours</th>
            <th>Hourly rates</th>
            <th>Fixed fee</th>
            <th>Buttons controll</th>
          </tr>
        </thead>
        <tbody>
          {workers?.data?.map(item => (
            <TableRow
              key={item.workerid}
              item={item}
              setShowPopup = {setShowPopup}
            />
          ))
          }
        </tbody>

      </table>
      <Modal active={modalActive} setModalActive={setModalActive}>

        <div className="mentorAdder" onClick={e => e.stopPropagation()}>
          <label for="city">Choose city:</label>
          <select id="city" name="city" onChange={e => handleModalSelectedCity(e.target.value)}>
            <option value="Tallinn">Tallinn</option>
            <option value="Narva">Narva</option>
            <option value="Kohtla-Jarve">Kohtla-Jarve</option>
            <option value="Tartu">Tartu</option>
          </select>
          <br />

          <label for="mentors">Choose a mentor:</label>
          <select onChange={(event) => handleSelectedMentor(event.target.value)} name="mentors" id="mentors-select">
            {mentorsFromMoodle?.map((item, index) => (
              <ModalRow
                key={index}
                index={index}
                item={item}
                setShowPopup={setShowPopup}

               
              />
            ))
            }
          </select>
          <button className='add-button' onClick={handleButtonClick}>add</button>
        </div>
      </Modal>
      <Popupinfo nameclass={showPopup.nameclass} text={showPopup.text} active={showPopup.active} setShowPopup={setShowPopup} />
      <Footer />

    </>
  )
}

export default HourlyRates;