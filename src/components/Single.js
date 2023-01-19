import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FirebaseProvider from "../services/firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";


const Single = () => {

    const [post, setPost] = useState("");
    const [cover, setCover] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    const getFirebasePostById = async() => {
      let post = await FirebaseProvider.getPostById(id);
      setPost(post);
    
    }

    const updatePost = async(e) => {
        e.preventDefault();
        let downloadURL = "";
        const data = new FormData(e.target);
        
        let _updatePost = {
            title: data.get('title'),
            content: data.get('content'),  
            cover: data.get("oldcover"),
        }
        
        //set the post cover prop and upload to the storage if not empty
        if(cover != ""){
            
            const storage = FirebaseProvider.storage;
            const _ref = ref(storage, cover[0].name);
            
            await uploadBytes(_ref, cover[0]).catch(err => console.log(err));
            //get the file url and then pass it to the post to be uploaded
            downloadURL = await getDownloadURL(_ref);
            _updatePost.cover = downloadURL
            _updatePost.oldcover = data.get("oldcover");
        }

        console.log(_updatePost)
       
        //update the post
        let updatePost =  await FirebaseProvider.updatePost(id, _updatePost).catch(err => console.log(err));
        console.log(updatePost);
        
    }


    const deletePost = async() => {
        await FirebaseProvider.deletePost(id, post.cover);
        navigate("/");
    }

    useEffect(() => {
        getFirebasePostById();

    }, [])    

    return (
        <>
            <div className='post-container'>
                <div className='post-data'>
                    <h1>{post.title}</h1>
                    <div>
                        {post.content}
                    </div>
                </div>
                <div className='post-image'>
                    <img src={post.cover} />
                </div>
            
            </div>

            <form onSubmit={updatePost}>
               <p>Update Post</p>

                <label htmlFor="title">Post title:</label>
                <input type="text" name="title" id="title" required defaultValue={post.title} />

                <label htmlFor="content">Post content: </label>
                <textarea name="content" id="content" required minLength="100" defaultValue={post.content}></textarea>

                <label htmlFor='oldcover'>Old Cover</label>
                <input type='hidden' name='oldcover' id='hidden' defaultValue={post.cover}  />

                <label htmlFor="cover" className="cover">Cover</label>
                <input type="file" id="cover" onChange={(e) => setCover(e.target.files)}  />

                <input type="submit" value="update post" />
           </form>
            
            
            <br/>
            <button onClick={deletePost}>Delete Post</button>

        </>
    );


}

export default Single;


