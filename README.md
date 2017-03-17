# JSS Styled

Styled primitives for JSS.

> This project has experimental status, so API may change

## Usage

```jsx

import Styled from 'jss-styled'

const styled = Styled({
    h1: {
        fontSize: '30px',
    },
    app: {
        padding: 10px,
    },
    button: {
        color: ({ color }) => color
    }
})


const App = () => (
    <styled.app>
        <styled.h1>Hello World!</styled.h1>

        <styled.button color="red">click me!</styled.button>
    </styled.app>    
)
```

### With custom jss setting

```jsx
import jss from 'jss'
import preset from 'jss-preset-default'

import { prepareStyled } from 'jss-styled'

const jss = createJSS(preset())
jss.use(somePlugin())

const Styled = prepareStyled({ jss })

...
```
