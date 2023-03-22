import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import basePath from "../../utils/basePath";
import { useContext } from "react";
import { Context } from "../../utils/Context";
import { useState } from "react";
import PostDisplayed from "./PostDisplayed";

const StyledReportOverview = styled.div`
display : flex;
width : 700px;
height : 100px;
border : 1px solid green;
justify-content : space-around;
align-items : center;
margin : 20px 0 20px 0;

p {
  margin : 0;
}

.reportOverviewPostDataContainer{
  display : flex;
}

.reportOverviewPostDataContainer img {
  height : 60px;
  width : 80px;
  border-radius : 10px;
  margin : 0 10px 0 0;
}

.reportOverviewPostDataContainer p {
  width : 200px;
  heigth : 60px;
  overflow : scroll;
}

.reportOverviewUserDataContainer {
  display : flex;
}

.reportOverviewUserImage {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.reportOverviewButtonsContainer {
  display : flex;
  flex-direction : column;
}

.postAssociated {
  position : absolute;
  top : 0;
  width : 100%;
  height : 100%;
  display : flex;
  justify-content : center;
}

.postAssociatedBackground {
  position : absolute;
  z-index : 1;
  width : 100%;
  height : 100%;
  background-color : white;
  opacity : 0.5;
  top : 0px;
}
`

function ReportOverview ({type, postOrCommentId, reportUserData}) {
  const navigate = useNavigate();
  const {token} = useContext(Context);

  const [postData, setPostData] = useState("none");
  const [commentData, setCommentData] = useState("none");
  const [postAssociatedData, setPostAssociatedData] = useState("none");
  const [isPostDisplayed, setIsPostDisplayed] = useState(false);

  const handleShowPostReportOnClick = () => {
    setIsPostDisplayed(true);
  };

  const handleShowUserOnClick = () => {
    navigate(`/userProfile/${reportUserData._id}`);
  };

  const getReportPostOrCommentData = async function () {
    if (type === "post"){
      const res = await fetch(`${basePath}/posts/${postOrCommentId}?comments=true&reactions=true&commentsReactions=true&userData=true&commentsUserData=true`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200){
        const data = await res.json();

        setPostData(data);
        setPostAssociatedData(data);
      } else {
        console.log("Can't display post");
      }
    }
    if (type === "comment"){
      const res = await fetch(`${basePath}/comments/${postOrCommentId}?reactions=true&userData=true`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200){
        const data = await res.json();

        setCommentData(data);

        const postRes = await fetch(`${basePath}/posts/${data.postId}?comments=true&reactions=true&commentsReactions=true&userData=true&commentsUserData=true`, {
          method : "GET",
          headers : {
            'Authorization' : `Bearer ${token}`
          }
        });

        if (postRes.status === 200){
          const data = await postRes.json();

          setPostAssociatedData(data);
        } 
        else {
          console.log("Can't get associated post data");
        }

      } else {
        console.log("Can't display comment");
      }
    }
  };

  useEffect(()=>{
    getReportPostOrCommentData();
  },[]);
  
  
  return (
    <StyledReportOverview>
      {type === "post" ? (postData !== "none" &&
      <div className="reportOverviewPostDataContainer">
        <img src={postData.imageUrl} alt='Post image' />
        <p>{postData.content}</p>
      </div>) : (commentData !== "none" &&
      <p>{commentData.content}</p>)}
      <div>
        <p>From : </p>
        <div className="reportOverviewUserDataContainer" >
          <img src={reportUserData.imageUrl} alt='User avatar' className = "reportOverviewUserImage"/>
          <p>{reportUserData.pseudo}</p>
        </div>
      </div>
      <div className="reportOverviewButtonsContainer" >
        <button onClick={handleShowPostReportOnClick} >Show associated post</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
      </div>
      {isPostDisplayed && <div className="postAssociated">
        <div className="postAssociatedBackground"></div>
        <PostDisplayed postDisplayedData={postAssociatedData}  setIsPostDisplayed={setIsPostDisplayed} />
      </div>} 
    </StyledReportOverview>
  );
}

export default ReportOverview;