import {format, formatISO9075} from 'date-fns';
import { Link } from 'react-router-dom';

const Post = ({_id, title, summary, cover, content, createdAt, author}) => {
    return (
        <div className='post'>
            <div className="image">
              <Link to={`/posts/${_id}`}>
                <img src={'http://localhost:4000/'+cover} alt=""/>
              </Link>
            </div>
            <div className="texts">
              <Link to={`/posts/${_id}`}>
                <h2>{title}</h2>
              </Link>
              <p className="info">
                <span className="author">{author.username}</span>
                {/* 2024-02-22 18:07:16 */}
                <time>{formatISO9075(new Date(createdAt))}</time>
                {/* Feb 22, 2024 18:07 */}
                {/* <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time> */}
              </p>
              <p className='summary'>{summary}</p>
            </div>
        </div>
    )
}

export default Post
