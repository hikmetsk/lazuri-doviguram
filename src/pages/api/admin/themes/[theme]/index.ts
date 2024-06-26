import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBThemeRepository } from "@/backend/repositories/theme/dynamodb_theme_repository";
import { BackendThemeService } from "@/backend/services/theme_service";
import { ApiResponse } from "@/api/api_response";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const themeRepo = new DynamoDBThemeRepository();
  const backendThemeService = new BackendThemeService(themeRepo);
  const theme = req.query.theme as string;

  if (req.method === "GET") {
    const repRes = await backendThemeService.getTheme(theme);
    res.status(200).json(repRes);
  } else if (req.method === "PUT") {
    const type = req.query.type;

    if (type === "save-theme") {
      const repRes = await backendThemeService.saveTheme(req.body.theme);
      res.status(200).json(repRes);
    } else if (type === "relocate-theme") {
      const repRes = await backendThemeService.relocateTheme(
        theme,
        req.body.theme
      );
      res.status(200).json(repRes);
    } else {
      res.status(400).json({ status: "error", message: "Unsopported action" });
    }
  } else if (req.method === "DELETE") {
    const repRes = await backendThemeService.deleteTheme(theme);
    res.status(200).json(repRes);
  } else {
    res
      .status(405)
      .json({ status: "error", message: "Unsopported request method" });
  }
}
