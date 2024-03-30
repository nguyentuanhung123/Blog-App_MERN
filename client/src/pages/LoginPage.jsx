import { useContext, useState } from "react";
import { Navigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

const LoginPage = () => {

    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    const login = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type' : 'application/json'},
            credentials: 'include' //cho phép trình duyệt gửi các cookie và các thông tin chứng thực khác khi gửi yêu cầu. Điều này thường được sử dụng khi bạn muốn duy trì phiên làm việc (session) giữa các yêu cầu.
            // sẽ bị lỗi CORS phải bổ sung thêm thông tin trong index.js ở app.use(cors());
        })
        //console.log('Response: ', response);
        if(response.ok){
            response.json().then((userInfo) => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        }else{
            alert('wrong credentials');
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
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
            <button>Login</button>
        </form>
    )
}

export default LoginPage
