import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import basePath from "../../utils/basePath";
import { useContext } from "react";
import { Context } from "../../utils/Context";
import { useState } from "react";
import PostDisplayed from "./PostDisplayed";
import colors from "../../utils/colors";

const StyledReportOverview = styled.div `
margin : 20px 0 20px 0;
width : 580px;
background-color : ${colors.tertiary};
box-shadow : 10px 5px 2px #46485b;
border-radius : 25px;
padding : 20px;
display : flex;
align-items : center;
justify-content : space-between;

.reportOverviewPostContainer {
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  display : flex;
  flex-direction : column;
  align-items : center;
  width : 170px;
}

.reportOverviewPostContainer img {
  margin : 5px 0 5px 0;
  width : 120px;
  height : 90px;
  object-fit : cover;
}

.reportOverviewPostContainer p {
  margin : 5px 0 5px 0;
  max-width : 170px;
  max-height : 50px;
  display : block;
  overflow : scroll;
  word-break : break-all;
  font-size : 14px;
  color : #46485b;
  cursor : default;
}

.reportOverviewCommentContainer {
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  display : flex;
  flex-direction : column;
  width : 170px;
}

.reportOverviewCommentLabel {
  align-self : center;
  color : #46485b;
  font-size : 16px;
  margin : 5px 0 5px 0;
}

.reportOverviewCommentContent {
  margin : 5px 0 5px 0;
  max-width : 170px;
  max-height : 50px;
  overflow : scroll;
  word-break : break-all;
  font-size : 14px;
  color : #46485b;
  cursor : default;
}

.reportOverviewUserDataContainer {
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  margin : 0 10px 0 10px;
  display : flex;
  flex-direction : column;
  width : 210px;
}

.reportOverviewUserDataLabel {
  margin : 0 10px 0 0;
  color : #46485b;
  font-size : 16px;
  cursor : default;
  align-self : center;
}

.reportOverviewUserData {
  display : flex;
  align-items : center;
}

.reportOverviewUserData img {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.reportOverviewUserData p {
  max-width : 160px;
  overflow : hidden;
  text-overflow : ellipsis;
  color : #46485b;
  margin : 0;
  cursor : default;
  font-size : 16px;
}

.reportOverviewButtonsContainer {
  display : flex;
  flex-direction : column;
}

.reportOverviewButtonsContainer button {
  height : 30px;
  width : 120px;
  border-radius : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
  margin : 5px 0 5px 0;
}

.reportOverviewPostAssociatedReferencePosition {
  position : absolute;
  z-index : 1;
  width : 100%;
  height : 100%;
  transform : translate(-50%, -50%);
  top : 50%;
  left : 50%;
}

.reportOverviewPostAssociatedBackground {
  width : 100%;
  height : 100%;
  background-color : white;
  opacity : 0.5;
}

.reportOverviewPostAssociatedContainer {
  position : absolute;
  width : 100%;
  height : 100%;
  overflow : scroll;
  top : 0;
  z-index : 2;
}

@media screen and (max-width : 649px) {
  width : 70%;

  .reportOverviewUserDataContainer {
    display : none;
  }

  .reportOverviewButtonsContainer button {
    height : 25px;
    width : 100px;
    font-size : 14px;
  }
}

@media screen and (min-width : 550px) and (max-width : 649px) {
  .reportOverviewPostContainer {
    width : 220px;
  }
  
  .reportOverviewPostContainer img {
    width : 140px;
    height : 100px;
  }
  
  .reportOverviewPostContainer p {
    max-width : 220px;
  }
  
  .reportOverviewCommentContainer {
    width : 220px;
  }
  
  .reportOverviewCommentContent {
    max-width : 220px;
  }
}

@media screen and (max-width : 449px) {
  .reportOverviewPostContainer {
    padding : 10px 5px 10px 5px;
  }
  
  .reportOverviewCommentContainer {
    padding : 10px 5px 10px 5px;
  }

  .reportOverviewPostContainer {
    width : 130px;
  }
  
  .reportOverviewPostContainer img {
    width : 100px;
    height : 80px;
  }
  
  .reportOverviewPostContainer p {
    max-width : 130px;
  }
  
  .reportOverviewCommentContainer {
    width : 130px;
  }
  
  .reportOverviewCommentContent {
    max-width : 130px;
  }
}
`

function ReportOverview ({reportId, type, postOrCommentId, reportUserData, allReports, setAllReports}) {
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

  const handleDeleteReportOnClick = async function () {
    const res = await fetch (`${basePath}/reports/${reportId}`, {
      method : "DELETE",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      const newAllReports = [];
      for (let report of allReports){
        if (report._id !== reportId){
          newAllReports.push(report);
        }
      }

      setAllReports(newAllReports);
    }
  };
  
  
  return (
    <StyledReportOverview>
      {type === "post" ? (postData !== "none" &&
      <div className="reportOverviewPostContainer">
        {postData.imageUrl && <img src={postData.imageUrl} alt='Post image' />}
        {postData.content && <p>{postData.content}</p>}
      </div>) : (commentData !== "none" &&
      <div className="reportOverviewCommentContainer">
        <p className="reportOverviewCommentLabel">Comment : </p>
        <p className="reportOverviewCommentContent">{commentData.content}</p>
      </div>)}
      <div className="reportOverviewUserDataContainer">
        <p className="reportOverviewUserDataLabel">From : </p>
        <div className="reportOverviewUserData" >
          <img src={reportUserData.imageUrl} alt='User avatar'/>
          <p>{reportUserData.pseudo}</p>
        </div>
      </div>
      <div className="reportOverviewButtonsContainer" >
        <button onClick={handleShowPostReportOnClick} >Show post</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
        <button onClick={handleDeleteReportOnClick} >Delete report</button>
      </div>
      {isPostDisplayed && <div className="reportOverviewPostAssociatedReferencePosition">
        <div className="reportOverviewPostAssociatedBackground"></div>
        <div className="reportOverviewPostAssociatedContainer">
          <PostDisplayed postDisplayedData={postAssociatedData}  setIsPostDisplayed={setIsPostDisplayed} />
        </div>
      </div>} 
    </StyledReportOverview>
  );
}

export default ReportOverview;