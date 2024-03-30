import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = ({content, setContent}) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    return (
        <ReactQuill 
            value={content} 
            onChange={setContent}
            modules={modules}
            formats={formats}
        />
    )
}

export default Editor
