import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Spinner,
  Card,
  TextField,
  Label,
  InputGroup,
  Link,
  Separator,
} from "@heroui/react";
import { useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAdd01Icon,
  UserIcon,
  SquareLockPasswordIcon,
  ImageCompositionOvalIcon,
} from "@hugeicons/core-free-icons";
import StateMessage from "@/components/ui/StateMessage";
import { useAuth } from "@/hooks/auth";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const RegisterPage = () => {
  useDocumentTitle("Register");
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [displayedPasswordMismatch, setDisplayedPasswordMismatch] =
    useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 &&
    password.length > 0 &&
    password !== confirmPassword;
  const usernameTooShort =
    username.trim().length > 0 && username.trim().length < 3;
  const passwordTooShort = password.length > 0 && password.length < 6;

  const validationMessage = useMemo(() => {
    if (displayedPasswordMismatch) {
      return {
        title: "Passwords do not match",
        description: "Please enter the same password in both fields.",
      };
    }
    if (passwordTooShort) {
      return {
        title: "Password is too short",
        description: "Password must be at least 6 characters.",
      };
    }
    if (usernameTooShort) {
      return {
        title: "Username is too short",
        description: "Username must be at least 3 characters.",
      };
    }
    return null;
  }, [displayedPasswordMismatch, passwordTooShort, usernameTooShort]);

  const canSubmit = useMemo(() => {
    return (
      username.trim().length >= 3 &&
      password.length >= 6 &&
      !passwordMismatch &&
      !submitting
    );
  }, [username, password, passwordMismatch, submitting]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedPasswordMismatch(passwordMismatch);
    }, 400);
    return () => clearTimeout(timer);
  }, [password, confirmPassword, passwordMismatch]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await register(username.trim(), password);
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
              Register
            </Card.Title>
            <Card.Description className="pt-1 text-sm text-muted-foreground sm:text-base">
              Create an account to upload, like, and comment.
            </Card.Description>
          </div>
        </Card.Header>

        <Card.Content className="mt-8 flex flex-col gap-5">
          <TextField
            name="username"
            onChange={setUsername}
            isDisabled={submitting}
            className="rounded-xl border-b"
          >
            <Label>Username</Label>
            <InputGroup className="h-12 text-base">
              <InputGroup.Prefix>
                <HugeiconsIcon
                  icon={UserIcon}
                  strokeWidth={2}
                  className="size-4 text-muted"
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                className="w-full px-4 text-base"
                placeholder="Choose a username"
                autoComplete="username"
                value={username}
              />
            </InputGroup>
          </TextField>

          <TextField
            name="password"
            onChange={setPassword}
            isDisabled={submitting}
            className="rounded-xl border-b"
          >
            <Label>Password</Label>
            <InputGroup className="h-12 text-base">
              <InputGroup.Prefix>
                <HugeiconsIcon
                  icon={SquareLockPasswordIcon}
                  strokeWidth={2}
                  className="size-4 text-muted"
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                className="w-full px-4 text-base"
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                value={password}
              />
            </InputGroup>
          </TextField>

          <TextField
            name="confirmPassword"
            onChange={setConfirmPassword}
            isDisabled={submitting}
            className="rounded-xl border-b"
          >
            <Label>Confirm Password</Label>
            <InputGroup className="h-12 text-base">
              <InputGroup.Prefix>
                <HugeiconsIcon
                  icon={SquareLockPasswordIcon}
                  strokeWidth={2}
                  className="size-4 text-muted"
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                className="w-full px-4 text-base"
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </InputGroup>
          </TextField>

          {validationMessage ? (
            <StateMessage
              title={validationMessage.title}
              description={validationMessage.description}
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
                    icon={UserAdd01Icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                ) : null}
                {isPending ? "Creating account..." : "Register"}
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

          <p className="pt-1 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              onPress={() => navigate("/login")}
              isDisabled={submitting}
              className="gap-1"
            >
              Login
              <Link.Icon />
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default RegisterPage;
