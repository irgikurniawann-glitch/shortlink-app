import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createShortLink = async (req: Request, res: Response) => {
  try {
    const { url, code } = req.body;
    console.log("CODE DARI REQUEST:", JSON.stringify(code));
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
console.log("HASIL CEK CODE:", existingShortLink);
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
  req: Request<{ code: string }>,
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

    const existingShortLink = await prisma.shortLink.findUnique({
      where: {
        code,
      },
    });

    if (!existingShortLink) {
      return res.status(404).json({
        message: "Short link tidak ditemukan",
      });
    }

    const updatedShortLink = await prisma.shortLink.update({
      where: {
        code,
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
  req: Request<{ code: string }>,
  res: Response
) => {
  try {
    const { code } = req.params;

    const existingShortLink = await prisma.shortLink.findUnique({
      where: {
        code,
      },
    });

    if (!existingShortLink) {
      return res.status(404).json({
        message: "Short link tidak ditemukan",
      });
    }

    await prisma.shortLink.delete({
      where: {
        code,
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
  _req: Request,
  res: Response
) => {
  try {
    const shortLinks = await prisma.shortLink.findMany({
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