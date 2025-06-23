'use client'

import { Text, Button, Stack, HStack } from '@chakra-ui/react'
import './ConfirmationModal.scss'

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
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal-content" onClick={handleContentClick}>
        <Stack gap={4} p={6}>
          <Text fontSize="lg" fontWeight="semibold">
            {title}
          </Text>
          <Text>
            {message}
          </Text>
          <HStack gap={3} justify="flex-end">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <Button colorScheme={getConfirmButtonColorScheme()} onClick={onConfirm}>
              {confirmText}
            </Button>
          </HStack>
        </Stack>
      </div>
    </div>
  );
};

export default ConfirmationModal; 