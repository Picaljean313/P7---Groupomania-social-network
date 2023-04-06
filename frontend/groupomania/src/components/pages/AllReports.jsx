import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import basePath from '../../utils/basePath';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import ReportOverview from '../atoms/ReportOverview';
import colors from '../../utils/colors';


const StyledAllReports = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainAllReports {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.allReportsContainer {
  display : flex;
  flex-direction: column;
  align-items : center;
  width : 100%;
  margin : 40px 0 40px 0;
}

.allReportsButton {
  height : 40px;
  width : 200px;
  margin : 40px 0 40px 0;
  border-radius : 10px;
  background-color :  white;
  font-size : 18px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  border-width : 3px;
  cursor : pointer;
}

.allReportsNoReports {
  margin : 40px 0 40px 0;
  width : 490px;
  height : 70px;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  border-radius : 25px;
  display : flex;
  flex-direction : column;
  align-items: center;
  justify-content : center;
}

.allReportsNoReports p {
  color : ${colors.secondary};
  font-size : 20px;
  margin : 0;
}

@media screen and (max-width: 519px) {
  .allReportsButton {
    height : 35px;
    width : 180px;
    font-size : 16px;
    border-width : 2px;
  }
}

@media screen and (max-width : 649px) {
  .allReportsNoReports {
    width : 70%;
    padding : 20px;
    height : 30px;
  }
  
  .allReportsNoReports p {
    font-size : 16px;
    margin : 0;
  }
}
`

function AllReports () {
  const {token} = useContext(Context);

  const [allReports, setAllReports] = useState("none");
  const [isMoreReportsToShow, setIsMoreReportsToShow] = useState(false);

  const limit = 5;

  const getInitialAllReports = async function () {
    const fetchLimit = limit + 1;
    try {
      const res = await fetch(`${basePath}/reports?limit=${fetchLimit}&sort=desc&userData=true`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if(res.status === 200) {
        const data = await res.json();
        if (data.length === fetchLimit){
          data.splice(data.length - 1, 1);
          setIsMoreReportsToShow(true);
        }

        setAllReports(data);
      }
    }
    catch {
      console.log("Can't get reports");
    }
  };

  useEffect(()=> {
    getInitialAllReports();
  }, []);

  const getMoreAllReports = async function () {
    let maxDate;
    if (allReports.length !== 0){
      maxDate = allReports[allReports.length - 1].creationDate;
    }
    const fetchLimit = limit + 2;
    try {
      const res = await fetch(`${basePath}/reports?limit=${fetchLimit}&sort=desc&userData=true&maxDate=${maxDate}`,{
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        const data = await res.json();

        const newIsMoreReportsToShow = data.length === fetchLimit;
        if (newIsMoreReportsToShow !== isMoreReportsToShow){
          setIsMoreReportsToShow(newIsMoreReportsToShow);
        }

        if (newIsMoreReportsToShow){
          data.splice(data.length - 1, 1);
        }
        data.splice(0,1);
    
        const newAllReports = [];
        if (data.length !==0 && Array.isArray(allReports) && allReports.length !==0){
          for (let i in allReports){
            newAllReports.push(allReports[i]);
          }
          for (let i in data){
            newAllReports.push(data[i])
          }
          setAllReports(newAllReports);
        }
      }
      else {
        console.log("Can't get reports");
      }
    }
    catch {
      console.log("Fail");
    }
  };

  const handleMoreReportsOnClick = () => {
    getMoreAllReports();
  };

  return (
    <StyledAllReports>
      <Header />
      <div className = "mainAllReports" >
        <div className="allReportsContainer" >
          {(Array.isArray(allReports) && allReports.length !== 0) ? allReports.map(e => 
          <ReportOverview key={e._id} reportId={e._id} type={e.postId !== undefined ? "post" : "comment"} postOrCommentId={e.postId !== undefined ? e.postId : e.commentId } reportUserData={e.userData} allReports={allReports} setAllReports={setAllReports} />
          ) : 
          <div className="allReportsNoReports" >
            <p>No reports to show</p>
          </div>}
          {Array.isArray(allReports) && allReports.length !==0 && (isMoreReportsToShow ?
          <button className="allReportsButton" onClick={handleMoreReportsOnClick}>
            View more reports
          </button> : 
            <div className="allReportsNoReports" >
              <p>No more reports to show</p>
            </div>)}
        </div>  
      </div>
    </StyledAllReports>
  )
}
export default AllReports;