export function renderPage(
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
): string {

  // Check if we're in a browser or server environment
  if (typeof window !== "undefined") {
    // This will log in the browser (client-side)
    console.log("Client-side Frontmatter Object:", componentData.frontmatter);
  } else {
    // This will log on the server (server-side)
    console.log("Server-side Frontmatter Object:", componentData.frontmatter);
  }

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
