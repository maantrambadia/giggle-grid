import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Spinner,
  Card,
  TextField,
  Label,
  InputGroup,
  Separator,
} from "@heroui/react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import StateMessage from "@/components/ui/StateMessage";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Upload04Icon,
  Image02Icon,
  TextIcon,
  ImageCompositionOvalIcon,
} from "@hugeicons/core-free-icons";
import api from "@/lib/axios";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const UploadPage = () => {
  useDocumentTitle("Upload");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [displayedCaptionError, setDisplayedCaptionError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const captionError =
    caption.trim().length > 500
      ? "Caption must be 500 characters or less."
      : "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedCaptionError(captionError);
    }, 300);
    return () => clearTimeout(timer);
  }, [captionError]);

  const canSubmit = useMemo(() => {
    return (
      caption.trim().length > 0 &&
      caption.trim().length <= 500 &&
      !!file &&
      !fileError &&
      !submitting
    );
  }, [caption, file, fileError, submitting]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) {
      setFile(null);
      setFileError("");
      return;
    }
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFile(null);
      setFileError("Only JPG, PNG, GIF, or WEBP images are allowed.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setFileError("Image must be 5 MB or smaller.");
      return;
    }
    setFile(selected);
    setFileError("");
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError("");
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("caption", caption.trim());
      form.append("image", file);

      await api.post("/memes/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["memes"] });
      navigate("/", { replace: true });
    } catch (e) {
      setError(e.response?.data?.error || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card
        className="relative w-full max-w-xl p-6 shadow-xl backdrop-blur sm:p-10"
        variant="secondary"
      >
        <Card.Header>
          <div className="space-y-2 text-center">
            <Card.Title className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Upload meme
            </Card.Title>
            <Card.Description className="pt-1 text-sm text-muted-foreground sm:text-base">
              Add a caption and upload your meme image.
            </Card.Description>
          </div>
        </Card.Header>

        <Card.Content className="mt-8 flex flex-col gap-5">
          <TextField
            name="caption"
            onChange={setCaption}
            isDisabled={submitting}
            className="rounded-xl border-b"
          >
            <Label>Caption</Label>
            <InputGroup className="h-12 text-base">
              <InputGroup.Prefix>
                <HugeiconsIcon
                  icon={TextIcon}
                  strokeWidth={2}
                  className="size-4 text-muted"
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                className="w-full px-4 text-base"
                placeholder="Write something funny..."
                value={caption}
              />
            </InputGroup>
          </TextField>

          <div className="space-y-2">
            <Label>Meme image</Label>
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-white/8 p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <HugeiconsIcon
                  icon={Image02Icon}
                  strokeWidth={2}
                  className="size-5"
                />
                <span>
                  {file
                    ? file.name
                    : "Choose a JPG, PNG, or GIF image (max 5MB)"}
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                disabled={submitting}
                onChange={handleFileChange}
                className="block w-full cursor-pointer text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-default file:px-4 file:py-2 file:text-default-foreground hover:file:opacity-90"
              />
            </div>
          </div>

          {displayedCaptionError ? (
            <StateMessage
              title="Caption is too long"
              description={displayedCaptionError}
              className="mt-0"
            />
          ) : null}

          {fileError ? (
            <StateMessage
              title="Invalid image"
              description={fileError}
              className="mt-0"
            />
          ) : null}

          {error ? (
            <StateMessage
              title="Upload failed"
              description={error}
              className="mt-0"
            />
          ) : null}

          <Button
            fullWidth
            size="lg"
            color="primary"
            isDisabled={!canSubmit}
            isPending={submitting}
            onPress={handleSubmit}
          >
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                {!isPending ? (
                  <HugeiconsIcon
                    icon={Upload04Icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                ) : null}
                {isPending ? "Uploading..." : "Upload"}
              </>
            )}
          </Button>

          <Separator />

          <Button
            fullWidth
            variant="secondary"
            onPress={() => navigate("/")}
            isDisabled={submitting}
          >
            <span className="flex items-center justify-center gap-2">
              <HugeiconsIcon
                icon={ImageCompositionOvalIcon}
                strokeWidth={2}
                className="size-5"
              />
              <span>Back to feed</span>
            </span>
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

export default UploadPage;
