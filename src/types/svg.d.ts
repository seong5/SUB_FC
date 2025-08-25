declare module '*.svg' {
  import * as React from 'react'
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.svg?url' {
  const url: string
  export default url
}
