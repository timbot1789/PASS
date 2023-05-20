// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
// Utility Imports
import { getDocuments, runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext } from '../../contexts';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * CrossPodQueryForm Component - Component that generates the form for cross pod
 * search for a specific document from another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodQueryForm
 */

const CrossPodQueryForm = () => {
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

  // Clean up function for clearing input fields after submission
  const clearInputFields = () => {
    setUsername('');
    setSelectedUser('');
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for Cross Pod Querying/Searching
  const handleCrossPodQuery = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const podUsername = username || selectedUser;

    if (!podUsername) {
      runNotification('Search failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    try {
      const documentUrl = await getDocuments(session, docType, 'cross-fetch', podUsername);

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification('Locating document...', 3, state, dispatch);

      // setTimeout is used to let getDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification('Document found! Document located at: ', 3, state, dispatch);
        clearInputFields();
      }, 3000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification('Search failed. Reason: Document not found.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Cross Pod Search"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <form onSubmit={handleCrossPodQuery} autoComplete="off">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
          <FormControl>
            <InputLabel htmlFor="cross-search-doc" />
            <TextField
              id="cross-search-doc"
              size="25"
              name="crossPodQuery"
              value={username || selectedUser}
              placeholder={selectedUser}
              label="Search Document From"
              onChange={handleUsername}
              required
            />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="cross-search-doctype">Select Document Type</InputLabel>
            <DocumentSelection
              htmlId="cross-search-doctype"
              handleDocType={handleDocType}
              docType={docType}
            />
          </FormControl>
          <Button variant="contained" disabled={state.processing} type="submit">
            Search Pod
          </Button>
        </Box>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default CrossPodQueryForm;
