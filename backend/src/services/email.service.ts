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