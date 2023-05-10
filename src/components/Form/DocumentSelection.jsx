import React from 'react';
import DOCUMENT_TYPES from '../../constants/document-types';
/**
 * DocumentSelection Component - Sub-component that generates the dropdown
 * box/menu for selecting document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name DocumentSelection
 */

const DocumentSelection = ({ htmlId }) => (
  <select id={htmlId} name="document">
    {Object.keys(DOCUMENT_TYPES).map((key) => (
      <option key={key} value={DOCUMENT_TYPES[key]}>
        {DOCUMENT_TYPES[key].replace('_',' ')}
      </option>
    ))}
  </select>
);

export default DocumentSelection;
