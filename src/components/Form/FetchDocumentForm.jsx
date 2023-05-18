// React Imports
import React, { useState } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// Custom Component Imports
import { getDocuments, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * FetchDocumentForm Component - Component that generates the form for searching
 * a specific document type from a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name FetchDocumentForm
 */

const FetchDocumentForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();

  const [documentType, setdocumentType] = useState('');

  const handleChange = (event) => {
    setdocumentType(event.target.value);
  };

  // Event handler for searching/fetching document
  const handleGetDocumentSubmission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    // const docType = event.target.document.value;
    const docType = documentType;

    try {
      const documentUrl = await getDocuments(session, docType, 'self-fetch');

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification('Locating document...', 3, state, dispatch);

      // setTimeout is used to let getDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification('Document found! Document located at: ', 5, state, dispatch);
        setTimeout(() => {
          dispatch({ type: 'CLEAR_PROCESSING' });
        }, 3000);
      }, 3000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification('Search failed. Reason: Document not found.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
    }
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Search Document"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth autoComplete="off">
          <InputLabel id="select-document-type-label">
            <i>Select Document Type</i>
          </InputLabel>
          <DocumentSelection htmlId="search-doctype" value={documentType} onChange={handleChange} />
        </FormControl>
      </Box>
      <Button
        variant="contained"
        fullWidth
        disabled={state.processing}
        type="submit"
        onClick={handleGetDocumentSubmission}
      >
        Get Document
      </Button>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default FetchDocumentForm;
