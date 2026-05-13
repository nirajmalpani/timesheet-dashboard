import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/login/LoginForm";

const signInMock = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

const pushMock = jest.fn();
const refreshMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    signInMock.mockReset();
    pushMock.mockReset();
    refreshMock.mockReset();
  });

  it("blocks submit and shows an error for an invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/^password/i), "validpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("surfaces an auth error when credentials are rejected", async () => {
    signInMock.mockResolvedValue({ error: "CredentialsSignin", ok: false });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "test@dev.com");
    await user.type(screen.getByLabelText(/^password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid/i);
  });
});
