import {React,useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [loginStatus,setLoginStatus]=  useState(localStorage.getItem(localStorage.getItem("loginStatus")|| false));
        const login = async ()=> {
            try {
                const res = axios.post("http://localhost:8080/login",{
                    username:username,
                    password:password,
                }).then((response)=>{
                    if(response.data.message){
                        setLoginStatus(response.data.message)
                        localStorage.setItem("loginStatus", false);
                        navigate("/");
                    }else{
                        setLoginStatus(true)    
                        localStorage.setItem("username", username);
                        localStorage.setItem("loginStatus", true);
                        navigate("/HourlyRates");
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

  return (
    <div className='wrapper'>
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div> 

        <div className='loginBox'>
            <div className='login-content'>
                <h1>EduFinace</h1>
                <label for="username">Username</label>
                <input 
                placeholder="Username"
                type="text" 
                onChange={(e)=>{
                    setUsername(e.target.value)
                }}
                autofocus 
                />

                <label for="password">Password</label>
                <input 
                placeholder="Password"
                type="password" onChange={(e)=>{
                    setPassword(e.target.value)
                }}/>
                <button className='login-btn' onClick={login}>Login</button>
                <p className='status' >{loginStatus}</p>
            </div>

        </div>
    </div>
  )
}

export default Login