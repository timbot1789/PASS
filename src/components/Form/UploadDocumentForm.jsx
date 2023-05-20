// React Imports
import React, { useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckBox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
// Utility Imports
import { makeHandleFormSubmission } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Constants Imports
import { UPLOAD_TYPES } from '../../constants';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * UploadDocumentForm Component - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name UploadDocumentForm
 */

const UploadDocumentForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [checkVerify, setCheckVerify] = useState(false);
  const [docType, setDocType] = useState('');
  const [expireDate, setExpireDate] = useState(null);
  const [docDescription, setDocDescription] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const handleDocDescription = (event) => {
    setDocDescription(event.target.value);
  };

  const handleCheckVerify = () => {
    setCheckVerify(!checkVerify);
  };

  // Initalized state for file upload
  const handleFileChange = (event) => {
    dispatch({ type: 'SET_FILE', payload: event.target.files[0] });
  };

  const clearInputFields = () => {
    setCheckVerify(false);
    setDocType('');
    setExpireDate(null);
    setDocDescription('');
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_VERIFY_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod
  const handleFormSubmission = makeHandleFormSubmission(
    UPLOAD_TYPES.SELF,
    expireDate,
    docDescription,
    state,
    dispatch,
    session,
    clearInputFields
  );

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Upload Document"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <form onSubmit={handleFormSubmission} autoComplete="off">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormGroup sx={{ display: 'inline' }}>
            <FormControlLabel
              control={
                <CheckBox
                  checked={checkVerify}
                  value={state.verifyFile}
                  onChange={() => {
                    handleCheckVerify();
                    dispatch({ type: 'TOGGLE_VERIFY_FILE' });
                  }}
                />
              }
              label="Verify File on upload"
            />
          </FormGroup>
          <FormControl required>
            <InputLabel htmlFor="upload-doc">Select Document Type</InputLabel>
            <DocumentSelection
              htmlId="upload-doc"
              handleDocType={handleDocType}
              docType={docType}
            />
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
              value={docDescription}
              label="Enter description"
              onChange={handleDocDescription}
            />
          </FormControl>
          <FormControl>
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

export default UploadDocumentForm;
