import { useMemo, useState } from "react";
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
  Login01Icon,
  UserIcon,
  SquareLockPasswordIcon,
  ImageCompositionOvalIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/hooks/auth";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const LoginPage = () => {
  useDocumentTitle("Login");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.length > 0 && !submitting;
  }, [username, password, submitting]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await login(username.trim(), password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <Card
        className="relative w-full max-w-xl p-6 shadow-xl backdrop-blur sm:p-10"
        variant="secondary"
      >
        <Card.Header>
          <div className="space-y-2 text-center">
            <Card.Title className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Login
            </Card.Title>
            <Card.Description className="pt-1 text-sm text-muted-foreground sm:text-base">
              Use your username and password to access your account.
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
                placeholder="Enter your username"
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
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
                    icon={Login01Icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                ) : null}
                {isPending ? "Signing in..." : "Login"}
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
            Don&apos;t have an account?{" "}
            <Link
              onPress={() => navigate("/register")}
              isDisabled={submitting}
              className="gap-1"
            >
              Register
              <Link.Icon />
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default LoginPage;
