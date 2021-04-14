
# Application

**Name**: cra-template-coa

**Location**: [webserver1](https://my.auburnalabama.org/cra-template-coa)

**Source**: [BitBucket](https://bitbucket.org/cityofauburnal/cra-template-coa/src)

**Authentication**: ADFS via ADFS1 thru [API](https://api2.auburnalabama.org/department/me)

**External Dependancies**:

- <https://api2.auburnalabama.org/department/apidocs> for data access layer
- SQL - Server: 'sql', Database: COA
  - Schema: TODO
  - Tables: TODO
  - Views: None
  - Stored Procedure: None

**Related Apps**:

- TODO

---

# Platform Notes

This is based on a custom template for CRA (create-react-app)

## Known Issues

1. If the user leaves the browser window open for long enough, it's possible for the coa-authorization cookies to expire but coa-fetch will not retrigger.
2. After an update to the application the push notification status is off and re-enabling it is flaky.

## New features added

1. N/A

## Previous Projects

1. [cra-template-coa](https://github.com/CityOfAuburnAL/cra-template-coa)
2. [my-applications-community-services](https://auburnal@bitbucket.org/cityofauburnal/my-applications-community-services.git)
3. [my-library](https://bitbucket.org/cityofauburnal/my-library/src)

## New Project

1. `npx create-react-app my-cra-template-coa --template cra-template-coa`
2. Rename everything with cra-template-coa
    - README.md
    - package.json
    - manifest.json
    - web.config
    - index.html
    - deploy.js
    - App.js
    - index.js
    - service-worker.js
3. Sub-route is defined in the following places, do not use absolute links
    - package.json
    - web.config
    - App.js
    - service-worker.js

--

# Project Notes

## Bugs (In-Development Status)

1. N/A

## Missing Functionality (In, I over-promised status)

1. N/A

## Desired Functionality (Good thing I didn't promise, status)

1. N/A

## Getting Started

Get the latest source

`git clone https://bitbucket.org/cityofauburnal/my-library/src`

Commands

- `yarn start`
- `yarn build`
- `yarn deploy`

# References

## Starter

[https://code.visualstudio.com/docs/nodejs/reactjs-tutorial](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial)
[http://www.developer-cheatsheets.com/react](http://www.developer-cheatsheets.com/react)
[https://reactjs.org/blog/2018/10/01/create-react-app-v2.html](https://reactjs.org/blog/2018/10/01/create-react-app-v2.html)
[https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill) - Note: Haven't done this

## Auth/Redux Tutorial

[http://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example](http://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example)
[https://stackblitz.com/edit/react-redux-registration-login-example?file=_services%2Fuser.service.js](https://stackblitz.com/edit/react-redux-registration-login-example?file=_services%2Fuser.service.js)

## UI Tutorial

[https://material-ui.com/](https://material-ui.com/)

# Packages

- react-promise-tracker
- react-storage-hooks
- workbox-*

## Redux

yarn install --save redux
yarn install --save redux-react
yarn install --save redux-thunk
yarn install --save redux-logger

### Auth

yarn install --save @casl/react @casl/ability

## Router

yarn install --save react-router
yarn install --save history

## UI

yarn install --save @material-ui/core
yarn install --save @material-ui/icons

## DEV

yarn install --save-dev eslint eslint-loader babel-loader babel-eslint eslint-plugin-react

# Guides

## Styles

See app.js for both acceptable ways to style

1. var styles -> withStyles() brought classes as this.props className={classes.Class} or component.classes={{ overrideClass : classes.Class}} or className={classNames()}
2. import 'Name.css' and use className="Class"

## Links

1. Within Pages use Link from react-router-dom
2. Where can't use link and within App.js onclick handler history.push('/link/route')

## Authorization Development

Add new abilities to /redux/helpers/ability.js
Right now Domain Admins can 'manage' everything and everyone else can manage their dept

## Deploy

1. Need to edit deploy.js to correct location
2. Need to edit manifest.json (see manifest.example.json) in public folder
3. If sub-directory need to edit package.json and Router in App.js
4. Need url rewrite in IIS Does Not Match the Pattern .*\.[\d\w]+$ , rewrite to [/subdirectory]/index.html
[https://medium.com/@svinkle/how-to-deploy-a-react-app-to-a-subdirectory-f694d46427c1](https://medium.com/@svinkle/how-to-deploy-a-react-app-to-a-subdirectory-f694d46427c1)

# WorkFlows

## Authorization Description

App.js -> PrivateRoute checks localStorage -> Redirects to /login if missing
Login -> Calls user.action -> user.service which sets localstorage and user.action then redirects back home

## Abilities

/components/can will inclode /redux/helpers/ability and define permissions
I've made define an update because when someone logs in user.service will update and I wanted to keep the logic the same.
Note: Add positionID to sql.coa.it.SoftwareEmployees?

# Lacking

Cookie Refresh / Auto Logout
