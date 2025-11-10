const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/`;

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordVerify {
  email: string;
  code: string;
}

export interface ForgotPasswordReset {
  reset_token: string;
  new_password: string;
}

export interface ForgotPasswordResponse {
  reset_token?: string;
  message?: string;
}

class AuthService {
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${BASE_URL}accounts/forgot-password/request/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send verification code. Please try again.");
    }
  }

  async resendVerificationCode(email: string): Promise<void> {
    const response = await fetch(`${BASE_URL}accounts/forgot-password/resend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to resend verification code. Please try again.");
    }
  }

  async verifyResetCode(email: string, code: string): Promise<string> {
    const response = await fetch(`${BASE_URL}accounts/forgot-password/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      throw new Error("Invalid verification code. Please try again.");
    }

    const data = await response.json();
    return data.reset_token;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const response = await fetch(`${BASE_URL}accounts/forgot-password/reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reset_token: resetToken,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to reset password. Please try again.");
    }
  }
}

export const authService = new AuthService();