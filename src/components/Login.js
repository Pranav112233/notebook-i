import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Login = (props) => {
    const [credentials,setCredentials] = useState({email:"", password : ""});
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email,password: credentials.password })
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            //Save the auth token and redirect
            localStorage.setItem('token',json.authtoken);
            props.showAlert("Logged in Successfully", "success");
            navigate("/");
        }
        else{
            props.showAlert("Invalid credentials", "danger");
        }
    }
    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name] : e.target.value})
    }
    return (
        <div className='mt-2'>
            <h2>Login to continue to MNIT Student's Website</h2>
            <form onSubmit={handleSubmit} >
                <div className="mb-2">
                    <label htmlFor="text" className="form-label">First Name</label>
                    <input type="text" className="form-control" value={credentials.fname} onChange={onChange} id="text" name="text" aria-describedby="texthelp" />
                </div>
                <div className="mb-2">
                    <label htmlFor="text" className="form-label">Last Name</label>
                    <input type="text" className="form-control" value={credentials.lname} onChange={onChange} id="text" name="email" aria-describedby="texthelp" />
                </div>
                <div className="mb-2">
                    <label htmlFor="text" className="form-label">Address</label>
                    <input type="text" className="form-control" value={credentials.address} onChange={onChange} id="text" name="text" aria-describedby="texthelp" />
                </div>
                <div className="mb-2">
                    <label htmlFor="number" className="form-label">Contact Number</label>
                    <input type="number" className="form-control" value={credentials.pno} onChange={onChange} id="number" name="number" aria-describedby="numberhelp" />
                </div>
                <div className="mb-2">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name="password" />
                </div>

                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login
