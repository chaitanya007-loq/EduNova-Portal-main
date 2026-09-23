import React from 'react';
import { Modal } from './Modal';
import { GlobalSearchInput } from './GlobalSearchInput';

export const SearchModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global EduNova Search & Discovery">
      <div style={{ padding: '10px 0 20px 0' }}>
        <GlobalSearchInput
          placeholder="Search subjects, 3D labs, constellation skills, courses..."
          onSelectResult={() => onClose()}
        />
      </div>
    </Modal>
  );
};
