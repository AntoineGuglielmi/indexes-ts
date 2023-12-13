# indexes-ts
`indexes-ts` will create for you `index.ts` files in directories that you target in a `indexes-ts.json` file at the root of your project.

## Installation
```bash
npm install indexes-ts -D
```

## Usage

### Config
Create an `indexes-ts.json` file at the root of your project. 
This file will contain an array of the directories that you want to index. For example:

```json
[
  "./types",
  {
    "dir": "./stores",
    "ignore": "notThisFile.ts"
  },
  {
    "dir": "./helpers",
    "ignore": [
      "[a-zA-Z]+.old.ts"
    ]
  }
]

```
You can specify a directory as a string, or as an object with a `dir` property and an optional `ignore` property. The `ignore` property 
can be a string or an array of strings. It will be used as a regex collection to ignore files in the directory.

### Run
Run the following command in your terminal to start scanning the directories you specified in `indexes-ts.json`:
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
