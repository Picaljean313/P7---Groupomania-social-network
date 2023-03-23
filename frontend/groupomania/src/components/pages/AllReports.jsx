import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import basePath from '../../utils/basePath';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import ReportOverview from '../atoms/ReportOverview';


const StyledAllReports = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;
position : relative;

.mainAllReports {
  overflow : scroll;
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
        {(Array.isArray(allReports) && allReports.length !== 0) ? allReports.map(e => 
        <ReportOverview key={e._id} reportId={e._id} type={e.postId !== undefined ? "post" : "comment"} postOrCommentId={e.postId !== undefined ? e.postId : e.commentId } reportUserData={e.userData} allReports={allReports} setAllReports={setAllReports} />
        ) : <p>No reports to show</p>}
        <div className="allReportsContainer" >
          {Array.isArray(allReports) && allReports.length !==0 && (isMoreReportsToShow ?
          <button className="allReportsButton" onClick={handleMoreReportsOnClick}>
            View more reports
          </button> : 
          <p>No more reports to show</p>)}
        </div>  
      </div>
    </StyledAllReports>
  )
}
export default AllReports;