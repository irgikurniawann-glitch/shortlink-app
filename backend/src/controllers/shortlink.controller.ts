import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const createShortLink = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { url, code } = req.body;

    if (!url) {
      return res.status(400).json({
        message: "URL wajib diisi",
      });
    }

    if (code) {
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

    const shortLink = await prisma.shortLink.create({
      data: {
        code: code || Math.random().toString(36).substring(2, 8),
        url,
        userId: req.user!.userId,
      },
    });

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

    if (!url) {
      return res.status(400).json({
        message: "URL wajib diisi",
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