import React, { Fragment, useState, useEffect } from 'react';
import FirebaseProvider from "../services/firebase/config";
import { Link } from 'react-router-dom';

const Main = () => {

    const [posts, setPosts] = useState([]);
   
    const getFirebasePosts = async() => {
      let posts = await FirebaseProvider.getPosts();
      console.log("POSTS: ", posts);
      setPosts(posts)
    
    }

    useEffect(() => {        
      getFirebasePosts();
    }, [])    

    return (
        <Fragment>
            <div className="posts">
            {posts.map( post => {
                return(
                    <div className="post" key={post.id}>
                      <Link to={"post/" + post.id}>
                       <div className='post-cover' style={{backgroundImage: "url(" + post.data.cover + ")" }}></div>
                       <p>{post.data.title}</p>
                       </Link> 
                    </div>

                )
            })}
            </div>
        </Fragment>
    );


}

export default Main;


