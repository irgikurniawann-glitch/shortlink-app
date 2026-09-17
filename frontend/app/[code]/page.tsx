import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function ShortLinkPage({
  params,
}: PageProps) {
  const { code } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  redirect(`${apiUrl}/api/shortlinks/${code}`);
}