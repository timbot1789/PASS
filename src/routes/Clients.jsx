// React Imports
import React, { useState } from 'react';
// React Router Imports
import { useLocation } from 'react-router-dom';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// Component Imports
import AddClientModal from '../components/Clients/AddClientModal';
import ClientList from '../components/Clients/ClientList';

/**
 * Clients Component - Component that generates Clients Page for PASS
 *
 * @memberof Pages
 * @name Clients
 */

const Clients = () => {
  // state for AddClientModal component
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  localStorage.setItem('restorePath', location.pathname);

  return (
    <Container>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        aria-label="Add Client Button"
        startIcon={<AddIcon />}
        onClick={() => setShowModal(true)}
        sx={{ marginTop: '3rem' }}
      >
        Add Client
      </Button>
      <ClientList />
      {/* modal/popup renders when showConfirmationModal state is true */}
      <AddClientModal showModal={showModal} setShowModal={setShowModal} />
    </Container>
  );
};

export default Clients;
