import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "The Apologetics Atlas",
    enableSPA: true,
    enablePopovers: true,
    generateSocialImages: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "https://jsantiago611.github.io/quartz-bible",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      cdnCaching: true,
      typography: {
        header: "GT Pantheon",
        body: "GT Pantheon",
        code: "GT Pantheon",
      },
      colors: {
        lightMode: {
          light: "#ecebe7",
          lightgray: "#bdbdbd",
          gray: "#5f5f5f",
          darkgray: "#252525",
          dark: "#1c1c1c",
          secondary: "#00e600",
          tertiary: "#0058fe",
          highlight: "#fe4f00",
          notebg: "#fff",
        },
        darkMode: {
          light: "#1c1c1c",
          lightgray: "#555",
          gray: "#aaa",
          darkgray: "#e2e2e2",
          dark: "#ecebe7",
          secondary: "#00e600",
          tertiary: "#0058fe",
          highlight: "#fe4f00",
          notebg: "#f5f3ef1a",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        // you can add 'git' here for last modified from Git
        // if you do rely on git for dates, ensure defaultDateType is 'modified'
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents({ collapseByDefault: true }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources({ fontOrigin: "googleFonts" }),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
