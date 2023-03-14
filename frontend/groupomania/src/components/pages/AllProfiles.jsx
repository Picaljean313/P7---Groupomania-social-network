import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import basePath from '../../utils/basePath';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import ProfileOverview from '../atoms/ProfileOverview';


const StyledAllProfiles = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainAllProfiles {
  position : relative;
  overflow : scroll;
}

`

function AllProfiles () {
  const {token} = useContext(Context);

  const [allProfiles, setAllProfiles] = useState("none");
  const [isMoreProfilesToShow, setIsMoreProfilesToShow] = useState(false);

  const limit = 5;

  const getInitialAllProfiles = async function () {
    const fetchLimit = limit + 1;
    try {
      const res = await fetch(`${basePath}/users?limit=${fetchLimit}&sort=desc&activity=true`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if(res.status === 200) {
        const data = await res.json();
        if (data.length === fetchLimit){
          data.splice(data.length - 1, 1);
          setIsMoreProfilesToShow(true);
        }
        setAllProfiles(data);
      }
    }
    catch {
      console.log("Can't get profiles");
    }
  };

  useEffect(()=> {
    getInitialAllProfiles();
  }, []);

  const getMoreAllProfiles = async function () {
    let maxDate;
    if (allProfiles.length !== 0){
      maxDate = allProfiles[allProfiles.length - 1].creationDate;
    }
    const fetchLimit = limit + 2;
    try {
      const res = await fetch(`${basePath}/users?limit=${fetchLimit}&sort=desc&activity=true&maxDate=${maxDate}`,{
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        const data = await res.json();

        const newIsMoreProfilesToShow = data.length === fetchLimit;
        if (newIsMoreProfilesToShow !== isMoreProfilesToShow){
          setIsMoreProfilesToShow(newIsMoreProfilesToShow);
        }

        if (newIsMoreProfilesToShow){
          data.splice(data.length - 1, 1);
        }
        data.splice(0,1);
    
        const newAllProfiles = [];
        if (data.length !==0 && Array.isArray(allProfiles) && allProfiles.length !==0){
          for (let i in allProfiles){
            newAllProfiles.push(allProfiles[i]);
          }
          for (let i in data){
            newAllProfiles.push(data[i])
          }
          setAllProfiles(newAllProfiles);
        }
      }
      else {
        console.log("Can't get profiles");
      }
    }
    catch {
      console.log("Fail");
    }
  };

  const handleMoreProfilesOnClick = () => {
    getMoreAllProfiles();
  };

  return (
    <StyledAllProfiles>
      <Header />
      <div className = "mainAllProfiles" >
        {(Array.isArray(allProfiles) && allProfiles.length !== 0) ? allProfiles.map(e => 
        <ProfileOverview key={e._id} _id ={e._id} pseudo={e.pseudo} imageUrl={e.imageUrl} email={e.email} isAdmin={e.isAdmin} activity={e.activity} />
        ) : <p>No profiles to show</p>}
        <div className="allProfilesContainer" >
          {Array.isArray(allProfiles) && (isMoreProfilesToShow ?
          <button className="allProfilesButton" onClick={handleMoreProfilesOnClick}>
            View more profiles
          </button> : 
          <p>No more profiles to show</p>)}
        </div>  
      </div>
    </StyledAllProfiles>
  )
}
export default AllProfiles;