import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  verificationUrl: string
) => {
  const { data, error } = await resend.emails.send({
    from: "Shortlink <onboarding@resend.dev>",
    to: "irgikurniawann@gmail.com",
    subject: "Verifikasi Email Shortlink",
    html: `
      <div>
        <h2>Verifikasi Email</h2>
        <p>Terima kasih sudah mendaftar di Shortlink.</p>
        <p>Klik tombol di bawah untuk memverifikasi email kamu:</p>

        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 8px;
          "
        >
          Verifikasi Email
        </a>

        <p>Link ini digunakan untuk mengaktifkan akun kamu.</p>
      </div>
    `,
  });
  if (error) {
  console.error("RESEND ERROR:", error);
  throw new Error(error.message);
}

console.log("RESEND SUCCESS:", data);
};
export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string
) => {
  const { data, error } = await resend.emails.send({
    from: "Shortlink <onboarding@resend.dev>",
    to: "irgikurniawann@gmail.com",
    subject: "Reset Password Shortlink",
    html: `
      <div>
        <h2>Reset Password</h2>

        <p>Kamu meminta untuk mengganti password akun Shortlink.</p>

        <p>Klik tombol di bawah untuk membuat password baru:</p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 8px;
          "
        >
          Reset Password
        </a>

        <p>Link ini berlaku selama 1 jam.</p>

        <p>
          Jika kamu tidak meminta reset password, abaikan email ini.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND RESET PASSWORD ERROR:", error);
    throw new Error(error.message);
  }

  console.log("RESEND RESET PASSWORD SUCCESS:", data);
};