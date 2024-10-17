import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Jonathan Santiago",
    enableSPA: true,
    enablePopovers: true,
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
        header: "Earth",
        body: "Serif",
        code: "Earth",
      },
      colors: {
        lightMode: {
          light: "color(display-p3 0.929412 0.92549 0.898039/1)",
          lightgray: "#bdbdbd",
          gray: "#5f5f5f",
          darkgray: "#252525",
          dark: "#000",
          secondary: "#005128",
          tertiary: "#eb620e",
          highlight: "#005128",
          headerbg: "color(display-p3 0.964706 0.823529 0/1)",
        },
        darkMode: {
          light: "#000",
          lightgray: "#555",
          gray: "#aaa",
          darkgray: "#e2e2e2",
          dark: "#FFFFFF",
          secondary: "#0693e3",
          tertiary: "#fcb900",
          highlight: "#fff",
          headerbg: "color(display-p3 0.964706 0.823529 0/1)",
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
        priority: ["frontmatter", "filesystem"],
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
