import React, { Fragment, useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import FirebaseProvider from "../services/firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const New = () => {

   
    const [cover, setCover] = useState("");
    const [isBusy, setIsBusy] = useState(false);
   
    const addPost = async(e) => {
        e.preventDefault();
        setIsBusy(true);

        //console.log("---->", cover)

        //get the form data
        const data = new FormData(e.target);
        
        let post = {
            title: data.get('title'),
            content: data.get('content'),
            cover: cover[0],
        }

        const storage = FirebaseProvider.storage;
        const _ref = ref(storage, cover[0].name);
        
        await uploadBytes(_ref, cover[0]).catch(err => console.log(err));
        //get the file url and then pass it to the post to be uploaded
        const downloadURL = await getDownloadURL(_ref);
        //console.log(downloadURL);
        
        let newPost =  await FirebaseProvider.newPost(post, downloadURL).catch(err => console.log(err));
        if(newPost == undefined){
            alert("An Error Ocurred");
            const imageRef = ref(storage, cover[0].name);
            deleteObject(imageRef)
            .then(() => {
                alert("Image Ref was deleted successfully")
            }).catch(err => {
                alert(err)
            })
        }else{
            alert("Document created successfully")
        }

        setIsBusy(false);
    }

    useEffect(() => {


    }, [])    

    let createForm;
    if(isBusy){
        createForm = (
            <div className="loaderContainer">
                <p>Request is being processed</p>
                <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div> 

        )
    }else{
        createForm = (
           <form onSubmit={addPost}>
               <p>Create the new post</p>

                <label htmlFor="title">Post title:</label>
                <input type="text" name="title" id="title" required  />

                <label htmlFor="content">Post content: </label>
                <textarea name="content" id="content" required minLength="100"  ></textarea>


                <label htmlFor="cover" className="cover">Cover</label>
                <input type="file" id="cover" required onChange={(e) => setCover(e.target.files)} />

                <input type="submit" value="create post" />
           </form>
       ) 
    }

    return (
        <>
          {createForm}
        </>
    );


}

export default New;


