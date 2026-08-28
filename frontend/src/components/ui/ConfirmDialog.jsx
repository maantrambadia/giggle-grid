"use client";

import { useState } from "react";
import { AlertDialog, Button, Spinner } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";

const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "danger",
  confirmIcon,
  isPending: parentPending = false,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setIsConfirming(false);
      onOpenChange(false);
    }
  };

  const pending = parentPending || isConfirming;

  return (
    <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button className="hidden" />
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status={confirmColor} />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>{description}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary" isDisabled={pending}>
                {cancelText}
              </Button>
              <Button
                color={confirmColor}
                isPending={pending}
                isDisabled={pending}
                onPress={handleConfirm}
              >
                {({ isPending }) => (
                  <span className="flex items-center gap-2">
                    {isPending ? (
                      <Spinner color="current" size="sm" />
                    ) : confirmIcon ? (
                      <HugeiconsIcon
                        icon={confirmIcon}
                        strokeWidth={2}
                        className="size-5"
                      />
                    ) : null}
                    <span>{confirmText}</span>
                  </span>
                )}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default ConfirmDialog;
