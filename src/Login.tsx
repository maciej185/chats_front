import configData from './config.json'
import { setCookie } from "./utils"
import { MouseEventHandler, useState } from 'react'
import './styles/Login.css'

import { useNavigate, Link } from 'react-router-dom'

export async function login(username: string, password: string, error: string | null, usernameSetter: CallableFunction, tokenSetter: CallableFunction, errorSetter: CallableFunction) {
    const endpointUrl = configData.API_URL + ':' + configData.API_PORT + configData.LOGIN_ENDPOINT
    const data = new URLSearchParams()
    data.append("username", username)
    data.append("password", password)
    const res = await fetch(endpointUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
            },
        body: data
    })
    const resJSON = await res.json()
    if (res.status === 200) {
        usernameSetter(username)
        tokenSetter(resJSON.access_token)
        
        setCookie("username", username)
        setCookie("token", resJSON.access_token)

        if (error) errorSetter(null)

        return true

    } else if (res.status === 401) {
        errorSetter(resJSON["detail"])
        return false
    } else {
        errorSetter(resJSON["There was a network issue, please try again later."])
        return false
    }
}

interface LoginProps {
    setUsername: CallableFunction, 
    setToken: CallableFunction
}

export default function Login({setUsername, setToken}: LoginProps) {
    const [inputUsername, setInputUsername] = useState<string>("")
    const [inputPassword, setInputPassword] = useState<string>("") 
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    const buttonHandleClick: MouseEventHandler = (e) => {
        (async function() {
            const loginSuccessful = await login(inputUsername, inputPassword, error, setUsername, setToken, setError)
            if (loginSuccessful) navigate("/")
        })()
    }

    return <div className="login">
        <div className="login-top">
            {error ? <div className="login-top-error">
                {error}
            </div> : <></>}
            <div className="login-top-form">
                <div className="login-top-form-username">
                    <div className="login-top-form-username-label login-top-form-input-label">Username</div>
                    <input type="text" value={inputUsername} onChange={(e) => {setInputUsername(e.target.value)}} name="username" id="username"/>
                </div>
                <div className="login-top-form-password">
                    <div className="login-top-form-password-label login-top-form-input-label">Password</div>
                    <input type="password" value={inputPassword} onChange={(e) => {setInputPassword(e.target.value)}} name="password" id="password"/>    
                </div>
                <div className="login-top-form-button">
                    <button onClick={buttonHandleClick}>Login</button>
                </div>
            </div>
        </div>
        <div className="login-bottom">
            If you don't already have an account, you can register <Link to="/register">here</Link>.
        </div>
    </div>
}