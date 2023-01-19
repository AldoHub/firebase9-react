import { initializeApp } from "firebase/app";
import { getFirestore, doc, addDoc, Timestamp, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { of } from "rxjs";
import {map} from "rxjs/operators";

//firestore
import {collection, getDocs} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";


//add firebase settings here
const config = {
    
}


class FirebaseProvider{

    constructor(){
        this.firebase = initializeApp(config);
        this.firestore = getFirestore(this.firebase);
        this.auth = getAuth(this.firebase);
        this.storage = getStorage(this.firebase, "gs://fir-nine-cb0b5.appspot.com");
     
    }

    //get posts 
    async getPosts(){
      let posts = [];
      const _posts = await getDocs(collection(this.firestore, "posts"));
      
      let x = of(_posts).pipe(
          map(p => {
            p.forEach(_p  => {
                //_p.x = "some new value";
                posts.push({"id":_p.id, "data": _p.data()});
            })

          })
      ).subscribe();

      //in an ideal app, this would go inside the useEffect, but here await is messing with it and cannot 
      //unsubscribe from it, so we do it here and return the posts
      x.unsubscribe();
      return posts;
      
    }


    async newPost(post, url){
        //builld the doc object
        let docData = {
            title: post.title,
            content: post.content,
            cover: url
        }

         return await addDoc(collection(this.firestore, "posts"), docData );
        
    }


    async getPostById(postId){
        const docRef= doc(this.firestore, "posts", postId);
        const docSnap = await getDoc(docRef);

        return docSnap.data()
    }


    async updatePost(postId, postData){
        const docRef = doc(this.firestore, "posts", postId);

        await updateDoc(docRef, {
            title: postData.title,
            content: postData.content,
            cover: postData.cover 
        })

        //delete the old cover if a new one was passed
        if(postData.oldcover){
            console.log("has oldcover prop, should delete old cover image");
            
            const storage = this.storage;
            const imageRef = ref(storage, postData.oldcover);
        
            deleteObject(imageRef)
            .then(() => {
                alert("Image Ref was deleted successfully")
            }).catch(err => {
                alert(err)
            })
        
        }else{
            console.log("no new cover image was found")
        }

    }


    async deletePost(postId, postCover){
        let deletPost = await deleteDoc(doc(this.firestore, "posts", postId)).catch((err) => console.log(err));
       
            const storage = this.storage;
            const imageRef = ref(storage, postCover);
        
            deleteObject(imageRef)
            .then(() => {
                alert("Image Ref was deleted successfully")
            }).catch(err => {
                alert(err)
            })
       

        
    }

}

export default new FirebaseProvider();