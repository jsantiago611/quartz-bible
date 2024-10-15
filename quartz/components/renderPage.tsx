import { render } from "preact-render-to-string";
import { QuartzComponent, QuartzComponentProps } from "./types";
import HeaderConstructor from "./Header";
import BodyConstructor from "./Body";
import { JSResourceToScriptElement, StaticResources } from "../util/resources";
import { FullSlug, RelativeURL, joinSegments, normalizeHastElement } from "../util/path";
import { visit } from "unist-util-visit";
import { Root } from "hast";
import { QuartzPluginData } from "../plugins/vfile";
import { GlobalConfiguration } from "../cfg";
import { i18n } from "../i18n";

interface RenderComponents {
  head: QuartzComponent;
  header: QuartzComponent[];
  beforeBody: QuartzComponent[];
  pageBody: QuartzComponent;
  left: QuartzComponent[];
  right: QuartzComponent[];
  footer: QuartzComponent;
}

export function pageResources(
  baseDir: FullSlug | RelativeURL,
  staticResources: StaticResources,
): StaticResources {
  const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json");
  const contentIndexScript = `const fetchData = fetch("${contentIndexPath}").then(data => data.json())`;

  return {
    css: [joinSegments(baseDir, "index.css"), ...staticResources.css],
    js: [
      {
        src: joinSegments(baseDir, "prescript.js"),
        loadTime: "beforeDOMReady",
        contentType: "external",
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: contentIndexScript,
      },
      ...staticResources.js,
      {
        src: joinSegments(baseDir, "postscript.js"),
        loadTime: "afterDOMReady",
        moduleType: "module",
        contentType: "external",
      },
    ],
  };
}

let pageIndex: Map<FullSlug, QuartzPluginData> | undefined = undefined;

function getOrComputeFileIndex(allFiles: QuartzPluginData[]): Map<FullSlug, QuartzPluginData> {
  if (!pageIndex) {
    pageIndex = new Map();
    for (const file of allFiles) {
      pageIndex.set(file.slug!, file);
    }
  }

  return pageIndex;
}

export function renderPage(
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
): string {
  // Log the component data at the start of the function
  console.log("Component Data:", componentData);

  // Log the frontmatter tags
  console.log("Frontmatter Object:", componentData.frontmatter);

  // Check for the presence of the 'red' tag
  const hasRedTag = componentData.frontmatter?.tags?.includes("red");
  console.log("Has 'red' tag:", hasRedTag);

  // Process transcludes in componentData
  visit(componentData.tree as Root, "element", (node, _index, _parent) => {
    // ... (existing code for processing transcludes remains unchanged)
  });

  const {
    head: Head,
    header,
    beforeBody,
    pageBody: Content,
    left,
    right,
    footer: Footer,
  } = components;
  const Header = HeaderConstructor();
  const Body = BodyConstructor();

  const LeftComponent = (
    <div class="left sidebar">
      {left.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  );

  const RightComponent = (
    <div class="right sidebar">
      {right.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  );

  const lang = componentData.frontmatter?.lang ?? cfg.locale?.split("-")[0] ?? "en";
  const doc = (
    <html lang={lang}>
      <Head {...componentData} />
      <body data-slug={slug}>
        <div id="quartz-root" class="page">
          <Body {...componentData}>
            {LeftComponent}
            <div class="center">
              <div
                style={{
                  backgroundColor: hasRedTag ? 'red' : 'transparent',
                }}
                class="page-header"
              >
                <Header {...componentData}>
                  {header.map((HeaderComponent) => (
                    <HeaderComponent {...componentData} />
                  ))}
                </Header>
                <div class="popover-hint">
                  {beforeBody.map((BodyComponent) => (
                    <BodyComponent {...componentData} />
                  ))}
                </div>
              </div>
              <Content {...componentData} />
            </div>
            {RightComponent}
          </Body>
          <Footer {...componentData} />
        </div>
      </body>
      {pageResources.js
        .filter((resource) => resource.loadTime === "afterDOMReady")
        .map((res) => JSResourceToScriptElement(res))}
    </html>
  );

  return "<!DOCTYPE html>\n" + render(doc);
}
