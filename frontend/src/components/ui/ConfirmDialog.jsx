"use client";

import { AlertDialog, Button } from "@heroui/react";
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
  isPending = false,
}) => {
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
              <Button slot="close" variant="tertiary" isDisabled={isPending}>
                {cancelText}
              </Button>
              <Button
                slot="close"
                color={confirmColor}
                isPending={isPending}
                onPress={() => onConfirm()}
              >
                {confirmIcon ? (
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={confirmIcon}
                      strokeWidth={2}
                      className="size-5"
                    />
                    <span>{confirmText}</span>
                  </span>
                ) : (
                  confirmText
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
