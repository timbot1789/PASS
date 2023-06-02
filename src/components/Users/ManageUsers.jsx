// React Imports
import React, { useContext, useState } from 'react';
import { TextField, Button } from '@mui/material';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { runNotification, clearProcessing } from '../../utils';
import { createUser } from '../../models/User';

// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { UserListContext } from '../../contexts';
// Component Imports
import SolidSignup from './SolidSignup';
import ManualWebIdForm from './ManualWebIdForm';
import FormSection from '../Form/FormSection';

/**
 * ManageUsers Component - Component that allows users to manage other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Forms
 * @name ManageUsers
 */

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

const notifyStartSubmission = (userObject, state, dispatch) => {
  if (!userObject.username && !userObject.webId) {
    runNotification(`Operation failed. Reason: No WebId provided`, 5, state, dispatch);
    return;
  }

  dispatch({ type: 'SET_PROCESSING' });

  runNotification(
    `Adding user "${userObject.givenName} ${userObject.familyName}" to Solid...`,
    5,
    state,
    dispatch
  );
};

const notifyEndSubmission = (userObject, state, dispatch) => {
  runNotification(
    `User "${userObject.givenName} ${userObject.familyName}" added to Solid`,
    5,
    state,
    dispatch
  );

  clearProcessing(dispatch);
};

const ManageUsers = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [webId, setWebId] = useState('');
  const { addUser } = useContext(UserListContext);

  const clearForm = () => {
    setFamilyName('');
    setGivenName('');
    setUsername('');
    setWebId('');
  };

  const submitUser = async (userObject) => {
    const user = await createUser(session, userObject);
    await addUser(user);
  };

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    const userObject = {
      givenName,
      familyName,
      username,
      webId
    };

    notifyStartSubmission(userObject, state, dispatch);
    try {
      await submitUser(userObject);
    } finally {
      notifyEndSubmission(userObject, state, dispatch);
      clearForm();
    }
  };

  return (
    <FormSection
      title="Add New User"
      state={state}
      statusType="Status"
      defaultMessage="To be added..."
    >
      <form onSubmit={handleAddUser} style={formRowStyle} autoComplete="off">
        {import.meta.env.VITE_EXPERIMENTAL ? (
          <>
            <p>Register user for a new pod:</p>
            <SolidSignup />
            <br />
            <hr />
            <p>Or fill out information manually:</p>
            <br />
          </>
        ) : null}
        <TextField
          style={textFieldStyle}
          id="first-name-form"
          aria-label="First Name"
          label="First/Given Name"
          variant="outlined"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="last-name-form"
          aria-label="Family Name"
          label="Last/Family Name"
          variant="outlined"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />
        <br />
        <ManualWebIdForm
          webId={webId}
          setWebId={setWebId}
          username={username}
          setUsername={setUsername}
        />
        <br />
        <Button
          style={textFieldStyle}
          variant="contained"
          aria-label="User Creation Submit"
          type="submit"
          disabled={state.processing}
        >
          Add User
        </Button>
      </form>
    </FormSection>
  );
};

export default ManageUsers;
