import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
export const createShortLink = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { url, code } = req.body;

   if (!url || typeof url !== "string") {
  return res.status(400).json({
    message: "URL wajib diisi",
  });
}

if (!isValidUrl(url)) {
  return res.status(400).json({
    message: "URL tidak valid",
  });
}

    if (code !== undefined) {
  if (typeof code !== "string") {
    return res.status(400).json({
      message: "Code short link tidak valid",
    });
  }

  if (!/^[a-z0-9-]+$/.test(code)) {
    return res.status(400).json({
      message:
        "Code hanya boleh menggunakan huruf kecil, angka, dan tanda hubung (-)",
    });
  }

  const existingShortLink = await prisma.shortLink.findUnique({
    where: {
      code,
    },
  });

  if (existingShortLink) {
    return res.status(409).json({
      message:
        "Nama short link sudah digunakan. Silakan pilih nama lain.",
    });
  }
}

    let shortLink;

if (code) {
  shortLink = await prisma.shortLink.create({
    data: {
      code,
      url,
      userId: req.user!.userId,
    },
  });
} else {
  for (let attempt = 0; attempt < 5; attempt++) {
    const generatedCode = nanoid(6);

    try {
      shortLink = await prisma.shortLink.create({
        data: {
          code: generatedCode,
          url,
          userId: req.user!.userId,
        },
      });

      break;
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
    }
  }
}

if (!shortLink) {
  throw new Error("Gagal membuat short link");
}

    return res.status(201).json({
      message: "Short link berhasil dibuat",
      data: shortLink,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal membuat short link",
    });
  }
};

export const redirectShortLink = async (
  req: Request<{ code: string }>,
  res: Response
) => {
  try {
    const { code } = req.params;

    const shortLink = await prisma.shortLink.findUnique({
      where: {
        code,
      },
    });

    if (!shortLink) {
      return res.status(404).json({
        message: "Short link tidak ditemukan",
      });
 }

    await prisma.shortLink.update({
      where: {
        id: shortLink.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    return res.redirect(shortLink.url);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal melakukan redirect",
    });
 }
};

export const updateShortLink = async (
  req: AuthRequest & { params: { code: string } },
  res: Response
) => {
  try {
    const { code } = req.params;
    const { url } = req.body;

    if (!url || typeof url !== "string") {
  return res.status(400).json({
    message: "URL wajib diisi",
  });
}

if (!isValidUrl(url)) {
  return res.status(400).json({
    message: "URL tidak valid",
  });
}

    const existingShortLink = await prisma.shortLink.findFirst({
      where: {
        code,
        userId: req.user!.userId,
      },
    });

    if (!existingShortLink) {
      return res.status(404).json({
        message: "Short link tidak ditemukan",
      });
    }

    const updatedShortLink = await prisma.shortLink.update({
      where: {
        id: existingShortLink.id,
      },
      data: {
        url,
      },
    });
    
    return res.json({
      message: "Short link berhasil diperbarui",
      data: updatedShortLink,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal memperbarui short link",
    });
  }

};

export const deleteShortLink = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const code = req.params.code;

if (typeof code !== "string") {
  return res.status(400).json({
    message: "Code short link tidak valid",
  });
}

    const existingShortLink = await prisma.shortLink.findFirst({
      where: {
        code,
        userId: req.user!.userId,
      },
    });

    if (!existingShortLink) {
      return res.status(404).json({
        message: "Short link tidak ditemukan",
      });
    }

    await prisma.shortLink.delete({
      where: {
        id: existingShortLink.id,
      },
    });

    return res.json({
      message: "Short link berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal menghapus short link",
    });
  }
};

export const getShortLinks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const shortLinks = await prisma.shortLink.findMany({
      where: {
        userId: req.user!.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      data: shortLinks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil short link",
    });
  }
};