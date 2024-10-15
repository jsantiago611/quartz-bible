import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/backlinks.scss"
import { resolveRelative, simplifySlug } from "../util/path"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

function Backlinks({ fileData, allFiles, displayClass, cfg }: QuartzComponentProps) {
  const slug = simplifySlug(fileData.slug!)
  const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug))

  // **NEW**: Check if the fileData has the tag "red"
  const hasRedTag = fileData.tags?.includes("red");

  return (
    <div class={classNames(displayClass, "backlinks")}>
      <h3>{i18n(cfg.locale).components.backlinks.title}</h3>
      <ul class="overflow">
        {backlinkFiles.length > 0 ? (
          backlinkFiles.map((f) => (
            <li key={f.slug}> {/* **NEW**: Added key for each mapped item */}
              <a
                href={resolveRelative(fileData.slug!, f.slug!)}
                class={classNames("internal", { "red-link": hasRedTag })} // **MODIFIED**: Conditionally add 'red-link' class
              >
                {f.frontmatter?.title}
              </a>
            </li>
          ))
        ) : (
          <li>{i18n(cfg.locale).components.backlinks.noBacklinksFound}</li>
        )}
      </ul>
    </div>
  )
}

Backlinks.css = style
export default (() => Backlinks) satisfies QuartzComponentConstructor
