import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  ViewIcon,
  ViewOffIcon,
  UserCheck01Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import StateMessage from "@/components/ui/StateMessage";
import { useAuth } from "@/hooks/auth";
import * as authService from "@/services/authService";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const RegisterPage = () => {
  useDocumentTitle("Register");
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [displayedPasswordMismatch, setDisplayedPasswordMismatch] =
    useState(false);
  const [displayedUsernameTooShort, setDisplayedUsernameTooShort] =
    useState(false);
  const [displayedPasswordIssue, setDisplayedPasswordIssue] = useState(null);

  const passwordMismatch =
    confirmPassword.length > 0 &&
    password.length > 0 &&
    password !== confirmPassword;
  const usernameTooShort =
    username.trim().length > 0 && username.trim().length < 3;
  const passwordIssue = useMemo(() => {
    const p = password;
    if (!p) return null;
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(p))
      return "Password must include at least 1 uppercase letter.";
    if (!/[a-z]/.test(p))
      return "Password must include at least 1 lowercase letter.";
    if (!/[0-9]/.test(p)) return "Password must include at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(p))
      return "Password must include at least 1 special character.";
    return null;
  }, [password]);

  const validationMessage = useMemo(() => {
    if (displayedPasswordMismatch) {
      return {
        title: "Passwords do not match",
        description: "Please enter the same password in both fields.",
      };
    }
    if (displayedPasswordIssue) {
      return {
        title: "Password requirements",
        description: displayedPasswordIssue,
      };
    }
    if (displayedUsernameTooShort) {
      return {
        title: "Username is too short",
        description: "Username must be at least 3 characters.",
      };
    }
    return null;
  }, [
    displayedPasswordMismatch,
    displayedPasswordIssue,
    displayedUsernameTooShort,
  ]);

  const canSubmit = useMemo(() => {
    return (
      username.trim().length >= 3 &&
      !passwordIssue &&
      password.length >= 8 &&
      !passwordMismatch &&
      !submitting
    );
  }, [username, password, passwordIssue, passwordMismatch, submitting]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedPasswordMismatch(passwordMismatch);
    }, 400);
    return () => clearTimeout(timer);
  }, [password, confirmPassword, passwordMismatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedUsernameTooShort(usernameTooShort);
      setDisplayedPasswordIssue(passwordIssue);
    }, 400);
    return () => clearTimeout(timer);
  }, [username, password, usernameTooShort, passwordIssue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [username]);

  const { data: usernameAvailable, isFetching: isCheckingUsername } = useQuery({
    queryKey: ["usernameAvailable", debouncedUsername],
    queryFn: () => authService.checkUsernameAvailable(debouncedUsername),
    enabled: debouncedUsername.length >= 3,
  });

  const isUsernameTaken =
    debouncedUsername.length >= 3 && usernameAvailable?.available === false;
  const isUsernameOk =
    debouncedUsername.length >= 3 && usernameAvailable?.available === true;

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
              <InputGroup.Suffix>
                {isCheckingUsername ? (
                  <Spinner color="current" size="sm" />
                ) : isUsernameOk ? (
                  <HugeiconsIcon
                    icon={UserCheck01Icon}
                    strokeWidth={2}
                    className="size-4 text-success"
                  />
                ) : isUsernameTaken ? (
                  <HugeiconsIcon
                    icon={UnavailableIcon}
                    strokeWidth={2}
                    className="size-4 text-danger"
                  />
                ) : null}
              </InputGroup.Suffix>
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
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
              />
              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  variant="ghost"
                  onPress={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <HugeiconsIcon
                    icon={showPassword ? ViewOffIcon : ViewIcon}
                    strokeWidth={2}
                    className="size-4 text-muted"
                  />
                </Button>
              </InputGroup.Suffix>
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
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  variant="ghost"
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <HugeiconsIcon
                    icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                    strokeWidth={2}
                    className="size-4 text-muted"
                  />
                </Button>
              </InputGroup.Suffix>
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
