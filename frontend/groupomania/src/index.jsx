import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyle from './utils/GlobalStyle';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Welcome from './components/pages/Welcome';
import SignUp from './components/pages/SignUp';
import LogIn from './components/pages/LogIn';
import Home from './components/pages/Home';
import MyProfile from './components/pages/MyProfile';
import ModifyMyProfile from './components/pages/ModifyMyProfile';
import CreateUser from './components/pages/CreateUser';
import UserProfile from './components/pages/UserProfile';
import ModifyProfile from './components/pages/ModifyProfile';
import AllProfiles from './components/pages/AllProfiles';
import AllPosts from './components/pages/AllPosts';
import AllComments from './components/pages/AllComments';
import AllReports from './components/pages/AllReports';
import Error from './components/pages/Error';
import {ContextProvider} from './utils/Context';
import TokenRedirectionLayout from './utils/TokenRedirectionLayout';
import NoTokenRedirectionLayout from './utils/NoTokenRedirectionLayout';
import NoIsAdminRedirectionLayout from './utils/NoIsAdminRedirectionLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <GlobalStyle />
        <Routes>
          <Route element= {<TokenRedirectionLayout />}>
            <Route path="/" element={<Welcome />}/>
            <Route path="/signUp" element= {<SignUp />}/>
            <Route path="/logIn" element= {<LogIn />}/>
          </Route>
          <Route element= {<NoTokenRedirectionLayout />}>
            <Route path="/home" element= {<Home />}/>
            <Route path="/myProfile" element= {<MyProfile />}/>
            <Route path="/modifyMyProfile" element= {<ModifyMyProfile />}/>
            <Route path="/userProfile/:userId" element= {<UserProfile />}/>
            <Route element= {<NoIsAdminRedirectionLayout />}>
              <Route path="/createUser" element= {<CreateUser />}/>
              <Route path="/modifyProfile/:userId" element= {<ModifyProfile />}/>
              <Route path="/allProfiles" element= {<AllProfiles />}/>
              <Route path="/allPosts" element= {<AllPosts />}/>
              <Route path="/allComments" element= {<AllComments />}/>
              <Route path="/allReports" element= {<AllReports />}/>
            </Route>
          </Route>
          <Route path="*" element= {<Error />}/>
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
