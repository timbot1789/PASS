// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
// Utility Imports
import { SOLID_IDENTITY_PROVIDER, runNotification, setDocAclPermission } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext } from '../../contexts';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * SetAclPermissionForm Component - Component that generates the form for setting
 * document ACL permissions to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermissionForm
 */

const SetAclPermissionForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [username, setUsername] = useState('');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const [docType, setDocType] = useState('');

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const clearInputFields = () => {
    setUsername('');
    setSelectedUser('');
    setDocType('');
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const permissionType = event.target.setAclPerms.value;
    let podUsername = username;

    if (!podUsername) {
      podUsername = selectedUser;
    }

    if (!podUsername) {
      runNotification('Set permissions failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (
      `https://${podUsername}.${SOLID_IDENTITY_PROVIDER.split('/')[2]}/` ===
      String(session.info.webId.split('profile')[0])
    ) {
      runNotification(
        'Set permissions failed. Reason: Current user Pod cannot change container permissions to itself.',
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (!permissionType) {
      runNotification('Set permissions failed. Reason: Permissions not set.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    try {
      await setDocAclPermission(session, docType, permissionType, podUsername);

      runNotification(
        `${permissionType} permission to ${podUsername} for ${docType}.`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    } catch (error) {
      runNotification('Set permissions failed. Reason: File not found.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Permission to Files"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <form onSubmit={handleAclPermission} autoComplete="off">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
          <FormControl>
            <InputLabel htmlFor="set-acl-to" />
            <TextField
              id="set-acl-to"
              size="25"
              name="setAclTo"
              value={username}
              placeholder={selectedUser}
              label="Set Permissions To"
              onChange={handleUsername}
              required
            />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="set-acl-doctype">Select Document Type</InputLabel>
            <DocumentSelection
              htmlId="set-acl-doctype"
              handleDocType={handleDocType}
              docType={docType}
            />{' '}
          </FormControl>
          <FormControl>
            <RadioGroup defaultValue="Revoke" name="setAclPerms">
              <Box>
                <FormControlLabel value="Give" label="Give" control={<Radio />} />
                <FormControlLabel value="Revoke" label="Revoke" control={<Radio />} />
              </Box>
            </RadioGroup>
          </FormControl>
          <Button variant="contained" disabled={state.processing} type="submit">
            Set Permission
          </Button>
        </Box>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default SetAclPermissionForm;
