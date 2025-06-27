'use client'

import { Text, Button, HStack } from '@chakra-ui/react'
import { Dialog } from '@saas-ui/react'
import './ConfirmationModal.scss'

// тип пропсов для модального окна подтверждения
type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = "danger"
}: ConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // определяем цвет кнопки подтверждения в зависимости от варианта
  const getConfirmButtonColorScheme = () => {
    switch (variant) {
      case 'danger':
        return 'red';
      case 'warning':
        return 'orange';
      case 'info':
        return 'blue';
      default:
        return 'red';
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Backdrop />
      <Dialog.Content className="confirmation-modal">
        <Dialog.Header className="confirmation-header">
          <Dialog.Title className="confirmation-title">
            {title}
          </Dialog.Title>
          <Dialog.CloseButton onClick={onClose} />
        </Dialog.Header>
        <Dialog.Body className="confirmation-body">
          <Text className="confirmation-message">
            {message}
          </Text>
        </Dialog.Body>
        <Dialog.Footer className="confirmation-footer">
          <HStack className="confirmation-buttons">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="confirmation-button"
              size="md"
            >
              {cancelText}
            </Button>
            <Button 
              colorScheme={getConfirmButtonColorScheme()} 
              onClick={handleConfirm}
              className="confirmation-button"
              size="md"
            >
              {confirmText}
            </Button>
          </HStack>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConfirmationModal; 