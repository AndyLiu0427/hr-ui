# Releasing

A GitHub release publishes the package. The workflow builds from a clean checkout of `main`.

## Each release

1. Set the new version in `projects/hr-ui/package.json`.
2. Commit and push to `main`.
3. Create a release with the tag `v<version>`:
   `gh release create v0.2.0 --generate-notes`
4. The `Publish` workflow tests, builds, and publishes `dist/hr-ui` to npm.

## The publish token

The workflow reads the `NPM_TOKEN` repository secret.
Make a granular access token at npmjs.com/settings/~/tokens:

| Field | Value |
| --- | --- |
| Packages and scopes | Read and write, on the `ngx-hr-ui` package |
| Bypass two-factor authentication | Enabled |

A granular token can only select a package that already exists.
So the first version (0.1.0) is published by hand from a workstation:

```sh
npm login
npm run build
cd dist/hr-ui && npm publish --access public
```
