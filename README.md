# indexes-ts
`indexes-ts` will create for you `index.ts` files in directories that you target in a `indexes-ts.json` file at the root of your project.

## Installation
```bash
npm install indexes-ts -D
```

## Usage
Create an `indexes-ts.json` file at the root of your project. This file will contain the directories that you want to index. For example:
```json
[
  "./stores",
  "./helpers"
]
```

Then, run the command:
```bash
indexes-ts
```

You can integrate this command to existing scripts in your `package.json` file. For example, in a Nuxt project:
```json
{
  "scripts": {
    "dev": "indexes-ts & nuxt dev"
  }
}
```
`dev` will now run `indexes-ts` before starting the Nuxt server, and will watch for changes in the directories you specified in `indexes-ts.json`.
