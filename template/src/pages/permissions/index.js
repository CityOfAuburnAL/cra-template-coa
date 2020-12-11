import React, { useState, useEffect } from 'react';
import { coaFetch } from '../../services/coa-fetch';
import { useStateStore } from '../../services/State';
import './index.css';

export default function PermissionsPage() {
    const [ permissions, setPermissions ] = useState([]);
    const policyRoleTypes = [ "Department", "Role", "Title", "Employee" ];
    const [user] = useStateStore('userProfile');

    useEffect(() => {
        coaFetch('https://api2.auburnalabama.org/departments/permissions')
            //.then((data) => data.filter((policies) => Object.keys(policies.policyRoleTypes).length > 0)) // Filter out permissions which don't have configured role types
            .then((data) => data.filter((policies) => policies.name === 'POLICE_ACTIVITY_REPORT')) // Filter out permissions not for this module
            .then(setPermissions)
    }, []);

    return (
        <section id="permissionsPage">
            <header>
                <h2>App Permissions</h2>
            </header>
            <aside>
                <section>
                    <dl>
                        <dt>Department</dt>
                        <dd>{user.department}</dd>
                        <dt>Title</dt>
                        <dd>{user.title}</dd>
                        <dt>Employee Number</dt>
                        <dd>{user.employeeNumber}</dd>
                    </dl>
                    <p>Permissions to different functionality in this application can be granted by department, title, network account groups (roles), or if neccesary to individuals via their employee number. Below you'll see a list of the current groups granted access to this application. You may verify this is the correct access list or request a change to the permissions via an IT work request.</p>
                </section>
            </aside>
            <main className="main">
                {permissions.map((permissionSet, i) => (
                    <section key={i}>
                        <header><h3>{permissionSet.name.replace(/_/g, ' ')}</h3></header>
                        <main>
                            {policyRoleTypes.map((type, j) => (
                                <section key={j}>
                                    <header>
                                        <h4>{type}</h4>
                                    </header>
                                    <ul>
                                        {permissionSet.policyRoleTypes[type].sort().map((listItem, k) => (
                                            <li key={k}>{listItem}</li>
                                        ))}
                                        {!permissionSet.policyRoleTypes[type].length && <li>N/A</li>}
                                    </ul>
                                    
                                </section>
                            ))}
                        </main>
                    </section>
                ))}
            </main>
        </section>
    );
}