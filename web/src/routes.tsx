import { createBrowserRouter } from "react-router";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AppWrapper from "./components/AppWrapper";
import Root from "./layouts/Root";
import Dashboard from "./pages/dashboard/Dashboard";
import ForgotPasswordLinkSentPage from "./pages/auth/ForgotPasswordLinkSentPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      {
        path: "/",
        element: <Root />,
        children: [
          {
            path: "/",
            element: (
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            ),
          },
          {
            path: "/auth/sign-in",
            element: (
              <RedirectAuthenticatedUser>
                <SignInPage />
              </RedirectAuthenticatedUser>
            ),
          },
          {
            path: "/auth/sign-up",
            element: (
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            ),
          },
          {
            path: "/auth/password/forgot",
            element: (
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            ),
          },
          {
            path: "/auth/password/link-sent/:email",
            element: (
              <RedirectAuthenticatedUser>
                <ForgotPasswordLinkSentPage />
              </RedirectAuthenticatedUser>
            ),
          },
          {
            path: "/auth/password/reset/:token",
            element: (
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            ),
          },
          {
            path: "/auth/verify-email",
            element: <VerifyEmailPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;