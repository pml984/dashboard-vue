import {IconWrapper} from './Wrapper'

export const getSvgIcon = (svgIcon, iconProps) => {
  const iconElement = React.createElement(svgIcon, {
    ...iconProps
  })

  const iconWrapper = React.createElement(IconWrapper, {}, iconElement)

  return ReactDOMServer.renderToStaticMarkup(iconWrapper)
}