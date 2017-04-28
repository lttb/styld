# Styld

> This project has experimental status, so API may change

## Usage

### Styled function

> Note, that styles applies to the page on the function call, so it's better to use [injectStyled](#injectstyled) in most cases

```jsx
import { Styled } from 'styld'

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

### Styled function With custom jss setting

```jsx
import jss from 'jss'
import preset from 'jss-preset-default'

import { prepareStyled } from 'styld'

const jss = createJSS(preset())
jss.use(somePlugin())

const Styled = prepareStyled({ jss })

...
```

### injectStyled

This wrapper applies styles only on the first component mount.

```jsx
import injectStyled from 'styld'


const styles = {
    h1: {
        fontSize: '30px',
    },
    app: {
        padding: 10px,
    },
    button: {
        color: ({ color }) => color
    }
}

const App = ({ styled }) => (
    <styled.app>
        <styled.h1>Hello World!</styled.h1>

        <styled.button color="red">click me!</styled.button>
    </styled.app>    
)


export default injectStyled(styles)(App)
```

#### With custom Styled function

```jsx
import jss from 'jss'
import preset from 'jss-preset-default'

import injectStyled, { prepareStyled } from 'styld'


const jss = createJSS(preset())
jss.use(somePlugin())

const Styled = prepareStyled({ jss })

const styles = {
    h1: {
        fontSize: '30px',
    },
    app: {
        padding: 10px,
    },
    button: {
        color: ({ color }) => color
    }
}

const App = ({ styled }) => (
    <styled.app>
        <styled.h1>Hello World!</styled.h1>

        <styled.button color="red">click me!</styled.button>
    </styled.app>    
)


export default injectStyled(styles, Styled)(App)
```

#### StyledComponent customization

```jsx
import StyledApp from './App'


const customStyles = {
    app: {
        padding: 30px,
    },
}

const CustomApp = () => (
    // App will reassign App component styles for .app

    <App styles={customStyles} />   
)
```
