//npm i react-quill
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Editor from '../components/Editor';

const CreatePostPage = () => {

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');

    const [redirect, setRedirect] = useState(false);

    const cretateNewPost = async(e) => {
        // vì phải gửi cả ảnh nên thay vì gửi data dưới dạng JSON như bình thường , ta sẽ gửi dưới dạng Form Data;
        const data = new FormData(); // Xem ở Payload Network khi ta bấm gửi Data
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]); // do ở dạng List nên ta muốn chỉ chọn bức ảnh đầu tiên kể cả khi ta chọn nhiều
        e.preventDefault();
        const response = await fetch('http://localhost:4000/posts', {
            method: 'POST',
            body: data,
            credentials: 'include' // gửi cả cookie
        });
        //console.log('Info of Image or Post: ', await response.json()); // muốn xem ở console thì ta phải để ở dạng json
        //console.log(files);
        if(response.ok){
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <form onSubmit={cretateNewPost}>
            <input 
                type="text" 
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}/>
            <input 
                type="text" 
                placeholder="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}/>
            <input 
                type="file" 
                //value={files} -> Không được để value chỗ này vì nó sẽ báo lỗi
                onChange={(e) => setFiles(e.target.files)}/>
            <Editor content={content} setContent={setContent}/>
            <button style={{marginTop: '5px'}}>Create Post</button>
        </form>
    )
}

export default CreatePostPage
