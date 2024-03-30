import { useState } from "react"

const RegisterPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const register = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type' : 'application/json'}
        })
        //console.log("Response: ", response);
        if(response.status === 200){
            alert('Register successful');
        }else{
            alert('Register failed');
        }
        // Cách 2 bên dưới cũng được
        // try{
        //     await fetch('http://localhost:4000/register', {
        //         method: 'POST',
        //         body: JSON.stringify({username, password}),
        //         headers: {'Content-Type' : 'application/json'}
        //     })
        //     alert('Registration successfull. Now you can log in')
        // }catch(e){
        //     alert('Registration failed. Please try again later')
        // }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input 
                type="text" 
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
            <input 
                type="password" 
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            <button>Register</button>
        </form>
    )
}

export default RegisterPage
