import { redirect, notFound } from "next/navigation";

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

  const response = await fetch(
    `${apiUrl}/api/shortlinks/${code}`,
    {
      redirect: "manual",
      cache: "no-store",
    }
  );

  const location = response.headers.get("location");

  if (!location) {
    notFound();
  }

  redirect(location);
}