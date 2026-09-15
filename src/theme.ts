export interface ThemeConfig {
  id: string;
  name: string;
  primary: string; // Official NENU Blue #259fc8
  primaryDark: string; // High-contrast text #166987
  primaryLight: string; // Light tint #f0f9fc
  primaryBorder: string; // Soft border #bce4f2
}

export const nenuTheme: ThemeConfig = {
  id: "nenuOfficial",
  name: "东北师大官方蓝 (#259fc8)",
  primary: "#259fc8",
  primaryDark: "#166987",
  primaryLight: "#f0f9fc",
  primaryBorder: "#bce4f2",
};
