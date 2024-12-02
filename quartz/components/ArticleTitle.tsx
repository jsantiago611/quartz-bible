import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

function ArticleTitle({ fileData, displayClass }: QuartzComponentProps) {
  const title = fileData.frontmatter?.title
  const tags = fileData.frontmatter?.tags

  const isBibleTag = tags?.includes("Bible")

  if (title) {
    return (
      <h1
        class={classNames(displayClass, "article-title")}
        style={isBibleTag ? { fontFamily: "Respira" } : undefined} // Apply inline font-family if 'bible' tag is present
      >
        {title}
      </h1>
    )
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
