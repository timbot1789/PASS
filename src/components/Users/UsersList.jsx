// React Imports
import React, { useContext } from 'react';
// Inrupt Imports
import { getPodUrlAll } from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { runNotification, deleteUserFromPod, getUserListActivity } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext, UserListContext } from '../../contexts';
// Component Imports
import FormSection from '../Form/FormSection';

/**
 * UsersList Component - Component that generates UsersList section for PASS
 * which interfaces with Solid Pod to fetch user list
 *
 * @memberof Users
 * @name UsersList
 */

const UsersList = ({ loadingActive }) => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { setSelectedUser } = useContext(SelectUserContext);
  const { userList, setUserList } = useContext(UserListContext);

  // Event handler for selecting user from users list
  const handleSelectUser = async (userToSelect, selectedUserUrl) => {
    runNotification(`User "${userToSelect}" selected.`, 3, state, dispatch);
    setSelectedUser(selectedUserUrl.split('/')[2].split('.')[0]);
  };

  // Event handler for deleting user from users list
  const handleDeleteUser = async (user) => {
    if (
      !window.confirm(
        `You're about to delete user ${user.person} from users list, do you wish to continue?`
      )
    ) {
      return;
    }

    let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0];
    podUrl = podUrl || session.info.webId.split('profile')[0];
    runNotification(`Deleting user "${user.person}" from Solid...`, 3, state, dispatch);
    let listUsers = await deleteUserFromPod(session, user, podUrl);
    listUsers = await getUserListActivity(session, listUsers);
    runNotification(`User "${user.person}" deleted from Solid...`, 3, state, dispatch);
    setUserList(listUsers);
  };

  const tableStyle = {
    margin: '20px 0',
    width: '100%',
    textAlign: 'center'
  };

  return (
    <FormSection title="Users List" state={state} statusType="Status" defaultMessage="No actions">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Web Id</th>
            <th>Last Active Date</th>
            <th>Select User</th>
            <th>Delete User</th>
          </tr>
        </thead>
        <tbody>
          {userList
            ? userList.map((user) => (
                <tr key={user.webId}>
                  <td>{user.givenName}</td>
                  <td>{user.familyName}</td>
                  <td>
                    <a href={user.webId} target="_blank" rel="noreferrer">
                      {user.webId}
                    </a>
                  </td>
                  {loadingActive ? (
                    <td>Loading...</td>
                  ) : (
                    <td>{user.dateModified ? user.dateModified.toLocaleDateString() : null}</td>
                  )}
                  <td>
                    <button type="button" onClick={() => handleSelectUser(user.person, user.webId)}>
                      select
                    </button>
                  </td>
                  <td>
                    <button type="button" onClick={() => handleDeleteUser(user)}>
                      delete
                    </button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </FormSection>
  );
};

export default UsersList;
