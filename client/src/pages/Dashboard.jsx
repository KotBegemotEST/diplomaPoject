import { React,useEffect,useState } from 'react';
import Footer from '../components/Footer'
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import LoginedHeader from '../components/LoginedHeader';



const Dashboard = () => {
    const [loginStatus, setLoginStatus] = useState(null);
    const [isReady, setReady] = useState(false);
    const [username,setUsername] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
      const loggedInUser = localStorage.getItem('loginStatus');
      if (!loggedInUser) {
        navigate('/login');
      }
    }, []);
  
    if (isReady){
      if (!loginStatus){

        return <Navigate replace to="/login" />;
      }
      return(
        <>
         <LoginedHeader  username = { username }/>
          <div>
              <p>Welcome to your Dashboard</p>
          </div>
      <Footer />
        </>
        )
    }

    
}
export default Dashboard;


// function Dashboard() {
    //  const [authenticated, setAuthenticated] = useState(null);
    // useEffect(()=>{
    //   const loggedInUser = localStorage.getItem("loginStatus");
    //       if (loggedInUser) {
    //       setAuthenticated(loggedInUser);
    //         }

    // },[])
    // if (!authenticated){
    //   return <Navigate replace to="/login" />;
    // }else{
    //   return(
    //   <>
    //     <Footer />
    //     <div>
    //         <p>Welcome to your Dashboard</p>
    //     </div>
    //     <Header/>
    //   </>

    //   )

    // }


//     <div>
//             <p>Welcome to your Dashboard</p>
//         </div>

// }

// export default Dashboard