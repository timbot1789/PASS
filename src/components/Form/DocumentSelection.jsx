// React Imports
import React from 'react';
// Material UI Imports
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Utiltiy Imports
import docTypes from '../../utils/form-helper';

/**
 * DocumentSelection Component - Sub-component that generates the dropdown
 * box/menu for selecting document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name DocumentSelection
 */

const DocumentSelection = ({ htmlId, handleDocType, docType }) => (
  <Select
    id={htmlId}
    name="document"
    value={docType}
    onChange={handleDocType}
    label="Select Document Type"
  >
    {docTypes.map((doc) => (
      <MenuItem key={doc} value={doc}>
        {doc}
      </MenuItem>
    ))}
  </Select>
);

export default DocumentSelection;
