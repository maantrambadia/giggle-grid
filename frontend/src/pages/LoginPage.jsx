import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
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
  ArrowLeft01Icon,
  Login01Icon,
  UserIcon,
  SquareLockPasswordIcon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/hooks/auth";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const LoginPage = () => {
  useDocumentTitle("Login");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.length > 0 && !submitting;
  }, [username, password, submitting]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await login(username.trim(), password, rememberMe);
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
          <Button
            isIconOnly
            variant="ghost"
            className="absolute left-4 top-4"
            onPress={() => navigate("/")}
            isDisabled={submitting}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-5"
            />
          </Button>
          <div className="space-y-2 text-center">
            <Card.Title className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Login
            </Card.Title>
            <Card.Description className="text-sm text-muted-foreground sm:text-base pt-1">
              Use your username and password to access your account.
            </Card.Description>
          </div>
        </Card.Header>

        <Card.Content className="mt-8 flex flex-col gap-5">
          <TextField
            name="username"
            onChange={setUsername}
            isDisabled={submitting}
            className="border-b rounded-xl"
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
            className="border-b rounded-xl"
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
                autoComplete="current-password"
                value={password}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </InputGroup>
          </TextField>

          <div className="flex items-center justify-between gap-3 pt-1">
            <Checkbox
              id="remember-me"
              isSelected={rememberMe}
              onChange={setRememberMe}
              isDisabled={submitting}
            >
              <Checkbox.Control className="size-4.5">
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label htmlFor="remember-me">Remember me</Label>
              </Checkbox.Content>
            </Checkbox>
          </div>

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

          <p className="pt-1 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              onPress={() => navigate("/request-access")}
              isDisabled={submitting}
              className="gap-1"
            >
              Request access
              <Link.Icon />
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default LoginPage;
