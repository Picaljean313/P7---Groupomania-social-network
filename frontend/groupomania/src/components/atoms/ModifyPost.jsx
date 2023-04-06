import styled from "styled-components";
import { useState } from "react";
import basePath from "../../utils/basePath";
import { useContext } from "react";
import { Context } from "../../utils/Context";
import colors from "../../utils/colors";

const StyledModifyPost = styled.div `
width : 402px;
background-color : white;
border : outset 3px ${colors.primary};
border-radius : 20px;
display : flex;
flex-direction : column;
align-items: center;
margin-top : 30px;

.modifyPostForm {
  display : flex;
  flex-direction : column;
  align-items : center;
}

.modifyPostSelectContainer {
  width : 362px;
  margin : 20px 20px 0 20px;
  display : flex;
  align-items : center;
}

.modifyPostSelectContainer label {
  color : #46485b;
  margin-right : 10px;
  font-size : 18px;
}

.modifyPostSelectContainer select {
  color : #46485b;
  font-size : 16px;
}

.modifyPostForm textarea {
  min-width : 300px;
  max-width : 300px;
  min-height : 20px;
  max-height : 100px;
  color : #46485b;
  font-size : 14px;
  margin-top : 20px;
}

.modifyPostForm input {
  color : #46485b;
  margin-top : 20px;
}

.modifyPostForm input::file-selector-button  {
  color : #46485b;
}

.modifyPostButtonsContainer {
  display : flex;
  margin : 20px;
  justify-content : center;
}

.modifyPostButtonsContainer button {
  height : 30px;
  border-radius : 10px;
  width : 80px;
  margin : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
}

@media screen and (max-width: 519px) {
  width : 90%;
  
  .modifyPostSelectContainer {
    width : 90%;
    flex-direction : column;
  }
  
  .modifyPostSelectContainer label {
    margin-bottom : 10px;
  }
  
  .modifyPostForm textarea {
    min-width : 250px;
    max-width : 250px;
  }
  
  .modifyPostButtonsContainer button {
    height : 25px;
    font-size : 14px;
  }
}
`

