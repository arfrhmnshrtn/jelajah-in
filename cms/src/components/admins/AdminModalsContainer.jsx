import React from 'react';
import AdminModal from './AdminModal';
import DeleteConfirmModal from '../shared/DeleteConfirmModal';
import FeedbackModal from '../shared/FeedbackModal';

const AdminModalsContainer = ({
  isModalOpen,
  setIsModalOpen,
  handleSaveAdmin,
  editingAdmin,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDelete,
  adminToDelete,
  feedback,
  setFeedback,
  t
}) => {
  return (
    <>
      <AdminModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAdmin}
        editingData={editingAdmin}
        t={t}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={adminToDelete?.name}
        t={t}
      />

      <FeedbackModal 
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </>
  );
};

export default AdminModalsContainer;
