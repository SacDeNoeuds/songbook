## JSX Usage

You can use JSX for client-side or backend side with the following tsconfig.json:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "dom-kit/jsx",
    "paths": {
      "dom-kit/*": ["./library/dom-kit/*"]
    }
  }
}
```
