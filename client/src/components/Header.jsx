import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext";

const Header = () => {

    // bug : khi ta đăng nhâp thì header vẫn chưa hiện username, nó chỉ hiện khi ta refresh sau khi đăng nhập
    // Nguyên nhân : Phải gửi cookie (request) lên server mới chạy được hàm profile do ta mới chỉ Set-Cookie ở response nên không chạy được
    // Giải pháp dùng context
    // const [username, setUsername] = useState(null); bỏ đoạn code này đi

    const {userInfo, setUserInfo} = useContext(UserContext);
  
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then((response) => {
            response.json().then((userInfo) => {
                //setUsername(userInfo.username);
                setUserInfo(userInfo)
            });
        });
    }, []);

    const logout = () => {
        //e.preventDefault();
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        })
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to='/' className='logo'>My Blog</Link>
            <nav>
                {
                    !!username && (
                        <>
                            <Link to={'/create'}>Create new post</Link>
                            <a onClick={logout}>Logout</a>
                        </>
                    )
                }
                {
                    !username && (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )
                }
            </nav>
        </header>
    )
}

export default Header
