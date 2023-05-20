// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
// Utility Imports
import { runNotification, makeHandleFormSubmission } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext } from '../../contexts';
// Constants Imports
import { UPLOAD_TYPES } from '../../constants';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * CrossPodWriteForm Component - Component that generates the form for cross pod
 * uploading for a specific document to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodWriteForm
 */

const CrossPodWriteForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [username, setUsername] = useState('');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const [expireDate, setExpireDate] = useState(null);
  const [docDescription, setDocDescription] = useState('');
  const [docType, setDocType] = useState('');

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleDocDescription = (event) => {
    setDocDescription(event.target.value);
  };

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  // Initalized state for file upload
  const handleFileChange = (event) => {
    dispatch({ type: 'SET_FILE', payload: event.target.files[0] });
  };

  const clearInputFields = () => {
    setUsername('');
    setDocType('');
    setExpireDate(null);
    setDocDescription('');
    setSelectedUser('');
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  const handleFormSubmit = makeHandleFormSubmission(
    UPLOAD_TYPES.CROSS,
    expireDate,
    docDescription,
    state,
    dispatch,
    session,
    clearInputFields
  );
  // Event handler for form/document submission to Pod
  const handleCrossPodUpload = async (event) => {
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

    handleFormSubmit(event, podUsername);
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Cross Pod Document Upload"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <form onSubmit={handleCrossPodUpload} autoComplete="off">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
          <FormControl>
            <InputLabel htmlFor="cross-upload-doc" />
            <TextField
              id="cross-upload-doc"
              size="25"
              name="crossPodUpload"
              value={username}
              placeholder={selectedUser}
              label="Upload Document To"
              onChange={handleUsername}
              required
            />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="upload-doc">Select Document Type</InputLabel>
            <DocumentSelection
              htmlId="upload-doc"
              handleDocType={handleDocType}
              docType={docType}
            />
          </FormControl>
          <Box>
            <FormControl>
              <InputLabel htmlFor="upload-doc-expiration" />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="upload-doc-expiration"
                  name="date"
                  format="MM/DD/YYYY"
                  label="Expire date (if applicable)"
                  value={expireDate}
                  onChange={(newDate) => setExpireDate(newDate)}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>
          <FormControl>
            <InputLabel htmlFor="upload-doc-desc" />
            <TextField
              id="upload-doc-desc"
              name="description"
              label="Enter Description"
              value={docDescription}
              onChange={handleDocDescription}
            />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="upload-doctype" />
            <Input
              id="upload-doctype"
              type="file"
              name="uploadDoctype"
              accept=".pdf, .docx, .doc, .txt, .rtf, .gif"
              onChange={handleFileChange}
            />
            <FormHelperText>
              File to upload: {state.file ? state.file.name : 'No file selected'}
            </FormHelperText>
          </FormControl>
          <Button variant="contained" disabled={state.processing} type="submit">
            Upload file
          </Button>
          <Button variant="contained" type="button" onClick={clearInputFields}>
            Clear Form
          </Button>
        </Box>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default CrossPodWriteForm;
