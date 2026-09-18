import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  verificationUrl: string
) => {
  await resend.emails.send({
    from: "Shortlink <onboarding@resend.dev>",
    to: email,
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
};