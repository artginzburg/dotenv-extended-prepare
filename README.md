# Usage

1. Install `dotenv-extended-prepare` as a development dependency:

```powershell
npm i -D dotenv-extended-prepare
```

2. Specify a `prepare` script in your package file (it will run on `npm i`)

```yaml
# package.json

"scripts": {
  "prepare": "dotenv-extended-prepare"
}
```
