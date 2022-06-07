# Ghost

## Overview

This nerdpack analyses the accounts in your Organisation in New Relic, and returns a list of accounts that have not reported Metrics or Events over the last month. 

## Getting started

Clone repo then:

```
npm install
nr1 nerdpack:uuid -gf
```

To publish to your account:

```
nr1 nerdpack:publish
```

To serve locally:

```
nr1 nerdpack:serve
```

Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

## Creating new artifacts

If you want to create new artifacts run the following command:

```
nr1 create
```

> Example: `nr1 create --type nerdlet --name my-nerdlet`.
