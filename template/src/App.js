import React, { useState } from 'react';
import { Switch as SwitchRoute, Route, BrowserRouter } from 'react-router-dom';
//Styles
import './App.css';
//Routing/History/Services
import { userLogin } from './services/coa-authorization';
import { StateProvider } from './services/State'; //should be able to get from NPM but microServices aren't sharing cookie
//Material-ui layout needs
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
//Components
import { SnackbarProvider } from 'notistack';
import AppSkeleton from './components/AppSkeleton';
//Content Pages
import HomePage from './pages/home';
import PermissionsPage from './pages/permissions';
import NotFoundPage from './pages/404';
import { coaFetch } from './services/coa-fetch';

//Layout styles
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: '#03a9f4' }, //lightblue from @material-ui/core/colors/
    secondary: { main: '#ff9800' }, //orange
  },
});


function App() {
  const [userPages, setUserPages] = useState([]);
  // TODO - move out to an appStore.js file?
  // TODO - rewrite `reducer` function in State.js to also update localStorage?
  // TODO - perhaps make a way to update localStorage without saving the data for local timeouts?
  const STORES = {
    CACHED_USER: 'userProfile',
  }
  const initialState = {
    userProfile: JSON.parse(localStorage.getItem(STORES.CACHED_USER)) || {"name":{"fullName":"","firstName":"","lastName":""},"email":"","phone":null,"department":null,"title":null,"employeeNumber":null,"userPrincipalName":"","roles":[],"modules":[]},
  };
  const init = async () => {
    let userProfile = userLogin()
                        .then((user) => {
                          return coaFetch('https://api2.auburnalabama.org/departments/permissions/me')
                            .then((modules) => {
                              const pages = [
                                { name: 'Home', path: '/', module: ''},
                                //{ name: 'Dashboard', path: '/dashboard', module: 'POLICE_ACTIVITY_REPORT'},
                                //{ name: 'Custom Reports', path: '/reports', module: 'POLICE_ACTIVITY_REPORT'},
                                { name: 'Permissions', path: '/permissions', module: ''}
                              ];
                              setUserPages(pages.filter((page) => (!page.module || modules.indexOf(page.module) !== -1)));
                              return { ...user, modules };
                            });
                        });
    let everyoneFinish = await Promise.all([userProfile]);
    return { userProfile: everyoneFinish[0] };
  }
  
  return (
    <SnackbarProvider>
      <StateProvider initialState={initialState} initFn={init}>
        <MuiThemeProvider theme={theme}>
            <BrowserRouter basename={'/cra-template-coa'}>
              <AppSkeleton pages={userPages}>
                <SwitchRoute>
                  <Route exact path={`/`} component={HomePage}></Route>
                  <Route exact path={`/permissions`} component={PermissionsPage}></Route>
                  <Route component={NotFoundPage}/>
                </SwitchRoute>
              </AppSkeleton>
            </BrowserRouter>
        </MuiThemeProvider>
      </StateProvider>
    </SnackbarProvider>
  );
}

export default App;
