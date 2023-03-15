import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import basePath from "../../utils/basePath";
import { useContext } from "react";
import { Context } from "../../utils/Context";
import { useState } from "react";

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
`

function ReportOverview ({type, _id, userData}) {
  const navigate = useNavigate();
  const {token} = useContext(Context);

  const [postData, setPostData] = useState("none");
  const [commentData, setCommentData] = useState("none");

  const handleShowReportOnClick = () => {
  };

  const handleShowUserOnClick = () => {
    navigate(`/userProfile/${userData._id}`);
  };

  const getReportPostOrCommentData = async function () {
    if (type === "post"){
      const res = await fetch(`${basePath}/posts/${_id}`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200){
        const data = await res.json();

        setPostData(data);
      } else {
        console.log("Can't display post");
      }
    }
    if (type === "comment"){
      const res = await fetch(`${basePath}/comments/${_id}`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200){
        const data = await res.json();

        setCommentData(data);
      } else {
        console.log("Can't display comment");
      }
    }
  };

  useEffect(()=>{
    getReportPostOrCommentData();
  },[])
  
  
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
          <img src={userData.imageUrl} alt='User avatar' className = "reportOverviewUserImage"/>
          <p>{userData.pseudo}</p>
        </div>
      </div>
      <div className="reportOverviewButtonsContainer" >
        <button onClick={handleShowReportOnClick} >Show associated post</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
      </div>
    </StyledReportOverview>
  );
}

export default ReportOverview;