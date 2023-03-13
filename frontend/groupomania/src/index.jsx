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
            <Route element= {<NoIsAdminRedirectionLayout />}>
              <Route path="/createUser" element= {<CreateUser />}/>
            </Route>
          </Route>
          <Route path="*" element= {<Error />}/>
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