function ModifyPost ({postId, content, imageUrl, setIsModifyPost, setPostContent, setPostImageUrl}) {
  const {token} = useContext(Context);

  const [isModifyContent, setIsModifyContent] = useState(false);
  const [isModifyImage, setIsModifyImage] = useState(false);
  const [isAddContent, setIsAddContent] = useState(false);
  const [isAddImage, setIsAddImage] = useState(false);

  const handleCancelModifyPostOnClick = () => {
    setIsModifyPost(false);
  };

  const handleModifyContentOnChange = () => {
    if (document.getElementById(`modifyPostContentSelection${postId}`).value === "modifyContent"){
      setIsModifyContent(true);
    }
    else {
      setIsModifyContent(false);
    }
  };

  const handleAddContentOnChange = () => {
    if (document.getElementById(`modifyPostAddContentSelection${postId}`).value === "addContent"){
      setIsAddContent(true);
    }
    else {
      setIsAddContent(false);
    }
  };

  const handleModifyImageOnChange = () => {
    if (document.getElementById(`modifyPostImageSelection${postId}`).value === "modifyImage"){
      setIsModifyImage(true);
    }
    else {
      setIsModifyImage(false);
    }
  };

  const handleAddImageOnChange = () => {
    if (document.getElementById(`modifyPostAddImageSelection${postId}`).value === "addImage"){
      setIsAddImage(true);
    }
    else {
      setIsAddImage(false);
    }
  };


  const handleModifyPostOnSubmit = async function (event) {
    event.preventDefault();

    if (!content){
      const addContentSelection = document.getElementById(`modifyPostAddContentSelection${postId}`).value;
      const modifyImageSelection = document.getElementById(`modifyPostImageSelection${postId}`).value; 

      if (addContentSelection === "noContent") {
        if (modifyImageSelection !== "modifyImage") return
        if (document.getElementById(`modifyPostModifyImage${postId}`).files[0] === undefined) return

        const formData = new FormData();
        formData.append("image", document.getElementById(`modifyPostModifyImage${postId}`).files[0]);

        const res = await fetch(`${basePath}/posts/${postId}`, {
          method : "PUT",
          headers : {
            'Authorization' : `Bearer ${token}`
          },
          body : formData
        });

        if (res.status === 200){ 
          const data = await res.json();

          setIsModifyPost(false);
          setPostImageUrl(data.imageUrl);

          return alert("Post modified");
        }
        else return console.log("Modification failed")
      }

      if (addContentSelection === "addContent") {
        const addContentValue = document.getElementById(`modifyPostAddContent${postId}`).value;
        if (addContentValue.length < 1 || addContentValue.length > 1000 ) return

        if (modifyImageSelection === "keepImage"){
          const res = await fetch(`${basePath}/posts/${postId}`, {
            method : "PUT",
            headers : {
              'Accept': 'application/json', 
              'Content-Type': 'application/json', 
              'Authorization' : `Bearer ${token}`
            },
            body : JSON.stringify({
              content : addContentValue,
              deletePostImage : false,
              deletePostContent : false
            })
          });
  
          if (res.status === 200){ 
            setIsModifyPost(false);
            setPostContent(addContentValue);
  
            return alert("Post modified");
          }
          else return console.log("Modification failed");
        } 
        if (modifyImageSelection === "modifyImage"){
          if (document.getElementById(`modifyPostModifyImage${postId}`).files[0] === undefined) return

          const formData = new FormData();
          formData.append("post", JSON.stringify({content : addContentValue}))
          formData.append("image", document.getElementById(`modifyPostModifyImage${postId}`).files[0]);
  
          const res = await fetch(`${basePath}/posts/${postId}`, {
            method : "PUT",
            headers : {
              'Authorization' : `Bearer ${token}`
            },
            body : formData
          });
  
          if (res.status === 200){ 
            const data = await res.json();
  
            setIsModifyPost(false);
            setPostContent(addContentValue)
            setPostImageUrl(data.imageUrl);
  
            return alert("Post modified");
          }
          else return console.log("Modification failed")
        }
        if (modifyImageSelection === "deleteImage"){
          const res = await fetch(`${basePath}/posts/${postId}`, {
            method : "PUT",
            headers : {
              'Accept': 'application/json', 
              'Content-Type': 'application/json', 
              'Authorization' : `Bearer ${token}`
            },
            body : JSON.stringify({
              content : addContentValue,
              deletePostImage : true,
              deletePostContent : false
            })
          });
  
          if (res.status === 200){ 
            setIsModifyPost(false);
            setPostContent(addContentValue);
            setPostImageUrl(undefined);
  
            return alert("Post modified");
          }
          else return console.log("Modification failed");
        }
      }
    }

    if (!imageUrl){
      const modifyContentSelection = document.getElementById(`modifyPostContentSelection${postId}`).value; 
      const addImageSelection = document.getElementById(`modifyPostAddImageSelection${postId}`).value;

      if (addImageSelection === "noImage") {
        if (modifyContentSelection !== "modifyContent") return

        const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
        if (modifyContentValue === content || modifyContentValue.length < 1 || modifyContentValue  > 1000) return

        const res = await fetch(`${basePath}/posts/${postId}`, {
          method : "PUT",
          headers : {
            'Accept': 'application/json', 
            'Content-Type': 'application/json', 
            'Authorization' : `Bearer ${token}`
          },
          body : JSON.stringify({
            content : modifyContentValue,
            deletePostContent : false,
            deletePostImage : false
          })
        });

        if (res.status === 200){ 
          setIsModifyPost(false);
          setPostContent(modifyContentValue);

          return alert("Post modified");
        }
        else return console.log("Modification failed")
      }

      if (addImageSelection === "addImage") {
        const addImageValue = document.getElementById(`modifyPostAddImage${postId}`).files[0];
        if (addImageValue === undefined) return

        if (modifyContentSelection === "keepContent"){
          const formData = new FormData();
          formData.append("image", addImageValue);

          const res = await fetch(`${basePath}/posts/${postId}`, {
            method : "PUT",
            headers : {
              'Authorization' : `Bearer ${token}`
            },
            body : formData
          });
  
          if (res.status === 200){ 
            const data = await res.json();
  
            setIsModifyPost(false);
            setPostImageUrl(data.imageUrl);
  
            return alert("Post modified");
          }
          else return console.log("Modification failed");
        } 

        if (modifyContentSelection === "modifyContent"){
          const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
          if (modifyContentValue === content || modifyContentValue.length < 1 || modifyContentValue  > 1000) return

          const formData = new FormData();
          formData.append("post", JSON.stringify({content : modifyContentValue}))
          formData.append("image", addImageValue);
  
          const res = await fetch(`${basePath}/posts/${postId}`, {
            method : "PUT",
            headers : {
              'Authorization' : `Bearer ${token}`
            },
            body : formData
          });
  
          if (res.status === 200){ 
            const data = await res.json();
  
            setIsModifyPost(false);
            setPostContent(modifyContentValue)
            setPostImageUrl(data.imageUrl);
  
            return alert("Post modified");
          }
          else return console.log("Modification failed")
        }

        if (modifyContentSelection === "deleteContent"){
          const formData = new FormData();
          formData.append("post", JSON.stringify({deletePostContent : true}));
          formData.append("image", addImageValue)

          const res = await fetch(`${basePath}/posts/${postId}`, {
            method : "PUT",
            headers : {
              'Authorization' : `Bearer ${token}`
            },
            body : formData
          });
  
          if (res.status === 200){ 
            const data = await res.json();

            setIsModifyPost(false);
            setPostContent(undefined);
            setPostImageUrl(data.imageUrl);
  
            return alert("Post modified");
          }
          else return console.log("Modification failed");
        }
      }
    }

    const modifyContentSelection = document.getElementById(`modifyPostContentSelection${postId}`).value; 
    const modifyImageSelection = document.getElementById(`modifyPostImageSelection${postId}`).value; 

    if (modifyContentSelection === "keepContent" && modifyImageSelection === "keepImage") return 
    if (modifyContentSelection === "deleteContent" && modifyImageSelection === "deleteImage") return 

    if (modifyContentSelection === "modifyContent"){
      const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
      if (modifyContentValue === content || modifyContentValue.length < 1 || modifyContentValue  > 1000) return
    }
    if (modifyImageSelection === "modifyImage" && document.getElementById(`modifyPostModifyImage${postId}`).files[0] === undefined) return

    if (modifyImageSelection === "modifyImage"){
      const formData = new FormData();
      formData.append("image", document.getElementById(`modifyPostModifyImage${postId}`).files[0]);

      if (modifyContentSelection === "modifyContent"){
        const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
        formData.append("post", JSON.stringify({content : modifyContentValue}))
      }
      if (modifyContentSelection === "deleteContent"){
        formData.append("post", JSON.stringify({deletePostContent : true}));
      }

      const res = await fetch(`${basePath}/posts/${postId}`, {
        method : "PUT",
        headers : {
          'Authorization' : `Bearer ${token}`
        },
        body : formData
      });

      if (res.status === 200){ 
        const data = await res.json();

        setIsModifyPost(false);
        setPostImageUrl(data.imageUrl);

        if (modifyContentSelection === "modifyContent"){
          const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
          setPostContent(modifyContentValue);
        }

        if (modifyContentSelection === "deleteContent"){
          setPostContent(undefined);
        }

        return alert("Post modified");
      }
      else return console.log("Modification failed");
    }

    const dataToSend = {};

    if (modifyImageSelection === "keepImage") {
      if (modifyContentSelection === "modifyContent"){
        const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
        dataToSend.content = modifyContentValue;
      }
      if (modifyContentSelection === "deleteContent"){
        dataToSend.deletePostContent = true;
      }
    }

    if (modifyImageSelection === "deleteImage") {
      dataToSend.deletePostImage = true;

      if (modifyContentSelection === "modifyContent"){
        const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
        dataToSend.content = modifyContentValue;
      }
    }

    const res = await fetch(`${basePath}/posts/${postId}`, {
      method : "PUT",
      headers : {
        'Accept': 'application/json', 
        'Content-Type': 'application/json', 
        'Authorization' : `Bearer ${token}`
      },
      body : JSON.stringify(dataToSend)
    });

    if (res.status === 200){ 
      setIsModifyPost(false);

      if (modifyContentSelection === "modifyContent"){
        const modifyContentValue = document.getElementById(`modifyPostModifyContent${postId}`).value;
        setPostContent(modifyContentValue);
      }
      if (modifyContentSelection === "deleteContent"){
        setPostContent(undefined);
      }
      if (modifyImageSelection === "deleteImage") {
        setPostImageUrl(undefined);
      }

      return alert("Post modified");
    }
    else return console.log("Modification failed")
  };

  return (
    <StyledModifyPost>
      <form className="modifyPostForm" onSubmit = { handleModifyPostOnSubmit }>
        {content ?
        <div className="modifyPostSelectContainer">
          <label htmlFor = {`modifyPostContentSelection${postId}`} >Modify post content : </label>
          <select id={`modifyPostContentSelection${postId}`} defaultValue="keepContent" onChange={handleModifyContentOnChange} >
            <option value="keepContent" >Don't change content</option>
            <option value="modifyContent" >Modify content</option>
            <option value="deleteContent" >Delete content</option>
          </select>
        </div> :
        <div className="modifyPostSelectContainer">
          <label htmlFor = {`modifyPostAddContentSelection${postId}`} >Add content : </label>
          <select id={`modifyPostAddContentSelection${postId}`} defaultValue="noContent" onChange={handleAddContentOnChange} >
            <option value="noContent" >Don't add content</option>
            <option value="addContent" >Add content</option>
          </select>
        </div>}
        {isModifyContent &&
        <div className="modifyPostInputContainer">
          <textarea id = {`modifyPostModifyContent${postId}`} type = "text" defaultValue={content} maxLength = "1000" />
        </div>}
        {isAddContent &&
        <div className="modifyPostInputContainer">
          <textarea id = {`modifyPostAddContent${postId}`} type = "text" defaultValue="" maxLength = "1000" />
        </div>}
        {imageUrl ?
        <div className="modifyPostSelectContainer">
          <label htmlFor = {`modifyPostImageSelection${postId}`} >Modify post image : </label>
          <select id={`modifyPostImageSelection${postId}`} defaultValue="keepImage" onChange={handleModifyImageOnChange} >
            <option value="keepImage" >Don't change image</option>
            <option value="modifyImage" >Modify image</option>
            <option value="deleteImage" >Delete image</option>
          </select>
        </div> : 
        <div className="modifyPostSelectContainer">
          <label htmlFor = {`modifyPostAddImageSelection${postId}`} >Add image : </label>
          <select id={`modifyPostAddImageSelection${postId}`} onChange={handleAddImageOnChange} >
            <option value="noImage" >Don't add image</option>
            <option value="addImage" >Add image</option>
          </select>
        </div>}
        {isModifyImage &&
        <div className="modifyPostInputContainer">
          <input id = {`modifyPostModifyImage${postId}`} type="file" accept= "image/png, image/jpeg, image/jpg" />
        </div>}
        {isAddImage &&
        <div className="modifyPostInputContainer">
          <input id = {`modifyPostAddImage${postId}`} type="file" accept= "image/png, image/jpeg, image/jpg" />
        </div>}
        <div className="modifyPostButtonsContainer">
          <button type="submit">Modify</button>
          <button onClick={handleCancelModifyPostOnClick} >Cancel</button>
        </div>
      </form>
    </StyledModifyPost>
  )
};

export default ModifyPost;